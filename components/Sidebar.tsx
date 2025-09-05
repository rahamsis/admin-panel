'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
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

      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all 
        duration-500 ease-in-out "md:relative md:z-0" ${(isSidebarOpen) ? "w-64" : "w-16"}`}>
        <div className="flex justify-between items-center p-4 text-2xl font-bold text-blue-600">
          <h2 className="">Admin Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-transform duration-300"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg">
            <i className="bi bi-house-door-fill"></i> Dashboard
          </Link>
          <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg">
            <i className="bi bi-gear-fill"></i> Configuración
          </Link>
          <Link href="/products" className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg">
            <i className="bi bi-box-seam-fill"></i> Productos
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;