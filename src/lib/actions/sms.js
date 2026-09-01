"use server";

async function sendAdmin(txid) {
  const data = {
    bodyId: 394096,
    to: "09374001893",
    args: [txid],
  };

  const secretMelli = process.env.MELLI_PAYAMAK;

  try {
    const res = await fetch(
      `https://console.melipayamak.com/api/send/shared/${secretMelli}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.log(res);
      return null;
    }

    const result = await res.json();

    if (!result.recId) {
      console.log(result);
      return null;
    }
    return result;
  } catch (err) {
    console.error("SMS send error:", err);
    return null;
  }
}

export async function sendOtpSMS(reciver, otpcode) {
  const data = {
    bodyId: 393880,
    to: String(reciver),
    args: [otpcode],
  };

  const secretMelli = process.env.MELLI_PAYAMAK;

  try {
    const res = await fetch(
      `https://console.melipayamak.com/api/send/shared/${secretMelli}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.log(res.json());
      console.log(res);
      throw new Error(`خطا در ارسال پیامک `);
    }

    const result = await res.json();
    if (!result.recId) {
      throw new Error(result?.status);
    }
    return result;
  } catch (err) {
    console.error("SMS send error:", err);
    throw err;
  }
}

export async function sendFinalSMS(reciver, txid, payid) {
  const data = {
    bodyId: 393890,
    to: reciver,
    args: [txid, payid],
  };

  const secretMelli = process.env.MELLI_PAYAMAK;

  try {
    const res = await fetch(
      `https://console.melipayamak.com/api/send/shared/${secretMelli}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.log("Fetch failed:", res);
      return null;
    }

    const result = await res.json();
    await sendAdmin(txid);
    if (!result.recId) {
      console.log("SMS API failed:", result);
      return null;
    }
    return result;
  } catch (err) {
    console.error("SMS send error:", err);
    return null;
  }
}

export async function sendTrackingSMS(reciver, txid, sendWay, trackingNumber) {
  const data = {
    bodyId: 395500,
    to: reciver,
    args: [txid, sendWay, trackingNumber],
  };

  const secretMelli = process.env.MELLI_PAYAMAK;

  try {
    const res = await fetch(
      `https://console.melipayamak.com/api/send/shared/${secretMelli}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.log(res);
    }

    const result = await res.json();

    if (!result.recId) {
      console.log(result);
      //throw new Error(result?.status);
    }
    return result;
  } catch (err) {
    console.error("SMS send error:", err);
    throw err;
  }
}

export async function sendReminderSMS(reciver, txid) {
  const data = {
    bodyId: 510953,
    to: reciver,
    args: [String(txid)],
  };
  console.log(reciver, txid);

  const secretMelli = process.env.MELLI_PAYAMAK;

  try {
    const res = await fetch(
      `https://console.melipayamak.com/api/send/shared/${secretMelli}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("SMS API error:", res.status, errorText);
      throw new Error(`خطا در ارتباط با سرویس پیامک: ${res.status}`);
    }

    const result = await res.json();

    if (!result.recId) {
      console.error("SMS send failed:", result);
      throw new Error(result?.status || "ارسال پیامک با خطا مواجه شد");
    }

    return result;
  } catch (err) {
    console.error("SMS send error:", err);
    throw err;
  }
}
