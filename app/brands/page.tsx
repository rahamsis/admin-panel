"use client";

/* eslint-disable */

import { useEffect, useState } from "react";
import { getAllBrands, updateStatusBrand, } from "@/lib/actions";
import Link from "next/link";
import { useTenant } from "@/app/context/dataContext";
import type { Marca, } from "@/types/producto";
import { ModalAddAttribute } from "@/components/modales/crearAtributo";

export default function Brands() {
    const { tenantId } = useTenant();

    const [searchTerm, setSearchTerm] = useState('');
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const filteredMarcas = marcas.filter((mar) =>
        mar.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const marcasPerPage = 20;

    // Calcular número total de páginas
    const totalPages = Math.ceil(filteredMarcas.length / marcasPerPage);

    const indexOfLastMarca = currentPage * marcasPerPage;
    const indexOfFirstUser = indexOfLastMarca - marcasPerPage;
    const currentMarcas = filteredMarcas.slice(indexOfFirstUser, indexOfLastMarca);

    const [showDeleteText, setShowDeleteText] = useState(false);

    const [addAtribute, setAddAttribute] = useState<{ idMarca: string, accion: string, attribute: string, value: string } | null>(null)

    // llenar los productos
    useEffect(() => {

        async function fetchData() {
            // if (!session?.user) return;

            try {
                setIsLoading(true);
                const data = await getAllBrands(tenantId || "");
                setMarcas(data);
            } catch (error) {
                console.error("Error obteniendo las marcas:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const updateStatus = async (idMarca: string, status: number) => {
        // 1️⃣ Guardamos el valor previo (para poder revertir en caso de error)
        const prevMarcas = [...marcas];

        // 2️⃣ Optimistic update: actualizamos el UI inmediatamente
        setMarcas(prev =>
            prev.map(marca =>
                marca.idMarca === idMarca
                    ? { ...marca, activo: status === 1 } // vuelve al valor que tenía en prevProducts
                    : marca
            )
        );

        try {
            // 3️⃣ Llamada al backend
            await updateStatusBrand(tenantId || "", idMarca, status);
        } catch (error) {
            console.error("Error al actualizar el estado de la marca. ", error);

            // 4️⃣ Rollback: restauramos el estado anterior
            setMarcas(prevMarcas);
        }
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
        const updatedMarcas = await getAllBrands(tenantId || "");
        setMarcas(updatedMarcas);
    }

    return (
        <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
            <h2 className="text-xl font-semibold mb-4">Marcas</h2>
            <div className="flex flex-row w-full x:w-1/2 gap-4">

                {/* Barra de búsqueda */}
                <div className="relative w-full">
                    {/* Icono de búsqueda */}
                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>

                    {/* Input */}
                    <input
                        type="text"
                        placeholder="Buscar Subcategoria ..."
                        className="w-full pl-10 pr-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-button"
                        value={searchTerm}
                        onChange={(e) => {
                            setShowDeleteText(true);
                            setSearchTerm(e.target.value);
                        }}
                    />

                    {/* Icono de limpiar */}
                    {showDeleteText && (
                        <i
                            className="bi bi-x-lg absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500"
                            onClick={cleanInputSearch}
                        ></i>
                    )}
                </div>

                {/* Botón de agregar usuario */}
                <div className='hidden lg:flex lg:flex-row border'>
                    <button
                        className='bg-cyan-500 text-white px-4 py-2 rounded flex flex-row' onClick={() => setAddAttribute({ idMarca: "", accion: "Crear ", attribute: "Marca", value: "" })}>
                        <i className="bi bi-plus-circle mr-2"></i>
                        Nuevo
                    </button>
                </div>

                <div className="lg:hidden text-cyan-500 text-3xl" title="Agregar marca" onClick={() => setAddAttribute({ idMarca: "", accion: "Crear ", attribute: "Marca", value: "" })}>
                    <i className="bi bi-plus-circle-fill"></i>
                </div>
            </div>

            {/* en mobiles ocultar */}
            <div className="relative w-[calc(100vw-8rem)] md:w-[calc(100vw-15rem)] lg:w-[calc(100vw-18rem)] x:w-[calc(100vw-20rem)] rounded-lg hidden lg:block">
                <div className="space-y-4 pt-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full table-auto border-collapse text-sm">
                            <thead className="bg-button text-zinc-800">
                                <tr className="bg-gray-300">
                                    <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">#</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Marca</th>
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
                                ) : currentMarcas.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-400">
                                            No se encontraron marcas.
                                        </td>
                                    </tr>
                                ) : (
                                    currentMarcas.map((mar, i) => (
                                        <tr key={i} className="odd:bg-white even:bg-gray-100">
                                            <td className="border border-gray-300 px-3 py-2 whitespace-nowrap relative">{indexOfFirstUser + i + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{mar.idMarca}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{mar.marca}</td>
                                            <td className="border border-gray-300 py-2 whitespace-nowrap text-center">{
                                                mar.activo ?
                                                    <button className="text-3xl" onClick={() => updateStatus(mar.idMarca, 0)}>
                                                        <i className="bi bi-check-lg text-green-600"></i>
                                                    </button> :
                                                    <button className="text-3xl" onClick={() => updateStatus(mar.idMarca, 1)}>
                                                        <i className="bi bi-x text-red-600"></i>
                                                    </button>
                                            }</td>
                                            <td className="border border-gray-300 space-x-1 text-center ">
                                                <button
                                                    className="border border-button2 p-2 rounded-md bg-green-500 text-white"
                                                    title="editar"
                                                    onClick={() => setAddAttribute({ idMarca: mar.idMarca, accion: "Actualizar ", attribute: "Categoria", value: mar.marca })}
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

            {/* en mobiles ocultar */}
            <div className="lg:flex flex-row mt-6 justify-between mr-10 hidden">
                <div className="text-zinc-600 flex lg:text-base text-xs items-center">
                    <span>Mostrando {filteredMarcas.length === 0 ? 0 : indexOfFirstUser + 1} - {Math.min(indexOfLastMarca, filteredMarcas.length)} de {marcas.length} marca(s)</span>
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

            <div className="lg:hidden mt-6">
                {
                    currentMarcas.map((marca, i) => (
                        <div key={i} className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h3 className="text-lg">{marca.marca}</h3>
                                    <p className="text-sm text-gray-500">ID: {marca.idMarca}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {marca.activo ?
                                        <button className="text-3xl" onClick={() => updateStatus(marca.idMarca, 0)}>
                                            <i className="bi bi-check-lg text-green-600"></i>
                                        </button> :
                                        <button className="text-3xl" onClick={() => updateStatus(marca.idMarca, 1)}>
                                            <i className="bi bi-x text-red-600"></i>
                                        </button>
                                    }
                                    <button
                                        className="border border-button2 p-2 rounded-md bg-cyan-500 text-white"
                                        title="editar"
                                        onClick={() => setAddAttribute({ idMarca: marca.idMarca, accion: "Actualizar ", attribute: "Marca", value: marca.marca })}
                                    ><i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="border border-button2 p-2 rounded-md bg-red-500 text-white"
                                        title="Vista previa"
                                    // onClick={() => setAddTalleres({ userId: user.userId, nombre: user.nombre + ' ' + (user.apellidos ? user.apellidos : '') })}  
                                    // disabled={!this.state.reset}
                                    ><i className="bi bi-trash3-fill"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {addAtribute && (
                <ModalAddAttribute
                    idcategoria={addAtribute.idMarca}
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