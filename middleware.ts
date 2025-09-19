import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 로그인하지 않은 사용자 리디렉션 (필요시)
  const isAuthenticated = request.cookies.get("krill-auth");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isPublicPage = request.nextUrl.pathname === "/";

  if (!isAuthenticated && !isAuthPage && !isPublicPage) {
    // 로그인 페이지로 리디렉션 (선택사항)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
