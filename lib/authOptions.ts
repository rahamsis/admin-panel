// pages/api/auth/[...nextauth].ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchUserLogin } from "./session";

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
                email: {},
                password: {},
                tenantId: {},
            },
            async authorize(credentials: any) {
                const { email, password, tenantId } = credentials;

                try {
                    const response = await fetchUserLogin(email as string, password as string, tenantId as string);

                    if (!response || !response.user) {
                        throw new Error(response?.message || "Credenciales inválidas");
                    }

                    return { ...response, accessToken: response.access_token, tenantId: credentials?.tenantId };
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message || "Error. Credenciales Invalidas");
                    } else {
                        throw new Error("Error!. Credenciales Invalidas");
                    }
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 10 * 60 * 60 // 8 horas
    },
    jwt: {
        maxAge: 10 * 60 * 60 // 8 horas
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as User).accessToken;
                token.tenantId = (user as User).tenantId;
                token.userId = (user as User).id || "";
                token.perfil = (user as User).perfil || "";
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined;
            // Asegurar que `session.user` existe y agregar `userId`
            session.user = session.user || {};
            session.user.userId = token.userId as string | undefined;
            session.user.tenantId = token.tenantId as string | undefined;
            session.user.perfil = token.perfil as string | undefined;
            return session;
        },
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