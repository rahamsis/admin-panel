"use client";

import { useState, useEffect } from "react";
import { getWebSite, updateWebSite } from "@/lib/actions";
import { useTenant } from "@/app/context/dataContext";
import { WebSite } from "@/types/webSite";
import { ModalSucces } from "@/components/modales/succes";
import { ModalAlert } from "@/components/modales/alert";

const defaultWebsite: WebSite = {
  idEmpresa: "",
  nombre: "",
  telefonoPrincipal: "",
  telefonoSecundario: "",
  direccionPrincipal: "",
  direccionSecundaria: "",
  correo: ""
}

export default function Settings() {
  const { tenantId } = useTenant();

  const [website, setWebsite] = useState<WebSite>(defaultWebsite);

  const [modalSaveMenu, setModalSaveMenu] = useState<string | null>(null);
  const [modalFailSaveMenu, setModalFailSaveMenu] = useState<string | null>(null);

  // llenar datos del sitio web
  useEffect(() => {
    if (!tenantId) return;

    async function fetchData() {
      try {
        const data = await getWebSite(tenantId || "");

        if (data.length > 0) {

          const site = data[0];
          setWebsite(data[0]);
        }
      } catch (error) {
        console.error("Error obteniendo los datos del sitio:", error);
      }
    }

    fetchData();
  }, [tenantId]);

  const handleChange = (field: keyof WebSite, value: string) => {
    setWebsite((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await updateWebSite(tenantId || "", website);

      if (response.affectedRows) {
        setModalSaveMenu("El menú fue actualizado satisfactoriamente")
      } else {
        setModalFailSaveMenu("No se pudo actualizar el menú, intentelo nuevamente")
      }

      const result = await getWebSite(tenantId || "");
      setWebsite(result[0]);

    } catch (error) {
      console.error("Error al guardar la configuración: ", error);
    }
  };

  return (
    <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Configuración del sitio</h2>

      <form onSubmit={handleGuardar}>
        <div className="flex space-y-4 p-6 justify-center">
          <div className="w-full lg:w-10/12">
            {/* Nombre */}
            <div className="flex lg:flex-row flex-col gap-6 justify-between lg:items-center my-2">
              <label className="font-medium">Nombre de la tienda</label>
              <input
                type="text"
                value={website.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className="w-full lg:w-3/4 p-2 text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button cursor-not-allowed"
                placeholder="Título"
                disabled={true}
              />
            </div>

            {/* Dirección Principal */}
            <div className="flex lg:flex-row flex-col gap-6 justify-between lg:items-center my-2">
              <label className="font-medium">Dirección Principal</label>
              <input
                type="text"
                value={website.direccionPrincipal}
                onChange={(e) => handleChange("direccionPrincipal", e.target.value)}
                className="w-full lg:w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                placeholder="Dirección principal"
              />
            </div>

            {/* Dirección Secundaria */}
            <div className="flex lg:flex-row flex-col gap-6 justify-between lg:items-center my-2">
              <label className="font-medium">Dirección Secundaria</label>
              <input
                type="text"
                value={website.direccionSecundaria}
                onChange={(e) => handleChange("direccionSecundaria", e.target.value)}
                className="w-full lg:w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                placeholder="Dirección secundaria"
              />
            </div>

            {/* Teléfono Principal */}
            {/* <div className="flex lg:flex-row flex-col gap-6 justify-between lg:items-center my-2">
              <label className="font-medium">Teléfono Principal</label>
              <input
                type="text"
                value={website.telefonoPrincipal}
                onChange={(e) => handleChange("telefonoPrincipal", e.target.value)}
                className="w-full lg:w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                placeholder="Teléfono principal"
              />
            </div> */}
            <div className="flex lg:flex-row flex-col gap-6 justify-between lg:items-center my-2">
              <label className="font-medium">Teléfono Principal</label>
              <input
                type="text"
                value={website.telefonoPrincipal}
                onChange={(e) => {
                  const value = e.target.value;
                  // Solo números y máximo 9 dígitos
                  if (/^\d{0,9}$/.test(value)) {
                    handleChange("telefonoPrincipal", value);
                  }
                }}
                className="w-full lg:w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                placeholder="Teléfono principal"
                maxLength={9} // por seguridad adicional
                inputMode="numeric" // en móviles muestra teclado numérico
              />
            </div>


            {/* Teléfono Secundario */}
            <div className="flex lg:flex-row flex-col gap-6 justify-between lg:items-center my-2">
              <label className="font-medium">Teléfono Secundario</label>
              <input
                type="text"
                value={website.telefonoSecundario}
                onChange={(e) => {
                  const value = e.target.value;
                  // Solo números y máximo 9 dígitos
                  if (/^\d{0,9}$/.test(value)) {
                    handleChange("telefonoSecundario", value);
                  }
                }}
                className="w-full lg:w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                placeholder="Teléfono secundario"
                maxLength={9} // por seguridad adicional
                inputMode="numeric" // en móviles muestra teclado numérico
              />
            </div>

            {/* Correo */}
            <div className="flex lg:flex-row flex-col gap-6 justify-between lg:items-center my-2">
              <label className="font-medium">Correo</label>
              <input
                type="email"
                value={website.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
                className="w-full lg:w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-center my-2">
          <button
            type="submit"
            className="bg-cyan-500 text-white px-4 py-2 rounded flex flex-row hover:bg-cyan-600"
          >
            Guardar
          </button>
        </div>
      </form>

      {modalSaveMenu && (
        <ModalSucces
          message={modalSaveMenu}
          onClose={() => setModalSaveMenu(null)}
        />
      )}

      {modalFailSaveMenu && (
        <ModalAlert
          message={modalFailSaveMenu}
          onClose={() => setModalFailSaveMenu(null)}
        />
      )}
    </div>
  );
}
