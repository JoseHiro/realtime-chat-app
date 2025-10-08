// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const protectedPaths = ["/chat", "/settings"];
  const authPages = ["/login", "/signup"];
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

  // 未ログインで保護ページ → ログインへ
  if (protectedPaths.some((p) => path.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ログイン済みでログイン・サインアップページ → ダッシュボードへ
  if (authPages.some((p) => path.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  if (path === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  // 未ログイン状態でsignupページに行こうとするとプラン選択ページに戻る
  if (path === "/signup" && !isLoggedIn && !plan) {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  return NextResponse.next();
}
