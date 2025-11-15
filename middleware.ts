import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/session-login") ||
    pathname.startsWith("/api/session-logout") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/";

  if (isPublic) return NextResponse.next();

  //Verify cookie of session
  const session = req.cookies.get("session")?.value;
  if (!session) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  try {
    await adminAuth.verifySessionCookie(session, true);
    return NextResponse.next();
  } catch {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}
// Protect all except public url
export const config = {
  matcher: [
    "/((?!api/session-login|api/session-logout|auth|_next|favicon.ico).*)",
  ],
};
