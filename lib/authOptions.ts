// pages/api/auth/[...nextauth].ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type User = {
    id: string;
    tenantId: string;
    email: string | null | undefined;
    name: string | null | undefined;
    providerId: string | null | undefined;
    userDevice: string | null | undefined;
    userIp: string | null | undefined;
    accessToken?: string | null | undefined;
    welcome?: number | null | undefined;
    menu?: string[] | null | undefined;
    perfil?: string | null | undefined;
};

declare module "next-auth" {
    interface Session {
        activeSession?: boolean;
        accessToken?: string;
    }
}

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                tenantId: { label: "Tenant", type: "text" },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.APP_BACK_END}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-tenant-id": credentials?.tenantId || "",
                    },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                });

                const data = await res.json();
                if (!res.ok) return null;

                return { ...data.user, accessToken: data.access_token, tenantId: credentials?.tenantId };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as User).accessToken;
                token.tenantId = (user as User).tenantId;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined;
            // Asegurar que `session.user` existe y agregar `userId`
            session.user = session.user || {};
            session.user.tenantId = token.tenantId as string | undefined;
            return session;
        },
        // async redirect({ url, baseUrl }) {
        //     try {
        //         const currentOrigin =
        //             typeof window !== "undefined"
        //                 ? window.location.origin
        //                 : baseUrl; // en server, cae a baseUrl

        //         // Si url es relativo => lo juntamos con el origen actual
        //         if (url.startsWith("/")) return `${currentOrigin}${url}`;

        //         // Si la url tiene el mismo dominio que el actual => la permitimos
        //         if (new URL(url).origin === currentOrigin) return url;

        //         // Default: dashboard en el dominio actual
        //         return `${currentOrigin}/dashboard`;
        //     } catch (e) {
        //         return `${baseUrl}/dashboard`;
        //     }
        // },
        async redirect({ url, baseUrl }) {
            // Si ya viene una URL absoluta, respétala (aunque no coincida con NEXTAUTH_URL)
            if (url.startsWith("http")) return url;

            // Si es relativo, júntalo con el baseUrl
            if (url.startsWith("/")) return `${baseUrl}${url}`;

            // Fallback
            return `${baseUrl}/dashboard`;
        },
    },
};

export default authOptions;