import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    // Intenta obtener el token JWT de NextAuth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Si no hay token => redirige al login del mismo dominio
    if (!token) {
        const loginUrl = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
    }

    // Si hay token => continúa normal
    return NextResponse.next();
}

// Configura las rutas protegidas
export const config = {
    matcher: [
        "/dashboard", // protege /dashboard
        "/dashboard/:path*", // protege cualquier subruta de /dashboard
        "/products", // protege /dashboard
    ],
};
