"use client"

/* eslint-disable */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
    Producto,
    Fotos,
    Categoria,
    SubCategoria,
    Marca,
    Color
} from "@/types/producto";
import { CirclePlus } from "lucide-react";
import { useTenant } from "@/app/context/dataContext";
import CustomSelect from "../select";
import {
    getAllBrands,
    getAllCategories,
    getAllColors,
    getAllSubCategories,
    saveProduct,
    updateProduct
} from "@/lib/actions";
import { ModalAddAttribute } from "../modales/crearAtributo";
import { createRutaCloudinary } from "@/lib/util";


type ProductProps = {
    data: Producto | null;
}

const defaultProduct: Producto = {
    idProducto: "",
    idCategoria: "0",
    categoria: "",
    idSubCategoria: "0",
    subCategoria: "",
    idMarca: "0",
    marca: "",
    nombre: "",
    precio: 0,
    idColor: "0",
    color: "",
    descripcion: "",
    destacado: false,
    nuevo: false,
    masVendido: false,
    activo: true,
    cantidad: 0,
    fotos: []
}

interface FotoPreview extends Fotos {
    file?: File; // opcional, solo para las nuevas imágenes que aún no están en la DB
}

export default function Product({ data }: ProductProps) {
    const { tenantId, userId } = useTenant();
    const router = useRouter();

    const [formData, setFormData] = useState<Producto>(data ?? defaultProduct);

    const [isLoading, setIsLoading] = useState(false);

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [colores, setColores] = useState<Color[]>([]);

    const [addAtribute, setAddAttribute] = useState<{ accion: string, attribute: string } | null>(null)

    const [fotoDeleted, setFotoDeleted] = useState<{ idFoto: string, isPrincipal: boolean }[]>([])
    const [preview, setPreview] = useState<FotoPreview[]>([]);

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(data?.idCategoria ?? "0");
    const [nombreCategoriaSeleccionada, setNombreCategoriaSeleccionada] = useState(formData.categoria || "");
    const [subCategoriaSeleccionada, setSubCategoriaSeleccionada] = useState(data?.idSubCategoria ?? "0");
    const [nombreSubCategoriaSeleccionada, setNombreSubCategoriaSeleccionada] = useState(formData.subCategoria || "");
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(data?.idMarca ?? "0");
    const [nombreMarcaSeleccionada, setNombreMarcaSeleccionada] = useState(formData.marca || "");
    const [colorSeleccionado, setColorSeleccionado] = useState(data?.idColor ?? "0");
    const [nombreColorSeleccionada, setNombreColorSeleccionada] = useState(formData.color || "");

    const [alertNombre, setAlertNombre] = useState("");
    const [alertImagen, setAlertImagen] = useState("");
    const [alertCategoria, setAlertCategoria] = useState("");

    // sincronizar si cambia la prop data
    useEffect(() => {
        if (data) {
            setFormData(data);
            setCategoriaSeleccionada(data.idCategoria);
            setSubCategoriaSeleccionada(data.idSubCategoria);
            setMarcaSeleccionada(data.idMarca);
            setColorSeleccionado(data.idColor);
        } else {
            setFormData(defaultProduct);
        }
    }, [data]);

    useEffect(() => {
        setValuesToDropdowns();
    }, []);

    // sincronizar los preview si hubiera imagen
    useEffect(() => {
        if (data?.fotos) {
            setPreview(data.fotos as FotoPreview[]);
        }
    }, [data]);

    // sincronizar los dropdowns
    const setValuesToDropdowns = async () => {
        try {
            const [categories, subCategories, brands, colors] = await Promise.all([
                getAllCategories(tenantId || ""),
                getAllSubCategories(tenantId || ""),
                getAllBrands(tenantId || ""),
                getAllColors(tenantId || "")
            ]);

            setCategorias([{ idCategoria: "0", categoria: "- Seleccione -" }, ...categories.filter((cat:Categoria) => cat.activo === true)]);
            setSubCategorias([{ idSubCategoria: "0", subCategoria: "- Seleccione -" }, ...subCategories]);
            setMarcas([{ idMarca: "0", marca: "- Seleccione -" }, ...brands]);
            setColores([{ idColor: "0", color: "- Seleccione -" }, ...colors]);
        } catch (error) {
            console.error("Error obteniendo categorias, subcategorias, marcas, colores", error);
        }
    };

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;

        const selected: FotoPreview[] = Array.from(fileList).map((file) => ({
            idFoto: `temp-${Date.now()}-${Math.random()}`,
            url_foto: URL.createObjectURL(file),
            rutaCloudinary: "",
            isPrincipal: false,
            file,
        }));

        setPreview((prev) => [...prev, ...selected]);
        setAlertImagen("");
        e.target.value = "";
    };

    const handleRemove = (idFoto: string) => {
        // Filtra del preview las que no coincidan
        setPreview((prev) => prev.filter((foto) => foto.idFoto !== idFoto));

        const foto = data?.fotos?.find(f => f.idFoto === idFoto);
        if (foto) {
            setFotoDeleted(prev => [...prev, { idFoto: foto.idFoto, isPrincipal: foto.isPrincipal }]);
        }
    };

    const handleSaveProduct = async () => {
        if (preview.length === 0) {
            setAlertImagen("Ingrese al menos una imagen para el producto");
            return;
        }

        if (!formData.nombre.trim()) {
            setAlertNombre("Ingrese un nombre al producto");
            return;
        }

        if (categoriaSeleccionada == "" || categoriaSeleccionada == "0") {
            setAlertCategoria("Seleccione una categoria para el producto");
            return;
        }

        setIsLoading(true)

        const fd = new FormData();
        preview.forEach((foto) => { if (foto.file) { fd.append("files", foto.file) } });
        fd.append("idProducto", formData.idProducto); // 👈 si viene vacío -> INSERT, si viene con id -> UPDATE
        fd.append("idCategoria", categoriaSeleccionada);
        fd.append("idSubCategoria", subCategoriaSeleccionada);
        fd.append("idMarca", marcaSeleccionada);
        fd.append("idColor", colorSeleccionado);
        fd.append("nombre", formData.nombre);
        fd.append("precio", String(formData.precio));
        fd.append("descripcion", formData.descripcion);
        fd.append("cantidad", String(formData.cantidad));
        fd.append("destacado", String(formData.destacado));
        fd.append("nuevo", String(formData.nuevo));
        fd.append("masVendido", String(formData.masVendido));
        fd.append("activo", String(formData.activo));
        fd.append("userId", String(userId));
        fd.append("fotoDeleted", JSON.stringify(fotoDeleted));
        fd.append("rutaCloudinary", String(
            createRutaCloudinary(tenantId || "",
                formData.categoria,
                formData.subCategoria,
                formData.marca,
                formData.color)
        ))
        fd.append("nuevaRutaCloudinary", String(
            createRutaCloudinary(tenantId || "",
                nombreCategoriaSeleccionada,
                nombreSubCategoriaSeleccionada,
                nombreMarcaSeleccionada,
                nombreColorSeleccionada)
        ))

        const res = formData.idProducto
            ? await updateProduct(tenantId || "", fd)
            : await saveProduct(tenantId || "", fd);

        if (res.result.affectedRows) {
            setIsLoading(false)
            router.push(`/products`);
        }
    };

    const handleSavedAttribute = (result: any) => {
        if (result.result.affectedRows) {
            setValuesToDropdowns();
            setAddAttribute(null);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between flex-row">
                <h2 className="text-xl font-semibold mb-4">
                    {data ? "Editar Producto" : "Agregar Producto"}
                </h2>

                <button
                    onClick={handleSaveProduct}
                    disabled={isLoading}
                    className="hidden lg:block px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z"></path>
                            </svg>
                            Cargando...
                        </div>
                    ) : (
                        data ? "Actualizar Producto" : "Guardar Producto"
                    )}
                </button>
            </div>


            <div className="relative lg:flex w-full gap-6">
                <div className="w-full lg:w-3/4 ">
                    {/* Imagenes y preview de imagenes */}
                    <div className="flex flex-col gap-2">
                        {/* Imagenes del producto */}
                        <label className="font-semibold">
                            Imagenes
                        </label>
                        <div className="gap-4 ">
                            {/* Input oculto */}
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                multiple
                                onChange={handleSelect}
                                className="hidden"
                            />

                            {/* Cuadrícula de previews */}
                            <div className="flex lg:flex-row flex-col gap-4 border p-3">
                                {/* Botón cuadrado para seleccionar */}
                                {(preview.length) < 3 && (
                                    <label
                                        htmlFor="fileInput"
                                        className="w-28 h-28 border-2 flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:border-2"
                                    >
                                        <CirclePlus className="text-gray-400 w-10 h-10"></CirclePlus>
                                    </label>
                                )}

                                {/* Imágenes seleccionadas */}
                                {preview.map((foto, i) => (
                                    <div key={i} className="relative w-28 h-28 border">
                                        <img
                                            src={foto.url_foto}
                                            alt={`preview-${i}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => handleRemove(foto.idFoto)}
                                            className="absolute w-5 h-5 top-1 right-1 flex items-center justify-center bg-red-600 text-white rounded-full p-1"
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {alertImagen && (
                            <a className="text-red-500 text-xs">{alertImagen}</a>
                        )}
                    </div>

                    {/* Nombre y descripción */}
                    <div className="grid gap-4 pt-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                                Nombre
                            </label>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={formData.nombre || ""}
                                onChange={(e) => {
                                    setAlertNombre("")
                                    setFormData(prev => ({ ...prev, nombre: e.target.value }))
                                    // setNombre(e.target.value)
                                }}
                                className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                            />
                            {alertNombre && (
                                <a className="text-red-500 text-xs">{alertNombre}</a>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                                Descripción
                            </label>
                            <input
                                type="text"
                                placeholder="Descripcion"
                                value={formData.descripcion || ""}
                                onChange={(e) => { setFormData(prev => ({ ...prev, descripcion: e.target.value })) }}
                                className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <label className="font-semibold">
                                Acciones
                            </label>

                            <button
                                className="border w-48 p-2 text-left border-cyan-500 text-cyan-500 space-x-2 hover:bg-cyan-500 hover:text-white"
                                onClick={() => setAddAttribute({ accion: "Agregar ", attribute: "Categoria" })}>
                                <i className="bi bi-plus-circle-fill"></i>
                                <a>Añadir categoria</a>
                            </button>

                            <button
                                className="border w-48 p-2 text-left border-cyan-500 text-cyan-500 space-x-2 hover:bg-cyan-500 hover:text-white"
                                onClick={() => setAddAttribute({ accion: "Agregar ", attribute: "Sub Categoria" })}
                            >
                                <i className="bi bi-plus-circle-fill"></i>
                                <a>Añadir sub categoria</a>
                            </button>

                            <button
                                className="border w-48 p-2 text-left border-cyan-500 text-cyan-500 space-x-2 hover:bg-cyan-500 hover:text-white"
                                onClick={() => setAddAttribute({ accion: "Agregar ", attribute: "Marca" })}>
                                <i className="bi bi-plus-circle-fill"></i>
                                <a>Añadir marca</a>
                            </button>

                            <button
                                className="border w-48 p-2 text-left border-cyan-500 text-cyan-500 space-x-2 hover:bg-cyan-500 hover:text-white"
                                onClick={() => setAddAttribute({ accion: "Agregar ", attribute: "Color" })}>
                                <i className="bi bi-plus-circle-fill"></i>
                                <a>Añadir color</a>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/4">
                    <div className="grid gap-4">
                        {/* Cantidad */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                placeholder="Cantidad"
                                value={formData.cantidad}
                                onChange={(e) => { setFormData(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 0 })) }}
                                className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Precio */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                                Precio
                            </label>
                            <input
                                type="number"
                                step="0.01"        // 👈 permite decimales
                                placeholder="Precio"
                                value={formData.precio}
                                onChange={(e) => { setFormData(prev => ({ ...prev, precio: Number(e.target.value) || 0 })) }}
                                className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        <div className="grid gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Categoria
                                </label>
                                <CustomSelect options={categorias} valueKey="idCategoria" labelKey="categoria" defaultValue={formData.idCategoria}
                                    onChange={(value: string, label: string) => {
                                        setCategoriaSeleccionada(value)
                                        setNombreCategoriaSeleccionada(value != "0" ? label : "")
                                        setAlertCategoria("")
                                    }} />
                                {(categoriaSeleccionada == "null" || alertCategoria) && (
                                    <a className="text-red-500 text-xs">{alertCategoria}</a>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Sub Categoria
                                </label>
                                <CustomSelect options={subCategorias} valueKey="idSubCategoria" labelKey="subCategoria" defaultValue={formData.idSubCategoria}
                                    onChange={(value: string, label: string) => {
                                        setSubCategoriaSeleccionada(value)
                                        setNombreSubCategoriaSeleccionada(value != "0" ? label : "")
                                    }} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Marca
                                </label>
                                <CustomSelect options={marcas} valueKey="idMarca" labelKey="marca" defaultValue={formData.idMarca}
                                    onChange={(value: string, label: string) => {
                                        setMarcaSeleccionada(value)
                                        setNombreMarcaSeleccionada(value != "0" ? label : "")
                                    }} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Color
                                </label>
                                <CustomSelect options={colores} valueKey="idColor" labelKey="color" defaultValue={formData.idColor}
                                    onChange={(value: string, label: string) => {
                                        setColorSeleccionado(value)
                                        setNombreColorSeleccionada(value != "0" ? label : "")
                                    }} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-sm">
                                        Destacado
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, destacado: !prev.destacado }))}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${formData.destacado ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${formData.destacado ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-xs lg:text-sm">
                                        Nuevo
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, nuevo: !prev.nuevo }))}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${formData.nuevo ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${formData.nuevo ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-xs lg:text-sm">
                                        Más Vendido
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, masVendido: !prev.masVendido }))}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${formData.masVendido ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${formData.masVendido ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-xs lg:text-sm">
                                        Activo
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${formData.activo ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${formData.activo ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleSaveProduct}
                    disabled={isLoading}
                    className="lg:hidden px-4 mt-6 mx-auto py-2 bg-cyan-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z"></path>
                            </svg>
                            Cargando...
                        </div>
                    ) : (
                        data ? "Actualizar Producto" : "Guardar Producto"
                    )}
                </button>
            </div>

            {addAtribute && (
                <ModalAddAttribute
                    accion={addAtribute.accion}
                    attribute={addAtribute.attribute}
                    onClose={() => setAddAttribute(null)}
                    onSaved={handleSavedAttribute}
                />
            )}
        </div>
    );
}