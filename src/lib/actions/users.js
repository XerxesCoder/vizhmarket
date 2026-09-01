"use server";

import prisma from "@/lib/prisma";

// Lightweight user lookup used by auth.js (session) — returns the fields
// needed to mint/renew a session cookie, without heavy relations.
export async function getUserByIdLight(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
    },
  });
}

export async function getUserByPhone(phone) {
  const cleaned = String(phone).replace(/\D/g, "");
  if (!cleaned) return null;
  return prisma.user.findUnique({
    where: { phone: cleaned },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
    },
  });
}