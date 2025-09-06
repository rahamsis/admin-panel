import Providers from "./providers";
import ClientLayout from "./clientLayout";
import { getServerSession } from "next-auth";
import authOptions from '../lib/authOptions';
import type { Metadata } from "next";
import "../styles/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const urlIcon = `/images/${session?.user?.tenantId || "default"}.ico`;

  return {
    title: "Panel Administrativo",
    description: "Panel Administrativo multi tenant",
    icons: {
      icon: urlIcon,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout session={session}>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}