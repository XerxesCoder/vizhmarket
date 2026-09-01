"use server";

import { getUserByIdLight } from "@/lib/actions/users";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { sendOtpSMS } from "@/lib/actions/sms";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES);
const SESSION_EXPIRY_DAYS = Number(process.env.SESSION_EXPIRY_DAYS);

const secretKey = new TextEncoder().encode(JWT_SECRET);

const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCKOUT_MINUTES = 5;
const MAX_OTP_SENDS_PER_PHONE = 3;
const OTP_SEND_WINDOW_MINUTES = 5;

const otpAttempts = new Map();
const otpSendCounts = new Map();

const SESSION_COOKIE_NAME = "_vizhSession";
const RENEW_THRESHOLD_DAYS = 3;
const DAY_IN_SECONDS = 24 * 60 * 60;

function getSessionMaxAgeSeconds() {
  return SESSION_EXPIRY_DAYS * DAY_IN_SECONDS;
}

function shouldRenewSession(payload) {
  if (!payload?.exp) return true;
  const remainingMs = payload.exp * 1000 - Date.now();
  const thresholdMs = RENEW_THRESHOLD_DAYS * DAY_IN_SECONDS * 1000;
  return remainingMs < thresholdMs;
}

async function setSessionCookie(user) {
  const cookieStore = await cookies();

  const token = await generateAuthToken(user.id, user.role === "ADMIN");

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: getSessionMaxAgeSeconds(),
    path: "/",
  });
}

async function clearSessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {}
}

function generateOtp() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (100000 + (array[0] % 900000)).toString();
}

