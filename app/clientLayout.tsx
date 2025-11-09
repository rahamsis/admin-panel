// // app/ClientLayout.tsx (client component)
"use client";

/* eslint-disable */

import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import React from "react";
import { TenantProvider } from "./context/dataContext";
import { usePathname } from "next/navigation";
import { useAutoLogout } from "@/hook/useAutoLogout";

import { SessionExpiredProvider } from "@/components/session-expired-context";
import SessionExpiredModal from "@/components/modales/SessionExpiredModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname(); // Esto funciona en cliente

  const showNav = pathname !== "/";
  const tenantId = session?.user?.tenantId;
  const userId = session?.user?.userId;

  // useAutoLogout();

  return (

    <SessionExpiredProvider>
      {/* Aquí ya existe el Provider, así que el hook no rompe */}
      <AutoLogoutWrapper />

      <SessionExpiredModal />

      <TenantProvider tenantId={tenantId ?? undefined} userId={userId ?? undefined}>
        <div className="flex h-screen bg-gray-100">
          {showNav && <Sidebar />}
          <div className="flex flex-col flex-1">
            {showNav && <Navbar />}
            <main className={`p-0 lg:p-6 overflow-y-auto`}>{children}</main>
          </div>
        </div>
      </TenantProvider>
    </SessionExpiredProvider>

  );
}

function AutoLogoutWrapper() {
  useAutoLogout();
  return null;
}

