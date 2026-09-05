import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const PUBLIC_AUTH_ROUTES = ["/login", "/register"];

const PROTECTED_STUDENT_ONLY_ROUTES = [
  "/dashboard",
  "/my-courses",
  "/progress",
  "/ai-assistant",
  "/feedback",
];

const ADMIN_ROUTES_PREFIX = "/admin";
const INSTRUCTOR_ROUTES_PREFIX = "/instructor";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;

  // 1. Authenticated user visiting /login or /register
  if (session && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    const targetUrl =
      session.role === "ADMIN"
        ? "/admin"
        : session.role === "INSTRUCTOR"
        ? "/instructor"
        : "/dashboard";
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // 2. Role-Based Route Guards
  const isAdminRoute = pathname.startsWith(ADMIN_ROUTES_PREFIX);
  const isInstructorRoute = pathname.startsWith(INSTRUCTOR_ROUTES_PREFIX);
  const isStudentOnlyRoute = PROTECTED_STUDENT_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Admin User Routing
  if (session && session.role === "ADMIN") {
    if (isStudentOnlyRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (pathname === "/courses") {
      return NextResponse.redirect(new URL("/admin/courses", request.url));
    }
  }

  // Instructor User Routing
  if (session && session.role === "INSTRUCTOR") {
    if (isStudentOnlyRoute) {
      return NextResponse.redirect(new URL("/instructor", request.url));
    }
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/instructor", request.url));
    }
  }

  // Admin Route Protection
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "ADMIN") {
      const dashboardUrl = new URL(
        session.role === "INSTRUCTOR" ? "/instructor" : "/dashboard",
        request.url
      );
      dashboardUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Instructor Route Protection
  if (isInstructorRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "INSTRUCTOR" && session.role !== "ADMIN") {
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Unauthenticated user trying to access protected student routes
  if (!session && isStudentOnlyRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
