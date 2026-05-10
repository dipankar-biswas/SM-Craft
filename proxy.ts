// proxy.ts (Previously middleware.ts)
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/",
  "/admin/login",
  "/product",
  "/products",
  "/product-category",
  "/cart",
  "/checkout",
  "/order-success",
  "/order-tracking",
  "/about",
  "/contact",
  "/terms",
];
const LOGIN = "/login";
const ADMIN_LOGIN = "/admin/login";
const ROOT = "/";
const DASHBOARD = "/dashboard";

// ✅ Change function name from 'middleware' to 'proxy'
export async function proxy(req: NextRequest) {
  const { nextUrl } = req;

  try {
    const session = await auth();
    const isAuthenticated = !!session?.user;

    // ... rest of your logic remains the same
    if (nextUrl.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    if (nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$/)) {
      return NextResponse.next();
    }

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) =>
        nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"),
    );

    if (!isAuthenticated && !isPublicRoute) {
      const loginUrl = new URL(LOGIN, nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Handle admin login redirect to dashboard
    if (isAuthenticated && nextUrl.pathname === ADMIN_LOGIN) {
      return NextResponse.redirect(new URL(DASHBOARD, nextUrl));
    }

    // Handle regular login redirect to root
    if (isAuthenticated && nextUrl.pathname === LOGIN) {
      return NextResponse.redirect(new URL(ROOT, nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
