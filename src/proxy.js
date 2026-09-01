import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
const SESSION_COOKIE_NAME = "_vizhSession";

export default async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  if (pathname.startsWith("/login")) {
    const authToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (authToken) {
      try {
        await jwtVerify(authToken, secretKey);
        return NextResponse.redirect(new URL("/profile", request.url));
      } catch {}
    }
  }

  const protectedPaths = isDev ? ["/profile"] : ["/admin", "/profile"];
  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));

  if (needsAuth) {
    const authToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!authToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(authToken, secretKey);

      if (pathname.startsWith("/admin") && !payload.isAdmin) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    } catch {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "invalid_token");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