async function generateAuthToken(userId, isAdmin) {
  return await new SignJWT({ userId, isAdmin })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_DAYS}d`)
    .sign(secretKey);
}

export async function sendOtp(phoneNumber, step) {
  const cleanedPhone = phoneNumber.replace(/\D/g, "");

  const sendRecord = otpSendCounts.get(cleanedPhone);
  if (sendRecord && sendRecord.count >= MAX_OTP_SENDS_PER_PHONE) {
    const elapsed = (Date.now() - sendRecord.windowStart) / 60000;
    if (elapsed < OTP_SEND_WINDOW_MINUTES) {
      return {
        error: `تعداد درخواست‌ها بیش از حد مجاز است. لطفاً ${Math.ceil(OTP_SEND_WINDOW_MINUTES - elapsed)} دقیقه صبر کنید`,
      };
    }
    otpSendCounts.delete(cleanedPhone);
  }

  const attemptRecord = otpAttempts.get(cleanedPhone);
  if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
    const remaining = Math.ceil(
      (attemptRecord.lockedUntil - Date.now()) / 60000,
    );
    return { error: `حساب شما قفل شده است. لطفاً ${remaining} دقیقه صبر کنید` };
  }

  const otp = generateOtp();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

  try {
    const user = await prisma.user.findUnique({
      where: { phone: cleanedPhone },
    });

    if (step === "in" && !user) {
      throw new Error("کاربری یافت نشد");
    }

    if (step === "out" && user) {
      throw new Error("قبلا با این شماره ثبت نام کرده اید");
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`Your OTP code is: ${otp}`);
    } else {
      await sendOtpSMS(cleanedPhone, otp);
    }

    await prisma.otpToken.upsert({
      where: { phone: cleanedPhone },
      update: {
        token: otp,
        phone: cleanedPhone,
        expiresAt,
      },
      create: {
        token: otp,
        phone: cleanedPhone,
        expiresAt,
      },
    });

    const existingSend = otpSendCounts.get(cleanedPhone);
    if (
      existingSend &&
      Date.now() - existingSend.windowStart < OTP_SEND_WINDOW_MINUTES * 60000
    ) {
      otpSendCounts.set(cleanedPhone, {
        count: existingSend.count + 1,
        windowStart: existingSend.windowStart,
      });
    } else {
      otpSendCounts.set(cleanedPhone, { count: 1, windowStart: Date.now() });
    }

    return { success: true, message: "کد یکبار مصرف با موفقیت ارسال شد" };
  } catch (error) {
    console.error("خطا در ارسال کد:", error);
    return { error: error.message };
  }
}

export async function verifyOtp(phoneNumber, otp, signUpData) {
  const cleanedPhone = phoneNumber.replace(/\D/g, "");

  try {
    const attemptRecord = otpAttempts.get(cleanedPhone);
    if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
      const remaining = Math.ceil(
        (attemptRecord.lockedUntil - Date.now()) / 60000,
      );
      throw new Error(
        `حساب شما قفل شده است. لطفاً ${remaining} دقیقه صبر کنید`,
      );
    }

    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        phone: cleanedPhone,
        token: otp,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      const current = otpAttempts.get(cleanedPhone) || {
        count: 0,
        lockedUntil: 0,
      };
      const newCount = current.count + 1;
      if (newCount >= MAX_OTP_ATTEMPTS) {
        otpAttempts.set(cleanedPhone, {
          count: newCount,
          lockedUntil: Date.now() + OTP_LOCKOUT_MINUTES * 60000,
        });
        throw new Error(
          "تعداد تلاش‌ها بیش از حد مجاز است. حساب شما برای ۵ دقیقه قفل شد",
        );
      }
      otpAttempts.set(cleanedPhone, { count: newCount, lockedUntil: 0 });
      throw new Error("کد وارد شده اشتباه است");
    }

    otpAttempts.delete(cleanedPhone);

    let user = await prisma.user.findUnique({
      where: { phone: cleanedPhone },
    });

    if (!user && signUpData) {
      if (!signUpData.name?.trim() || !signUpData.phone?.trim()) {
        throw new Error("اطلاعات ثبت نام ناقص است");
      }
      user = await prisma.user.create({
        data: {
          name: signUpData.name,
          phone: cleanedPhone,
        },
      });
    }

    if (!user) {
      throw new Error("کاربری یافت نشد");
    }

    await setSessionCookie(user);
    await prisma.otpToken.deleteMany({ where: { phone: cleanedPhone } });

    return { success: true, user };
  } catch (error) {
    console.error("خطا در تایید کد:", error);
    return { error: error.message };
  }
}

export async function getCurrentUser(options = {}) {
  const { withRenew = false } = options;

  const cookieStore = await cookies();
  const authToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!authToken) {
    return null;
  }

  let payload;

  try {
    const verified = await jwtVerify(authToken, secretKey);
    payload = verified.payload;
  } catch {
    await clearSessionCookie();
    return null;
  }

  let user;

  try {
    user = await getUserByIdLight(payload.userId);
  } catch {
    return null;
  }

  if (!user) {
    await clearSessionCookie();
    return null;
  }

  if (withRenew && shouldRenewSession(payload)) {
    try {
      await setSessionCookie(user);
    } catch {}
  }

  return user;
}

export async function logoutUser() {
  await clearSessionCookie();

  return {
    success: true,
  };
}

export const isUserAdmin = async () => {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!authToken) return false;
    const { payload } = await jwtVerify(authToken, secretKey);
    return payload?.isAdmin;
  } catch (err) {
    return false;
  }
};

export async function renewSessionIfNeeded() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!authToken) {
    return {
      success: false,
      renewed: false,
      reason: "no-session",
    };
  }

  let payload;

  try {
    const verified = await jwtVerify(authToken, secretKey);
    payload = verified.payload;
  } catch {
    await clearSessionCookie();

    return {
      success: false,
      renewed: false,
      reason: "invalid-session",
    };
  }

  const user = await getUserByIdLight(payload.userId);

  if (!user) {
    await clearSessionCookie();

    return {
      success: false,
      renewed: false,
      reason: "user-not-found",
    };
  }

  if (!shouldRenewSession(payload)) {
    return {
      success: true,
      renewed: false,
      reason: "not-due-yet",
    };
  }

  try {
    await setSessionCookie(user);

    return {
      success: true,
      renewed: true,
    };
  } catch {
    return {
      success: false,
      renewed: false,
      reason: "unable-to-renew-cookie",
    };
  }
}
