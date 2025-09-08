"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CirclePlus } from "lucide-react";
import { getAllBrands, getAllCategories, getAllColors, getAllSubCategories, saveOrUpdateProduct, } from "@/lib/actions";
import CustomSelect from "@/components/select";
import { useTenant } from "@/app/context/dataContext";
import { ModalAddAttribute } from "@/components/modales/crearAtributo";

interface Categorias {
    idCategoria: string;
    categoria: string;
}

interface SubCategorias {
    idSubCategoria: string;
    subCategoria: string;
}

interface Marcas {
    idMarca: string;
    marca: string;
}

interface Colores {
    idColor: string;
    color: string;
}

export default function AddProduct() {
    const { tenantId, userId } = useTenant();
    const router = useRouter();

    const [files, setFiles] = useState<File[]>([]);
    const [preview, setPreview] = useState<string[]>([]);

    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [subCategorias, setSubCategorias] = useState<SubCategorias[]>([]);
    const [marcas, setMarcas] = useState<Marcas[]>([]);
    const [colores, setColores] = useState<Colores[]>([]);
    const [destacado, setDestacado] = useState(false);
    const [nuevo, setNuevo] = useState(false);
    const [masVendido, setMasVendido] = useState(false);
    const [activo, setActivo] = useState(true);

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [subCategoriaSeleccionada, setSubCategoriaSeleccionada] = useState("");
    const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
    const [colorSeleccionado, setColorSeleccionado] = useState("");

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState<number>(0);
    const [descripcion, setDescripcion] = useState("");
    const [cantidad, setCantidad] = useState<number>(0);

    const [addAtribute, setAddAttribute] = useState<{ accion: string, attribute: string } | null>(null)

    const [alertNombre, setAlertNombre] = useState("");
    const [alertImagen, setAlertImagen] = useState("");
    const [alertCategoria, setAlertCategoria] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setValuesToDropdowns();
    }, []);

    const setValuesToDropdowns = async () => {
        try {
            const categories = await getAllCategories(tenantId || "");
            setCategorias([{ idCategoria: "0", categoria: "- Seleccione -" }, ...categories]);

            const subCategories = await getAllSubCategories(tenantId || "");
            setSubCategorias([{ idSubCategoria: "0", subCategoria: "- Seleccione -" }, ...subCategories]);

            const brands = await getAllBrands(tenantId || "");
            setMarcas([{ idMarca: "0", marca: "- Seleccione -" }, ...brands]);

            const colors = await getAllColors(tenantId || "");
            setColores([{ idColor: "0", color: "- Seleccione -" }, ...colors]);
        } catch (error) {
            console.error("Error obteniendo categorias, subcategorias, marcas, colores", error);
        }
    }

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);

        // Limitar a 3 imágenes
        const newFiles = [...files, ...selected].slice(0, 3);
        setFiles(newFiles);

        // Previsualización
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreview(newPreviews);
        setAlertImagen("");
    };

    const handleRemove = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreview(newPreviews);
    };

    const handleSaveProduct = async () => {
        if (files.length === 0) {
            setAlertImagen("Ingrese al menos una imagen para el producto");
            return;
        }

        if (nombre == "") {
            setAlertNombre("Ingrese un nombre al producto");
            return;
        }

        if (categoriaSeleccionada == "" || categoriaSeleccionada == "0" || categoriaSeleccionada == null) {
            setAlertCategoria("Seleccione una categoria para el producto");
            return;
        }

        setIsLoading(true)

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file)); // 👈 "files" coincide con el backend
        formData.append("idCategoria", categoriaSeleccionada);
        formData.append("idSubCategoria", subCategoriaSeleccionada);
        formData.append("idMarca", marcaSeleccionada);
        formData.append("idColor", colorSeleccionado);
        formData.append("nombre", nombre);
        formData.append("precio", String(precio));
        formData.append("descripcion", descripcion);
        formData.append("cantidad", String(cantidad));
        formData.append("destacado", String(destacado));
        formData.append("nuevo", String(nuevo));
        formData.append("masVendido", String(masVendido));
        formData.append("activo", String(activo));
        formData.append("userId", String(userId));

        const res = await saveOrUpdateProduct(tenantId || "", formData);

        if (res.result.affectedRows) {
            setIsLoading(false)
            router.push(`/products`);
        }
    };

    const handleSaved = (result: any) => {
        if (result.result.affectedRows) {
            setValuesToDropdowns();
            setAddAttribute(null);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between flex-row">
                <h2 className="text-xl font-semibold mb-4">Agregar Productos</h2>

                <button
                    onClick={handleSaveProduct}
                    // disabled={files.length === 0}
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
                        "Guardar Producto"
                    )}
                </button>
            </div>


            <div className="relative lg:flex w-full gap-6">
                <div className="w-full lg:w-3/4 ">
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
                                {files.length < 3 && (
                                    <label
                                        htmlFor="fileInput"
                                        className="w-28 h-28 border-2 flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:border-2"
                                    >
                                        <CirclePlus className="text-gray-400 w-10 h-10"></CirclePlus>
                                    </label>
                                )}

                                {/* Imágenes seleccionadas */}
                                {preview.map((src, i) => (
                                    <div key={i} className="relative w-28 h-28 border">
                                        <img
                                            src={src}
                                            alt={`preview-${i}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => handleRemove(i)}
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
                                value={nombre}
                                onChange={(e) => {
                                    setAlertNombre("")
                                    setNombre(e.target.value)
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
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
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
                                value={cantidad}
                                onChange={(e) => setCantidad(Number(e.target.value))}
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
                                value={precio}
                                onChange={(e) => setPrecio(Number(e.target.value))}
                                className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        <div className="grid gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Categoria
                                </label>
                                <CustomSelect options={categorias} valueKey="idCategoria" labelKey="categoria" defaultValue="0"
                                    onChange={(value: string) => {
                                        setCategoriaSeleccionada(value)
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
                                <CustomSelect options={subCategorias} valueKey="idSubCategoria" labelKey="subCategoria" defaultValue="0" onChange={setSubCategoriaSeleccionada} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Marca
                                </label>
                                <CustomSelect options={marcas} valueKey="idMarca" labelKey="marca" defaultValue="0" onChange={setMarcaSeleccionada} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Color
                                </label>
                                <CustomSelect options={colores} valueKey="idColor" labelKey="color" defaultValue="0" onChange={setColorSeleccionado} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-sm">
                                        Destacado
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setDestacado(!destacado)}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${destacado ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${destacado ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-xs lg:text-sm">
                                        Nuevo
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setNuevo(!nuevo)}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${nuevo ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${nuevo ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-xs lg:text-sm">
                                        Más Vendido
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setMasVendido(!masVendido)}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${masVendido ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${masVendido ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-xs lg:text-sm">
                                        Activo
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setActivo(!activo)}
                                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 
                                            ${activo ? "bg-cyan-500" : "bg-gray-300"}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                                            ${activo ? "translate-x-6" : "translate-x-1"}`}
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
                    disabled={files.length === 0}
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
                        "Guardar Producto"
                    )}
                </button>
            </div>

            {addAtribute && (
                <ModalAddAttribute
                    accion={addAtribute.accion}
                    attribute={addAtribute.attribute}
                    onClose={() => setAddAttribute(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}