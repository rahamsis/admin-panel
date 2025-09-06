// // app/ClientLayout.tsx (client component)
"use client";

/* eslint-disable */

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";

import { usePathname } from "next/navigation";

export default function ClientLayout({ children, session }: { children: React.ReactNode; session: any }) {
  const pathname = usePathname(); // Esto funciona en cliente
  const showNav = session && pathname !== "/";
  console.log("session: ",session)

  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla para 2 / 6 visibles
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth >= 1024 ? false : true)
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {showNav && <Sidebar />}
      <div className="flex flex-col flex-1">
        {showNav && <Navbar />}
        <main className={`p-6 overflow-y-auto ${isMobile && "ml-16"}`}>{children}</main>
      </div>
    </div>
  );
}

