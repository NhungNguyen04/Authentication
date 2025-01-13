import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
    DEFAULT_LOGIN_REDIRECT
} from '@/routes'
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
    const { nextUrl } = req;

    const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiRoute) {
        return NextResponse.next();
    }

    if (isAuthRoute) {
        if (req.auth) {
            console.log(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin))
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin));
        }
        return NextResponse.next();
    }

    if (!req.auth && !isPublicRoute) {
        console.log(new URL("/auth/login", nextUrl.origin))
        return Response.redirect(new URL("/auth/login", nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [// Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',]
}
