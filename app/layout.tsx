import Providers from "./providers";
import ClientLayout from "./clientLayout";
import { getServerSession } from "next-auth";
import authOptions from '../lib/authOptions';
import "../styles/globals.css";

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