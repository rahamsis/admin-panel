// 'use client';

// import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import { useTenant } from "@/app/context/dataContext";
// import Image from "next/image";
// import { Menu, X } from "lucide-react";

// import { usePathname } from "next/navigation";

// const Sidebar = () => {
//   const { tenantId } = useTenant();
//   const pathname = usePathname();

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false); // 2 en móvil, 6 en desktop

//   // Detectar tamaño de pantalla para 2 / 6 visibles
//   useEffect(() => {
//     const check = () => {
//       setIsMobile(window.innerWidth >= 1024 ? false : true)
//       setIsSidebarOpen(window.innerWidth >= 1024 ? true : false)
//     };
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   return (
//     <>
//       {isMobile &&
//         <div
//           className={`fixed inset-0 z-40 bg-black/50 ${(isSidebarOpen) ? "block" : "hidden"}`}
//         />
//       }

//       <div className="absolute top-4 left-4 lg:hidden z-50">
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="absolute w-8 h-8 flex items-center justify-center
//                rounded-md border bg-white text-gray-500 cursor-pointer
//                hover:text-gray-900 hover:bg-gray-100 transition-transform duration-300"
//         >
//           {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//         </button>
//       </div>

//       <div
//         className={`fixed inset-y-0 left-0 z-50 lg:flex flex-col bg-sidebar border-r border-gray-200 
//               transition-all duration-500 ease-in-out md:relative md:z-0 
//               ${isSidebarOpen ? "w-52" : "w-16 hidden"}`}
//       >
//         {/* Header */}
//         <div className="flex items-center p-4 text-2xl font-bold text-blue-600">
//           {/* Texto Admin Panel */}
//           <span className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}>
//             {/* {tenantId} */}
//             <Image
//               src={`/images/${tenantId}.png`}
//               alt={tenantId || ""}
//               width={150}
//               height={50}
//               priority={true}
//             />
//           </span>
//         </div>
//         {/* Botón toggle (siempre visible) */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="absolute top-4 right-[-12px] w-8 h-8 flex items-center justify-center
//                rounded-md border bg-white text-gray-500 cursor-pointer
//                hover:text-gray-900 hover:bg-gray-100 transition-transform duration-300"
//         >
//           {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//         </button>

//         {/* Navegación */}
//         <nav className="flex-1 space-y-2 text-zinc-400">
//           <Link
//             href="/dashboard"
//             className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/dashboard" ? "bg-sidebarDark text-white" : ""}`}
//           >
//             <i className="bi bi-house-door-fill"></i>
//             <span
//               className={`transition-all duration-500 ease-in-out
//                     ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
//             >
//               Dashboard
//             </span>
//           </Link>

//           <Link
//             href="/settings"
//             className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/settings" ? "bg-sidebarDark text-white" : ""}`}
//           >
//             <i className="bi bi-gear-fill"></i>
//             <span
//               className={`transition-all duration-500 ease-in-out
//                     ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
//             >
//               Configuración
//             </span>
//           </Link>

//           <Link
//             href="/products"
//             className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/products" ? "bg-sidebarDark text-white" : ""}`}
//           >
//             <i className="bi bi-box-seam-fill"></i>
//             <span
//               className={`transition-all duration-500 ease-in-out
//                     ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
//             >
//               Productos
//             </span>
//           </Link>

//           <Link
//             href="/categories"
//             className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/categories" ? "bg-sidebarDark text-white" : ""}`}
//           >
//             <i className="bi bi-clipboard-data-fill"></i>
//             <span
//               className={`transition-all duration-500 ease-in-out
//                     ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
//             >
//               Categorias
//             </span>
//           </Link>

//           <Link
//             href="/sub-categories"
//             className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/sub-categories" ? "bg-sidebarDark text-white" : ""}`}
//           >
//             <i className="bi bi-hdd-stack-fill"></i>
//             <span
//               className={`transition-all duration-500 ease-in-out
//                     ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
//             >
//               SubCategorias
//             </span>
//           </Link>

//           <Link
//             href="/brands"
//             className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/brands" ? "bg-sidebarDark text-white" : ""}`}
//           >
//             <i className="bi bi-handbag-fill"></i>
//             <span
//               className={`transition-all duration-500 ease-in-out
//                     ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
//             >
//               Marcas
//             </span>
//           </Link>

//           <Link
//             href="/colors"
//             className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/colors" ? "bg-sidebarDark text-white" : ""}`}
//           >
//             <i className="bi bi-palette-fill"></i>
//             <span
//               className={`transition-all duration-500 ease-in-out
//                     ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
//             >
//               Colores
//             </span>
//           </Link>
//         </nav>
//       </div>

//     </>
//   );
// };

// export default Sidebar;

'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTenant } from "@/app/context/dataContext";
import Image from "next/image";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { tenantId } = useTenant();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil o desktop
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // en desktop abierto, en móvil cerrado
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* Overlay oscuro solo en móvil */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 bg-black/50 ${isSidebarOpen ? "block" : "hidden"
            }`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Botón hamburguesa (solo en móviles) */}
      {/* {isMobile && (
        <div className="absolute top-4 left-4 lg:hidden z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 flex items-center justify-center
               rounded-md border bg-white text-gray-500 cursor-pointer
               hover:text-gray-900 hover:bg-gray-100 transition-transform duration-300"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      )} */}
      {/* Botón toggle en móviles */}
      {isMobile && (
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-4 z-50 w-10 h-10 flex items-center justify-center rounded-md border bg-white text-gray-500 cursor-pointer
          hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ${isSidebarOpen ? "z-[100] left-48" : "left-4"}`}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-gray-200 transition-all duration-500 ease-in-out
        ${isMobile ? (isSidebarOpen ? "w-52" : "w-0 overflow-hidden") : isSidebarOpen ? "w-52" : "w-16"}
        ${isMobile ? "" : "lg:relative lg:z-0"}`}
      >
        {/* Header */}
        {(!isMobile || isSidebarOpen) && (
          <div className="flex items-center p-4 text-2xl font-bold text-blue-600">
            <span className={`transition-all duration-500 ease-in-out overflow-hidden ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
            >
              <Image
                src={`/images/${tenantId}.png`}
                alt={tenantId || ""}
                width={150}
                height={50}
                priority
              />
            </span>
          </div>
        )}

        {/* Toggle en Desktop (adelgazar/expandir) */}
        {!isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 right-[-12px] w-8 h-8 flex items-center justify-center rounded-md border bg-white text-gray-500 cursor-pointer
             hover:text-gray-900 hover:bg-gray-100 transition-transform duration-300"
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}

        {/* Navegación */}
        {(!isMobile || isSidebarOpen) && (
          <nav className="flex-1 space-y-2 text-zinc-400 mt-2">

            <Link
              href={"/dashboard"}
              className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === "/dashboard" ? "bg-sidebarDark text-white" : ""}`}
            >
              <i className="bi bi-house-door-fill"></i>
              <span
                onClick={() => { if (isMobile) setIsSidebarOpen(false) }}
                className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
              >
                Dashboard
              </span>
            </Link>

            <div className="border-t" />

            <div>
              <a className="font-semibold ml-3">TIENDA</a>
            </div>

            {[
              { href: "/settings", icon: "bi-gear-fill", label: "Configuración" },
              { href: "/products", icon: "bi-box-seam-fill", label: "Productos" },
              { href: "/categories", icon: "bi-clipboard-data-fill", label: "Categorias" },
              { href: "/sub-categories", icon: "bi-hdd-stack-fill", label: "SubCategorias" },
              { href: "/brands", icon: "bi-handbag-fill", label: "Marcas" },
              { href: "/colors", icon: "bi-palette-fill", label: "Colores" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === item.href ? "bg-sidebarDark text-white" : ""}`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span
                  onClick={() => { if (isMobile) setIsSidebarOpen(false) }}
                  className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="border-t" />

            <div>
              <a className="font-semibold ml-3">PERSONALIZAR</a>
            </div>
            {[
              { href: "/menu", icon: "bi bi-menu-button-wide-fill", label: "Menu" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 flex items-center gap-2 p-2 hover:bg-sidebarDark overflow-hidden ${pathname === item.href ? "bg-sidebarDark text-white" : ""}`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span
                  onClick={() => { if (isMobile) setIsSidebarOpen(false) }}
                  className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </>
  );
};

export default Sidebar;
