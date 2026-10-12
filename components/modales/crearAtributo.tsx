'use client'

/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useTenant } from "@/app/context/dataContext";
import {
    saveOrUpdateCategories,
    saveOrUpdateColor,
    saveOrUpdateMarca,
    saveOrUpdateSubCategories
} from "@/lib/actions";
import CustomSelect from "../select";
import { Categoria } from "@/types/producto";
import { CirclePlus } from "lucide-react";

interface ModalAddAttribute {
    idAttribute?: string;
    accion: string;
    attribute: string;
    value?: string;
    categories?: Categoria[];
    imagen?: string;
    onClose: () => void;
    onSaved: (result: any) => void;
}

interface FotoPreview {
    urlFoto: string;
    file?: File; // opcional, solo para las nuevas imágenes que aún no están en la DB
}

export const ModalAddAttribute = ({ idAttribute, accion, attribute, value, categories, imagen, onClose, onSaved }: ModalAddAttribute) => {
    const { tenantId, userId } = useTenant();
    const [newAttribute, setNewAttribute] = useState(value || "");
    const [alert, setAlert] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const isSavingRef = useRef(false);

    // aplica solo al modal de subcategoria para que sea asociado a una categoria
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("0");

    const [previewAttribute, setPreviewAttribute] = useState<FotoPreview | null>(null);
    const [alertImagen, setAlertImagen] = useState("");

    // sincronizar los previewAttribute si hubiera imagen
    useEffect(() => {
        if (imagen) {
            setPreviewAttribute({ urlFoto: imagen });
        }
    }, [imagen]);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const selected: FotoPreview = {
            urlFoto: URL.createObjectURL(file),
            file,
        };

        setPreviewAttribute(selected);
        setAlertImagen("");
        e.target.value = "";
    };

    const handleRemove = () => {
        setPreviewAttribute(null);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if ((attribute.toLowerCase() === "marca" || attribute.toLowerCase() === "categoria") && !previewAttribute) {
            setAlertImagen("Ingrese una imagen para continuar")
            return;
        }

        if (newAttribute == "" || newAttribute == null) {
            setAlert("Ingrese un valor para continuar")
            return;
        }

        if (isSavingRef.current) return;
        isSavingRef.current = true;
        setIsSaving(true);

        try {
            //creamos el formData ya que no se puede mandar el file directamente:
            const formdata = new FormData();
            formdata.append("userId", String(userId));
            formdata.append("idAttribute", String(idAttribute));
            formdata.append("newAttribute", String(newAttribute));
            if (previewAttribute?.file) {
                formdata.append("file", previewAttribute.file);
            }

            const result = attribute === "Categoria"
                ? await saveOrUpdateCategories(tenantId || "", formdata)
                : attribute === "Sub Categoria"
                    ? await saveOrUpdateSubCategories(tenantId || "", userId || "", idAttribute || "", newAttribute, categoriaSeleccionada)
                    : attribute === "Marca"
                        ? await saveOrUpdateMarca(tenantId || "", formdata)
                        : attribute === "Color"
                            ? await saveOrUpdateColor(tenantId || "", userId || "", idAttribute || "", newAttribute) : null;

            onSaved(result);
            onClose();
        } finally {
            isSavingRef.current = false;
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 lg:mx-0 ">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-secondary">{accion} {attribute}</h2>
                </div>

                {(attribute.toLowerCase() === "marca" ||attribute.toLowerCase() === "categoria") &&
                    // Imagenes y previewAttribute de imagenes
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
                                {previewAttribute === null && (
                                    <label
                                        htmlFor="fileInputAttribute"
                                        className="w-full h-28 border-2 flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:border-2"
                                    >
                                        <CirclePlus className="text-gray-400 w-10 h-10"></CirclePlus>
                                    </label>
                                )}

                                {/* Imágenes seleccionadas */}
                                {previewAttribute !== null && (
                                    <div className="relative w-full h-28 border">
                                        <img
                                            src={previewAttribute.urlFoto}
                                            alt={`previewAttribute-${attribute}`}
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
                            De preferencia una imagen sin fondo en formato png
                        </label>
                        {alertImagen && (
                            <a className="text-red-500 text-xs">{alertImagen}</a>
                        )}
                    </div>
                }

                <input
                    type="text"
                    placeholder={attribute}
                    value={newAttribute}
                    onChange={(e) => {
                        setAlert("")
                        setNewAttribute(e.target.value)
                    }}
                    className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                />

                {categories && (
                    <div className="pt-6">
                        <label className="">Asociar a una categoria</label>
                        <div className="pt-2">
                            <CustomSelect
                                options={categories}
                                valueKey="idCategoria"
                                labelKey="categoria"
                                defaultValue="0"
                                onChange={(value: string) => {
                                    setCategoriaSeleccionada(value)
                                }}
                            />
                        </div>
                    </div>
                )}
                {alert && (
                    <label className="text-red-500 text-xs">{alert}</label>
                )}

                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        aria-busy={isSaving}
                        className="bg-cyan-500 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSaving ? (
                            <span className="flex items-center">
                                <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z" />
                                </svg>
                                Guardando...
                            </span>
                        ) : "Guardar"}
                    </button>
                    <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 border rounded-lg disabled:cursor-not-allowed disabled:opacity-70">
                        Cancelar
                    </button>
                </div>
            </div>
        </div >
    );
};