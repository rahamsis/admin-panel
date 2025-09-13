"use client";

/* eslint-disable */

import { useEffect, useState } from "react";
import { getAllColors } from "@/lib/actions";
import Link from "next/link";
import { useTenant } from "@/app/context/dataContext";
import type { Color } from "@/types/producto";
import { ModalAddAttribute } from "@/components/modales/crearAtributo";

export default function Colors() {
    const { tenantId } = useTenant();

    const [searchTerm, setSearchTerm] = useState('');
    const [colors, setColors] = useState<Color[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const filteredColors = colors.filter((col) =>
        col.color.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const colorsPerPage = 20;

    // Calcular número total de páginas
    const totalPages = Math.ceil(filteredColors.length / colorsPerPage);

    const indexOfLastColor = currentPage * colorsPerPage;
    const indexOfFirstUser = indexOfLastColor - colorsPerPage;
    const currentColors = filteredColors.slice(indexOfFirstUser, indexOfLastColor);

    const [showDeleteText, setShowDeleteText] = useState(false);

    const [addAtribute, setAddAttribute] = useState<{ idColor: string, accion: string, attribute: string, value: string } | null>(null)

    // llenar los productos
    useEffect(() => {

        async function fetchData() {
            // if (!session?.user) return;

            try {
                setIsLoading(true);
                const data = await getAllColors(tenantId || "");
                setColors(data);
            } catch (error) {
                console.error("Error obteniendo las colores:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const updateStatus = async (idProduct: string, status: number) => {

        // // Optimistic update: actualizar UI inmediatamente
        // setProducts(prevProducts =>
        //     prevProducts.map(product =>
        //         product.idProducto === idProduct
        //             ? { ...product, activo: status === 1 }
        //             : product
        //     )
        // );

        // try {
        //     await updateStatusProduct(tenantId || "", idProduct, status);
        // } catch (error) {
        //     console.error("Error al actualizar el estado del producto. ", error);

        //     // 🔄 Revertir usando el valor anterior
        //     setProducts(prevProducts =>
        //         prevProducts.map(product =>
        //             product.idProducto === idProduct
        //                 ? { ...product, activo: product.activo } // vuelve al valor que tenía en prevProducts
        //                 : product
        //         )
        //     );
        // }
    }

    const cleanInputSearch = () => {
        setSearchTerm('');
        setShowDeleteText(false);
    }

    const handleSavedAttribute = async (result: any) => {
        if (result.result.affectedRows) {
            setAddAttribute(null);
        }

        // 👇 recargar todas las categorías
        const updatedColors = await getAllColors(tenantId || "");
        setColors(updatedColors);
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Colores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full x:w-1/2 gap-4">
                {/* Barra de búsqueda */}
                <div className="">
                    <i className="absolute w-5 h-5 mt-[10px] ml-2 bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Buscar Colores ..."
                        className="pl-10 w-10/12 lg:w-full pr-10  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                        value={searchTerm}
                        onChange={(e) => {
                            setShowDeleteText(true)
                            setSearchTerm(e.target.value)
                        }}
                    />
                    {showDeleteText &&
                        <i className=" hover:absolute w-5 h-5 mt-[10px] -ml-7 bi bi-x-lg cursor-pointer" onClick={cleanInputSearch}></i>
                    }

                </div>
                {/* Botón de agregar usuario */}
                <div className=''>
                    <Link href="/addProduct">
                        <button
                            className='bg-green-600 text-white px-4 py-2 rounded'>
                            <i className="bi bi-plus-circle mr-2"></i>
                            Nuevo
                        </button>
                    </Link>

                </div>
            </div>
            <div className="relative w-[calc(100vw-8rem)] md:w-[calc(100vw-15rem)] lg:w-[calc(100vw-18rem)] x:w-[calc(100vw-20rem)] rounded-lg">
                <div className="space-y-4 pt-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full table-auto border-collapse text-sm">
                            <thead className="bg-button text-zinc-800">
                                <tr className="bg-gray-300">
                                    <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">#</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Color</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Estado</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Acciones</th>
                                    {/* <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Eliminar</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-500">
                                            <div className="flex justify-center items-center space-x-2">
                                                <svg
                                                    className="animate-spin h-5 w-5 text-gray-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                    ></path>
                                                </svg>
                                                <span>Cargando marcas...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentColors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-400">
                                            No se encontraron marcas.
                                        </td>
                                    </tr>
                                ) : (
                                    currentColors.map((col, i) => (
                                        <tr key={i} className="odd:bg-white even:bg-gray-100">
                                            <td className="border border-gray-300 px-3 py-2 whitespace-nowrap relative">{indexOfFirstUser + i + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{col.idColor}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{col.color}</td>
                                            <td className="border border-gray-300 py-2 whitespace-nowrap text-center">{
                                                col.activo ?
                                                    <button className="text-3xl" onClick={() => updateStatus(col.idColor, 0)}>
                                                        <i className="bi bi-check-lg text-green-600"></i>
                                                    </button> :
                                                    <button className="text-3xl" onClick={() => updateStatus(col.idColor, 1)}>
                                                        <i className="bi bi-x text-red-600"></i>
                                                    </button>
                                            }</td>
                                            <td className="border border-gray-300 space-x-1 text-center ">
                                                <button
                                                    className="border border-button2 p-2 rounded-md bg-green-500 text-white"
                                                    title="editar"
                                                    onClick={() => setAddAttribute({ idColor: col.idColor, accion: "Actualizar ", attribute: "Categoria", value: col.color })}
                                                ><i className="bi bi-pencil-square"></i>
                                                </button>

                                                <button
                                                    className="border border-button2 p-2 rounded-md bg-red-500 text-white"
                                                    title="Vista previa"
                                                // onClick={() => setAddTalleres({ userId: user.userId, nombre: user.nombre + ' ' + (user.apellidos ? user.apellidos : '') })}
                                                // disabled={!this.state.reset}
                                                ><i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-row mt-6 justify-between mr-10">
                <div className="text-zinc-600 flex lg:text-base text-xs items-center">
                    <span>Mostrando {filteredColors.length === 0 ? 0 : indexOfFirstUser + 1} - {Math.min(indexOfLastColor, filteredColors.length)} de {colors.length} color(es)</span>
                </div>

                <div className="flex justify-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={`p-1 border border-zinc-300 disabled:opacity-50 text-zinc-400 ${currentPage === 1 && "hidden"}`}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border border-zinc-300 hover:bg-black hover:text-white font-semibold ${currentPage === i + 1 ? "bg-black text-white border border-black" : "text-zinc-400"}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={`p-1 border border-zinc-300 disabled:opacity-50 hover:bg-black hover:text-white text-zinc-400 ${currentPage === totalPages && "hidden"}`}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            {addAtribute && (
                <ModalAddAttribute
                    idcategoria={addAtribute.idColor}
                    accion={addAtribute.accion}
                    attribute={addAtribute.attribute}
                    value={addAtribute.value}
                    onClose={() => setAddAttribute(null)}
                    onSaved={handleSavedAttribute}
                />
            )}
        </div>
    );
}