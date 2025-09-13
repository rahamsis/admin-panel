'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTenant } from "@/app/context/dataContext";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { tenantId } = useTenant();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // 2 en móvil, 6 en desktop

  // Detectar tamaño de pantalla para 2 / 6 visibles
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth >= 1024 ? false : true)
      setIsSidebarOpen(window.innerWidth >= 1024 ? true : false)
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {isMobile &&
        <div
          className={`fixed inset-0 z-40 bg-black/50 ${(isSidebarOpen) ? "block" : "hidden"}`}
        />
      }

      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-gray-200 
              transition-all duration-500 ease-in-out md:relative md:z-0
              ${isSidebarOpen ? "w-52" : "w-16"}`}
      >
        {/* Header */}
        <div className="flex items-center p-4 text-2xl font-bold text-blue-600">
          {/* Texto Admin Panel */}
          <span className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}>
            {/* {tenantId} */}
            <Image
              src={`/images/${tenantId}.png`}
              alt={tenantId || ""}
              width={150}
              height={50}
              priority={true}
            />
          </span>
        </div>
        {/* Botón toggle (siempre visible) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 right-[-12px] w-8 h-8 flex items-center justify-center
               rounded-md border bg-white text-gray-500 cursor-pointer
               hover:text-gray-900 hover:bg-gray-100 transition-transform duration-300"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Navegación */}
        <nav className="flex-1 space-y-2 text-zinc-400">
          <Link
            href="/dashboard"
            className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/dashboard" ? "bg-sidebarDark text-white" : ""}`}
          >
            <i className="bi bi-house-door-fill"></i>
            <span
              className={`transition-all duration-500 ease-in-out
                    ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
            >
              Dashboard
            </span>
          </Link>

          <Link
            href="/settings"
            className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/settings" ? "bg-sidebarDark text-white" : ""}`}
          >
            <i className="bi bi-gear-fill"></i>
            <span
              className={`transition-all duration-500 ease-in-out
                    ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
            >
              Configuración
            </span>
          </Link>

          <Link
            href="/products"
            className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/products" ? "bg-sidebarDark text-white" : ""}`}
          >
            <i className="bi bi-box-seam-fill"></i>
            <span
              className={`transition-all duration-500 ease-in-out
                    ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
            >
              Productos
            </span>
          </Link>

          <Link
            href="/categories"
            className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/categories" ? "bg-sidebarDark text-white" : ""}`}
          >
            <i className="bi bi-clipboard-data-fill"></i>
            <span
              className={`transition-all duration-500 ease-in-out
                    ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
            >
              Categorias
            </span>
          </Link>
        </nav>
      </div>

    </>
  );
};

export default Sidebar;