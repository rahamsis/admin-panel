"use client";

import { useState, useEffect } from "react";
import { getWebSite, updateWebSite } from "@/lib/actions";
import { useTenant } from "@/app/context/dataContext";
import { WebSite } from "@/types/webSite";
import { ModalSucces } from "@/components/modales/succes";
import { ModalAlert } from "@/components/modales/alert";
import { CirclePlus } from "lucide-react";

const defaultWebsite: WebSite = {
  idEmpresa: "",
  nombre: "",
  telefonoPrincipal: "",
  telefonoSecundario: "",
  direccionPrincipal: "",
  direccionSecundaria: "",
  correo: "",
  logo: ""
}

interface FotoPreview {
  urlFoto: string;
  file?: File; // opcional, solo para las nuevas imágenes que aún no están en la DB
}

export default function Settings() {
  const { tenantId, userId } = useTenant();

  const [website, setWebsite] = useState<WebSite>(defaultWebsite);
  const [isLoading, setIsLoading] = useState(false);

  const [modalSaveMenu, setModalSaveMenu] = useState<string | null>(null);
  const [modalFailSaveMenu, setModalFailSaveMenu] = useState<string | null>(null);

  const [preview, setPreview] = useState<FotoPreview | null>(null);
  const [alertImagen, setAlertImagen] = useState("");

  // llenar datos del sitio web
  useEffect(() => {
    if (!tenantId) return;

    async function fetchData() {
      try {
        const data = await getWebSite(tenantId || "");
        if (data.length > 0) {
          setWebsite(data[0]);
          if (data[0].logo) setPreview({ urlFoto: data[0].logo })

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

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const selected: FotoPreview = {
      urlFoto: URL.createObjectURL(file),
      file,
    };

    setPreview(selected);
    setAlertImagen("");
    e.target.value = "";
  };

  const handleRemove = () => {
    setPreview(null);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!preview) {
      setAlertImagen("Ingrese una imagen para continuar")
      return;
    }

    setIsLoading(true)

    //creamos el formData ya que no se puede mandar el file directamente:
    const formdata = new FormData();
    formdata.append("idEmpresa", String(website.idEmpresa));
    formdata.append("nombre", String(website.nombre));
    formdata.append("telefonoPrincipal", String(website.telefonoPrincipal));
    formdata.append("telefonoSecundario", String(website.telefonoSecundario));
    formdata.append("direccionPrincipal", String(website.direccionPrincipal));
    formdata.append("direccionSecundaria", String(website.direccionSecundaria));
    formdata.append("correo", String(website.correo));
    formdata.append("userId", String(userId));
    if (preview?.file) {
      formdata.append("file", preview.file);
    }

    try {
      const response = await updateWebSite(tenantId || "", formdata);

      if (response.affectedRows) {
        setIsLoading(false)
        setModalSaveMenu("Los datos fueron actualizados satisfactoriamente")
      } else {
        setIsLoading(false)
        setModalFailSaveMenu("No se pudo actualizar los datos, intentelo nuevamente")
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
            < div className="flex flex-col pb-4">
              {/* Imagenes del producto */}
              <div className="">
                {/* Input oculto */}
                <input
                  type="file"
                  id="fileInputAttribute"
                  accept="image/png"
                  multiple
                  onChange={handleSelect}
                  className="hidden"
                />

                {/* Cuadrícula de previews */}
                <div className="flex lg:flex-row flex-row justify-center gap-4">
                  {/* Botón cuadrado para seleccionar */}
                  {preview === null && (
                    <label
                      htmlFor="fileInputAttribute"
                      className="w-full h-28 border-2 flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:border-2"
                    >
                      <CirclePlus className="text-gray-400 w-10 h-10"></CirclePlus>
                    </label>
                  )}

                  {/* Imágenes seleccionadas */}
                  {preview !== null && (
                    <div className="relative w-full h-28 border">
                      <img
                        src={preview.urlFoto}
                        alt={`previewLogo`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemove()}
                        className="absolute w-5 h-5 top-1 right-1 flex items-center justify-center bg-red-600 text-white rounded-full p-1"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <label className="text-xs text-slate-500 text-center pb-2">
                De preferencia una imagen 800px x 400px sin fondo en formato png
              </label>
              {alertImagen && (
                <a className="text-red-500 text-xs">{alertImagen}</a>
              )}
            </div>

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
            {
              isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z"></path>
                  </svg>
                  Cargando...
                </div>
              ) : (
                "Guardar"
              )}
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
