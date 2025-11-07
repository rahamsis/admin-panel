"use client";

/* eslint-disable */

import { useEffect, useState } from "react";
import { useTenant } from "@/app/context/dataContext";
import { Banner } from "@/types/webSite";
import { getBanners, insertBanners, removeBanners } from "@/lib/actions";
import { ModalQuestion } from "@/components/modales/question";

interface BannerPreview {
  idBanner: string; // si viene de la DB
  urlBanner: string;
  file?: File; // si es nuevo
  isNew?: boolean; // para distinguir estado
}

export default function Banners() {
  const { tenantId, userId } = useTenant();

  const [banners, setBanners] = useState<BannerPreview[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null)
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  // Obtener los banners actuales del tenant
  useEffect(() => {
    if (!tenantId) return;

    async function fetchData() {
      try {
        const data = await getBanners(tenantId || "");

        // Convertimos los banners de DB a previews
        const loaded = data.map((b: Banner) => ({
          idBanner: b.idBanner,
          urlBanner: b.urlBanner,
          isNew: false,
        }));

        setBanners(loaded);
      } catch (error) {
        console.error("Error obteniendo los datos:", error);
      }
    }

    fetchData();
  }, [tenantId]);

  // Cuando el usuario selecciona un archivo
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = "temp-" + Math.random().toString(36).substring(2, 9);

    const newPreview: BannerPreview = {
      idBanner: tempId,
      urlBanner: URL.createObjectURL(file),
      file,
      isNew: true,
    };

    setBanners((prev) => [...prev, newPreview]);
    e.target.value = "";
  };

  const handleRemove = async (idBanner: string) => {
    setBannerToDelete(null);

    setBanners(prev => prev.filter(b => b.idBanner !== idBanner));
    // Eliminas solo si NO es temporal
    if (!idBanner.startsWith("temp-")) {
      await removeBanners(tenantId || "", idBanner);
    }
  };

  const handleGuardar = async (idBanner: string) => {
    try {
      const banner = banners.find(b => b.idBanner === idBanner);
      if (!banner?.file) return;

      setSavingId(idBanner)

      const formdata = new FormData();
      formdata.append("userId", String(userId));
      formdata.append("file", banner.file);
      formdata.append("posicion", "heroBanner");

      const response = await insertBanners(tenantId || "", formdata);

      setBanners(prev =>
        prev.map(b =>
          b.idBanner === idBanner
            ? {
              idBanner: response.idBanner,
              urlBanner: response.urlBanner,
              isNew: false,
            }
            : b
        )
      );

      setSavingId(null)
    } catch (err) {
      console.error("Error guardando banner:", err);
    }
  };

  return (
    <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Banner Principal</h2>

      <label className="text-xs text-slate-500 text-center pb-2">
        Recomendado: 1280px x 720px en PNG/JPG
      </label>

      {/* Botón "Nuevo" */}
      <div className="flex justify-center pt-2">
        <label className="bg-cyan-500 text-white rounded cursor-pointer px-4 py-2 flex flex-row items-center">
          <i className="bi bi-plus-circle mr-2"></i>
          Nuevo
          <input
            type="file"
            id="fileInputAttribute"
            accept="image/png, image/jpeg"
            onChange={handleSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* LISTA DE PREVIEWS VERTICAL */}
      <div className="flex flex-col gap-4 mt-6">
        {banners.map(item => (
          <div
            key={item.idBanner}
            className="flex rounded overflow-hidden shadow-sm gap-1"
          >
            {/* Preview */}
            <div className="flex-1 w-11/12">
              <div className="w-full h-32">
                <img
                  src={item.urlBanner}
                  className="w-full h-full object-cover rounded"
                  alt="preview-banner"
                />
              </div>
            </div>

            {/* Botón lateral */}
            <div className="w-1/12 flex items-center justify-center">
              {item.isNew ? (
                <button
                  onClick={() => handleGuardar(item.idBanner)}
                  className="w-full h-full bg-green-600 text-white rounded hover:bg-green-700 text-center"
                >
                  {savingId === item.idBanner ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-4 lg:h-7 w-4 lg:w-7 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z"></path>
                      </svg>
                    </div>

                  ) : (<i className="bi bi-check-lg text-xl lg:text-3xl"></i>)}

                </button>
              ) : (
                <button
                  onClick={() => setBannerToDelete(item.idBanner)}
                  className="w-full h-full bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <i className="bi bi-x-lg text-xl lg:text-3xl"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {bannerToDelete && (
        <ModalQuestion
          message={"¿Estás seguro de que deseas eliminar este banner?"}
          onConfirm={() => handleRemove(bannerToDelete)}
          onClose={() => setBannerToDelete(null)}
        />
      )}
    </div>
  );
}
