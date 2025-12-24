// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const adminToken = req.cookies.get("admin_token")?.value;
  const protectedPaths = ["/new", "/settings"];
  const authPages = ["/login", "/signup"];
  const adminPaths = ["/admin"];
  const adminLoginPath = "/admin/login";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const path = req.nextUrl.pathname;
  const url = req.nextUrl;
  const plan = url.searchParams.get("plan");

  // ログインしているか確認
  let isLoggedIn = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      isLoggedIn = !!payload.userId;
    } catch {
      isLoggedIn = false;
    }
  }

  // Admin authentication check
  let isAdmin = false;
  if (adminToken) {
    try {
      const { payload } = await jwtVerify(adminToken, secret);
      isAdmin = payload.isAdmin === true && !!payload.userId;
    } catch (err) {
      console.error("Admin token verification failed:", err);
      isAdmin = false;
    }
  }

  // Admin routes protection
  // Only protect /admin (exact match) and /admin/* but allow /admin/login and /admin/setup
  if (
    (path === "/admin" ||
      (path.startsWith("/admin/") &&
        path !== adminLoginPath &&
        path !== "/admin/setup")) &&
    !isAdmin
  ) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Redirect admin from login page if already logged in
  if (path === adminLoginPath && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 未ログインで保護ページ → ログインへ
  if (protectedPaths.some((p) => path.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ログイン済みでログイン・サインアップページ → ダッシュボードへ
  if (authPages.some((p) => path.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/new", req.url));
  }

  if (path === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/new", req.url));
  }

  // 未ログイン状態でsignupページに行こうとするとプラン選択ページに戻る
  if (path === "/signup" && !isLoggedIn && !plan) {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  return NextResponse.next();
}
