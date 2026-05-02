import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

const adminRoutes = ["/admin"];
const clientRoutes = ["/client"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await betterFetch<{ user: { role: string } }>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: { cookie: request.headers.get("cookie") ?? "" },
    },
  );
  console.log("MIDDLEWARE SESSION:", JSON.stringify(session, null, 2));

  const role = session?.user?.role;

  if (authRoutes.some((r) => pathname.startsWith(r))) {
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin/foods", request.url));
    if (role === "user")
      return NextResponse.redirect(new URL("/client", request.url));
    return NextResponse.next();
  }

  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!session)
      return NextResponse.redirect(new URL("/sign-in", request.url));
    if (role !== "admin")
      return NextResponse.redirect(new URL("/sign-in", request.url));
    return NextResponse.next();
  }

  if (clientRoutes.some((r) => pathname.startsWith(r))) {
    if (!session)
      return NextResponse.redirect(new URL("/sign-in", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
