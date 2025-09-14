// // app/ClientLayout.tsx (client component)
"use client";

/* eslint-disable */

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { TenantProvider } from "./context/dataContext";

import { usePathname } from "next/navigation";

export default function ClientLayout({ children, session }: { children: React.ReactNode; session: any }) {
  const pathname = usePathname(); // Esto funciona en cliente
  const showNav = session && pathname !== "/";
  const tenantId = session?.user?.tenantId;
  const userId = session?.user?.userId;

  return (
    <TenantProvider tenantId={tenantId} userId={userId}>
    <div className="flex h-screen bg-gray-100">
      {showNav && <Sidebar />}
      <div className="flex flex-col flex-1">
        {showNav && <Navbar />}
        <main className={`p-0 lg:p-6 overflow-y-auto`}>{children}</main>
      </div>
    </div>
    </TenantProvider>
  );
}

