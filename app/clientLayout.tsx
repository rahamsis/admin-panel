// // app/ClientLayout.tsx (client component)
"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import { usePathname } from "next/navigation";

export default function ClientLayout({ children, session }: { children: React.ReactNode; session: any }) {
  const pathname = usePathname(); // Esto funciona en cliente
  const showNav = session && pathname !== "/";

  return (
    <div className="flex h-screen bg-gray-100">
      {showNav && <Sidebar />}
      <div className="flex flex-col flex-1">
        {showNav && <Navbar />}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

