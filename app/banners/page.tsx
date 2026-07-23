"use client";

/* eslint-disable */

import { useEffect, useState } from "react";
import { useTenant } from "@/app/context/dataContext";
import { Banner } from "@/types/webSite";
import { getBanners, insertBanners, removeBanners, updateBanners } from "@/lib/actions";
import { ModalQuestion } from "@/components/modales/question";

interface BannerPreview {
  idBanner: string;
  urlBanner: string;
  file?: File;
  isNew?: boolean;
  title?: string;
  description?: string;
  initialTitle?: string;
  initialDescription?: string;
}

export default function Banners() {
  const { tenantId, userId } = useTenant();

  const [banners, setBanners] = useState<BannerPreview[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    async function fetchData() {
      try {
        const data = await getBanners(tenantId || "");

        const loaded = data.map((b: Banner) => ({
          idBanner: b.idBanner,
          urlBanner: b.urlBanner,
          isNew: false,
          title: b.titulo ?? "",
          description: b.descripcion ?? "",
          initialTitle: b.titulo ?? "",
          initialDescription: b.descripcion ?? "",
        }));

        setBanners(loaded);
      } catch (error) {
        console.error("Error obteniendo los datos:", error);
      }
    }

    fetchData();
  }, [tenantId]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = "temp-" + Math.random().toString(36).substring(2, 9);

    const newPreview: BannerPreview = {
      idBanner: tempId,
      urlBanner: URL.createObjectURL(file),
      file,
      isNew: true,
      title: "",
      description: "",
      initialTitle: "",
      initialDescription: "",
    };

    setBanners((prev) => [...prev, newPreview]);
    setSaveError(null);
    e.target.value = "";
  };

  const handleFieldChange = (idBanner: string, field: "title" | "description", value: string) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.idBanner === idBanner
          ? { ...banner, [field]: value }
          : banner
      )
    );
  };

  const handleRemove = async (idBanner: string) => {
    const bannerToRemove = banners.find((banner) => banner.idBanner === idBanner);

    if (bannerToRemove?.urlBanner.startsWith("blob:")) {
      URL.revokeObjectURL(bannerToRemove.urlBanner);
    }

    setBannerToDelete(null);
    setBanners((prev) => prev.filter((banner) => banner.idBanner !== idBanner));

    if (!idBanner.startsWith("temp-")) {
      await removeBanners(tenantId || "", idBanner);
    }
  };

  const handleGuardar = async (idBanner: string) => {
    try {
      const banner = banners.find((item) => item.idBanner === idBanner);

      if (!banner) return;

      if (!tenantId || !userId) {
        setSaveError("No se pudo guardar porque falta la información del tenant o del usuario.");
        return;
      }

      if (!banner.title?.trim() || !banner.description?.trim()) {
        setSaveError("Debes agregar un título y una descripción para guardar el banner.");
        return;
      }

      setSaveError(null);
      setSavingId(idBanner);

      if (banner.isNew) {
        if (!banner.file) {
          setSaveError("Debes seleccionar una imagen para guardar el banner.");
          return;
        }

        const formdata = new FormData();
        formdata.append("userId", String(userId));
        formdata.append("file", banner.file);
        formdata.append("posicion", "heroBanner");
        formdata.append("titulo", banner.title.trim());
        formdata.append("descripcion", banner.description.trim());

        const response = await insertBanners(tenantId || "", formdata);

        setBanners((prev) =>
          prev.map((item) =>
            item.idBanner === idBanner
              ? {
                idBanner: response.idBanner,
                urlBanner: response.urlBanner,
                title: banner.title?.trim(),
                description: banner.description?.trim(),
                initialTitle: banner.title?.trim(),
                initialDescription: banner.description?.trim(),
                isNew: false,
              }
              : item
          )
        );
        return;
      }

      const formdata = new FormData();
      formdata.append("idBanner", banner.idBanner);
      formdata.append("titulo", banner.title.trim());
      formdata.append("descripcion", banner.description.trim());

      await updateBanners(tenantId || "", formdata);

      setBanners((prev) =>
        prev.map((item) =>
          item.idBanner === idBanner
            ? {
              ...item,
              title: banner.title?.trim(),
              description: banner.description?.trim(),
              initialTitle: banner.title?.trim(),
              initialDescription: banner.description?.trim(),
            }
            : item
        )
      );
    } catch (err) {
      console.error("Error guardando banner:", err);
      setSaveError("No se pudo guardar el banner. Intenta nuevamente.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Banner Principal</h2>

      <label className="text-xs text-slate-500 text-center pb-2">
        Recomendado: 1280px x 720px en PNG/JPG
      </label>

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

      <div className="flex flex-col gap-4 mt-6">
        {banners.map((item) => {
          const hasChanges = item.isNew
            ? Boolean(item.file && item.title?.trim() && item.description?.trim())
            : (item.title ?? "") !== (item.initialTitle ?? "") || (item.description ?? "") !== (item.initialDescription ?? "");
          const canSave = Boolean(item.title?.trim() && item.description?.trim() && (item.isNew ? item.file : true));

          return (
            <div
              key={item.idBanner}
              className="flex rounded overflow-hidden shadow-sm gap-1"
            >
              <div className="flex-1 w-11/12 relative">
                <div className="w-full h-40 relative overflow-hidden rounded">
                  <img
                    src={item.urlBanner}
                    className="w-full h-full object-cover rounded"
                    alt="preview-banner"
                  />

                  <div className="absolute items-center inset-0 flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-3">
                    <input
                      type="text"
                      value={item.title ?? ""}
                      onChange={(e) => handleFieldChange(item.idBanner, "title", e.target.value)}
                      placeholder="Título"
                      className="rounded w-10/12 text-center border focus:border-none border-white/55 bg-transparent px-3 py-2 text-2xl text-white focus:outline focus:outline-1 focus:outline-cyan-500 placeholder:text-slate-400"
                    />

                    <textarea
                      value={item.description ?? ""}
                      onChange={(e) => handleFieldChange(item.idBanner, "description", e.target.value)}
                      placeholder="Descripción"
                      className="rounded w-10/12 text-center border focus:border-none border-white/55 bg-transparent px-3 py-2 text-base text-white focus:outline focus:outline-1 focus:outline-cyan-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="w-1/12 flex items-center justify-center">
                {item.isNew || hasChanges ? (
                  <button
                    onClick={() => handleGuardar(item.idBanner)}
                    disabled={!canSave}
                    className={`w-full h-full rounded text-white text-center ${canSave ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                  >
                    {savingId === item.idBanner ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-4 lg:h-7 w-4 lg:w-7 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z"></path>
                        </svg>
                      </div>
                    ) : (
                      <i className="bi bi-check-lg text-xl lg:text-3xl"></i>
                    )}
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
          );
        })}
      </div>

      {saveError && <p className="mt-4 text-sm text-red-600">{saveError}</p>}

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
