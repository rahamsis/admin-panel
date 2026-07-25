"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteVideo, getVideo, saveVideo } from "@/lib/actions";
import { useTenant } from "../context/dataContext";
import { ModalQuestion } from "@/components/modales/question";
import { VideoPrincipal } from "@/types/videoPrincipal";


export default function Video() {
    const { tenantId, userId } = useTenant();

    const [video, setVideo] = useState<VideoPrincipal | null>(null);
    const [originalVideo, setOriginalVideo] = useState<VideoPrincipal | null>(null);

    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!tenantId) return;

        async function fetchData() {
            try {
                const data = await getVideo(tenantId || "");

                const loaded: VideoPrincipal = {
                    idVideo: data?.idVideo ?? "",
                    titulo: data?.titulo ?? "",
                    descripcion: data?.descripcion ?? "",
                    urlVideo: data?.urlVideo ?? "",
                    userId: data?.userId ?? ""
                };

                setVideo(loaded);
                setOriginalVideo(loaded);
            } catch (error) {
                console.error("Error obteniendo el video:", error);

                const empty: VideoPrincipal = {
                    idVideo: "",
                    titulo: "",
                    descripcion: "",
                    urlVideo: "",
                    userId: ""
                };

                setVideo(empty);
                setOriginalVideo(empty);

                setSaveError("No se pudo obtener la información del video.");
            }
        }

        fetchData();
    }, [tenantId]);

    const handleChange =
        (field: keyof VideoPrincipal) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (!video) return;

                setVideo({
                    ...video,
                    [field]: e.target.value,
                });

                setSaveError(null);
            };

    const videoId = useMemo(() => {
        if (!video?.urlVideo) return "";

        const regex =
            /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;

        const match = video.urlVideo.match(regex);

        return match ? match[1] : "";
    }, [video?.urlVideo]);

    const hasChanges =
        !!video &&
        !!originalVideo &&
        (
            video.titulo !== originalVideo.titulo ||
            video.descripcion !== originalVideo.descripcion ||
            video.urlVideo !== originalVideo.urlVideo
        );

    const handleRemove = async (idVideo: string) => {

        await deleteVideo(tenantId || "", idVideo);
        setVideoToDelete(null);
    };

    const handleGuardar = async () => {
        if (!video) return;

        try {
            if (!tenantId || !userId) {
                setSaveError(
                    "No se pudo guardar porque falta la información del tenant o del usuario."
                );
                return;
            }

            if (!video.titulo.trim()) {
                setSaveError("Debe ingresar un título.");
                return;
            }

            if (!video.descripcion.trim()) {
                setSaveError("Debe ingresar una descripción.");
                return;
            }

            if (!video.urlVideo.trim()) {
                setSaveError("Debe ingresar la URL del video.");
                return;
            }

            if (!videoId) {
                setSaveError(
                    "La URL ingresada no corresponde a un video de YouTube válido."
                );
                return;
            }

            setLoading(true);
            setSaveError(null);

            const body = {
                idVideo: video.idVideo,
                userId: String(userId),
                titulo: video.titulo.trim(),
                descripcion: video.descripcion.trim(),
                urlVideo: video.urlVideo.trim(),
            }
            
            const result = await saveVideo(tenantId, body);

            if (result.idVideo === undefined) {
                setSaveError(result.message || "Ocurrió un error al guardar.");
                return;
            }

            setOriginalVideo({ ...video });
            setSaveError(null);
        } catch (error) {
            console.error(error);
            setSaveError("Ocurrió un error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    if (!video) {
        return (
            <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
            <h2 className="text-2xl font-semibold mb-6">
                Video Principal
            </h2>

            <div className="max-w-4xl mx-auto space-y-6">

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Título
                    </label>

                    <input
                        type="text"
                        value={video.titulo}
                        onChange={handleChange("titulo")}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Descripción
                    </label>

                    <textarea
                        rows={5}
                        value={video.descripcion}
                        onChange={handleChange("descripcion")}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        URL del video de YouTube
                    </label>

                    <input
                        type="url"
                        value={video.urlVideo}
                        onChange={handleChange("urlVideo")}
                        placeholder="https://www.youtube.com/watch?v=..."
                        onFocus={(e) => e.target.select()}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                    />
                </div>

                {videoId && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Vista previa
                        </h3>

                        <div className="aspect-video rounded-lg overflow-hidden border shadow">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="Vista previa"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {saveError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {saveError}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setVideoToDelete(video.idVideo)}
                        disabled={!video.idVideo || loading}
                        className={` text-white font-semibold py-3 px-8 rounded-lg transition
                        ${!video.idVideo || loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                    >
                        Borrar video
                    </button>
                    <button
                        onClick={handleGuardar}
                        disabled={!hasChanges || loading}
                        className={`w-full sm:w-auto px-8 py-3 rounded-lg text-white font-semibold transition ${!hasChanges || loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-cyan-600 hover:bg-cyan-700"
                            }`}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>

            {videoToDelete && (
                <ModalQuestion
                    message={"¿Estás seguro de que deseas eliminar este video?"}
                    onConfirm={() => handleRemove(videoToDelete)}
                    onClose={() => setVideoToDelete(null)}
                />
            )}
        </div>
    );
}