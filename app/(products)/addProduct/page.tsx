"use client";

import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
import { CirclePlus } from "lucide-react";
import { getAllBrands, getAllCategories, getAllColors, getAllSubCategories, saveProduct, } from "@/lib/actions";
import CustomSelect from "@/components/select";
import { useTenant } from "@/app/context/TenantContext";

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
    const { tenantId } = useTenant();

    const [files, setFiles] = useState<File[]>([]);
    const [preview, setPreview] = useState<string[]>([]);

    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [subCategorias, setSubCategorias] = useState<SubCategorias[]>([]);
    const [marcas, setMarcas] = useState<Marcas[]>([]);
    const [colores, setColores] = useState<Colores[]>([]);

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [subCategoriaSeleccionada, setSubCategoriaSeleccionada] = useState("");
    const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
    const [colorSeleccionado, setColorSeleccionado] = useState("");

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState<number>(0);
    const [descripcion, setDescripcion] = useState("");
    const [cantidad, setCantidad] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const categories = await getAllCategories(tenantId || "");
                setCategorias([{ idCategoria: "null", categoria: "- Seleccione -" }, ...categories]);

                const subCategories = await getAllSubCategories(tenantId || "");
                setSubCategorias([{ idSubCategoria: "null", subCategoria: "- Seleccione -" }, ...subCategories]);

                const brands = await getAllBrands(tenantId || "");
                setMarcas([{ idMarca: "null", marca: "- Seleccione -" }, ...brands]);

                const colors = await getAllColors(tenantId || "");
                setColores([{ idColor: "null", color: "- Seleccione -" }, ...colors]);
            } catch (error) {
                console.error("Error obteniendo categorias, subcategorias, marcas, colores", error);
            }
        }

        fetchData();
    }, []);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);

        // Limitar a 3 imágenes
        const newFiles = [...files, ...selected].slice(0, 3);
        setFiles(newFiles);

        // Previsualización
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreview(newPreviews);
    };

    const handleRemove = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreview(newPreviews);
    };

    const handleSaveProduct = async () => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file)); // 👈 "files" coincide con el backend
        formData.append("categoria", categoriaSeleccionada);
        formData.append("subCategoria", subCategoriaSeleccionada);
        formData.append("marca", marcaSeleccionada);
        formData.append("color", colorSeleccionado);
        formData.append("nombre", nombre);
        formData.append("precio", String(precio));
        formData.append("descripcion", descripcion);
        formData.append("cantidad", String(cantidad));

        const res = await saveProduct(tenantId || "", formData);
        console.log("Producto guardado:", res);
    };

    // const handleSelectChange = (value: string) => {
    // }

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Agregar Productos</h2>

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

            <div className="grid gap-4 pt-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                        Nombre
                    </label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                    />
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                            Categoria
                        </label>
                        <CustomSelect options={categorias} valueKey="idCategoria" labelKey="categoria" defaultValue="null" onChange={setCategoriaSeleccionada} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                            Sub Categoria
                        </label>
                        <CustomSelect options={subCategorias} valueKey="idSubCategoria" labelKey="subCategoria" defaultValue="null" onChange={setSubCategoriaSeleccionada} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                            Marca
                        </label>
                        <CustomSelect options={marcas} valueKey="idMarca" labelKey="marca" defaultValue="null" onChange={setMarcaSeleccionada} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                            Color
                        </label>
                        <CustomSelect options={colores} valueKey="idColor" labelKey="color" defaultValue="null" onChange={setColorSeleccionado} />
                    </div>
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
                </div>
            </div>



            {/* Botón guardar */}
            <button
                onClick={handleSaveProduct}
                disabled={files.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                Guardar Imágenes
            </button>
        </div>
    );
}