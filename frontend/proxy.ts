import { NextRequest, NextResponse } from "next/server";

// Optimistic auth check: only verifies the auth cookie is present.
// The backend still performs the real JWT/role verification on every API call.
export default function proxy(req: NextRequest) {
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const token = req.cookies.get("token")?.value;

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
