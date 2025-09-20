"use client";

/* eslint-disable */

import { useEffect, useState } from "react";
import { getAllProduct, updateStatusProduct } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/app/context/dataContext";
import type { Producto } from "@/types/producto";

export default function Products() {
    const { tenantId } = useTenant();

    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const filteredProducts = products.filter((prod) =>
        prod.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    // Calcular número total de páginas
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstUser = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstUser, indexOfLastProduct);

    const [showDeleteText, setShowDeleteText] = useState(false);

    // llenar los productos
    useEffect(() => {

        async function fetchData() {
            // if (!session?.user) return;

            try {
                setIsLoading(true);
                const data = await getAllProduct(tenantId || "");
                console.log(data)
                setProducts(data);
            } catch (error) {
                console.error("Error obteniendo los productos", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const updateStatus = async (idProduct: string, status: number) => {

        // Optimistic update: actualizar UI inmediatamente
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.idProducto === idProduct
                    ? { ...product, activo: status === 1 }
                    : product
            )
        );

        try {
            await updateStatusProduct(tenantId || "", idProduct, status);
        } catch (error) {
            console.error("Error al actualizar el estado del producto. ", error);

            // 🔄 Revertir usando el valor anterior
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.idProducto === idProduct
                        ? { ...product, activo: product.activo } // vuelve al valor que tenía en prevProducts
                        : product
                )
            );
        }
    }

    const cleanInputSearch = () => {
        setSearchTerm('');
        setShowDeleteText(false);
    }

    return (
        <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
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
                            className="bi bi-x-lg absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={cleanInputSearch}
                        ></i>
                    )}
                </div>

                {/* Botón de agregar usuario */}
                <div className=''>
                    <Link href="/addProduct">
                        <button
                            className='hidden lg:flex bg-cyan-600 text-white px-4 py-2 rounded'>
                            <i className="bi bi-plus-circle mr-2"></i>
                            Nuevo
                        </button>
                    </Link>

                    <Link href="/addProduct">
                        <div className="lg:hidden text-cyan-500 text-3xl" title="Agregar categoria" >
                            <i className="bi bi-plus-circle-fill"></i>
                        </div>
                    </Link>
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
                                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Imagen</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Nombre</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Categoria</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Precio</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Cantidad</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Estado</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Acciones</th>
                                    {/* <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">Eliminar</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4 text-gray-500">
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
                                                <span>Cargando productos...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4 text-gray-400">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                ) : (
                                    currentProducts.map((prod, i) => (
                                        <tr key={i} className="odd:bg-white even:bg-gray-100">
                                            <td className="border border-gray-300 px-3 py-2 whitespace-nowrap relative">{indexOfFirstUser + i + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{prod.idProducto}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                                                <Image
                                                    src={prod.fotos[0].url_foto}
                                                    alt={prod.nombre}
                                                    width={50}
                                                    height={50}
                                                    priority={true}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{prod.nombre}</td>
                                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{prod.categoria}</td>
                                            <td className="border border-gray-300 py-2 whitespace-nowrap text-center">{prod.precio}</td>
                                            <td className="border border-gray-300 py-2 whitespace-nowrap text-center">{prod.cantidad}</td>
                                            <td className="border border-gray-300 py-2 whitespace-nowrap text-center">{
                                                prod.activo ?
                                                    <button className="text-3xl" onClick={() => updateStatus(prod.idProducto, 0)}>
                                                        <i className="bi bi-check-lg text-green-600"></i>
                                                    </button> :
                                                    <button className="text-3xl" onClick={() => updateStatus(prod.idProducto, 1)}>
                                                        <i className="bi bi-x text-red-600"></i>
                                                    </button>
                                            }</td>
                                            <td className="border border-gray-300 space-x-1 text-center ">
                                                <Link href={`/updateProduct/${prod.idProducto}`}>
                                                    <button
                                                        className="border border-button2 p-2 rounded-md bg-green-500 text-white"
                                                        title="editar"
                                                    ><i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </Link>

                                                <button
                                                    className="border border-button2 p-2 rounded-md bg-blue-500 text-white"
                                                    title="Vista previa"
                                                // onClick={() => setAddTalleres({ userId: user.userId, nombre: user.nombre + ' ' + (user.apellidos ? user.apellidos : '') })}
                                                // disabled={!this.state.reset}
                                                ><i className="bi bi-eye-fill"></i>
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
            {/* <div className="flex justify-end mt-4 gap-2 mr-20">
                <button
                    className="px-3 py-1 border border-button text-button rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>

                <span className="px-3 py-1">
                    Página {currentPage} de {Math.ceil(filteredProducts.length / productsPerPage)}
                </span>

                <button
                    className="px-3 py-1 border border-button text-button rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastProduct >= filteredProducts.length}
                >
                    Siguiente
                </button>
            </div> */}

            {/* en mobiles ocultar */}
            <div className="lg:flex flex-row mt-6 justify-between mr-10 hidden">
                <div className="text-zinc-600 flex lg:text-base text-xs items-center">
                    <span>Mostrando {filteredProducts.length === 0 ? 0 : indexOfFirstUser + 1} - {Math.min(indexOfLastProduct, filteredProducts.length)} de {products.length} producto(s)</span>
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
                    currentProducts.map((prod, i) => (
                        <div key={i} className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
                            <div className="flex items-center justify-between gap-2 w-full">
                                {/* --- IZQUIERDA: imagen + datos --- */}
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={prod.fotos[0].url_foto}
                                        alt={prod.nombre}
                                        width={50}
                                        height={50}
                                        priority={true}
                                    />
                                    <div>
                                        <h3 className="text-sm">{prod.nombre}</h3>
                                        <p className="text-xs text-gray-500">ID: {prod.idProducto}</p>
                                    </div>
                                </div>

                                {/* --- DERECHA: botones de acciones --- */}
                                <div className="flex items-center space-x-2">
                                    {prod.activo ? (
                                        <button
                                            className="text-xl"
                                            onClick={() => updateStatus(prod.idProducto, 0)}
                                        >
                                            <i className="bi bi-check-lg text-green-600"></i>
                                        </button>
                                    ) : (
                                        <button
                                            className="text-xl"
                                            onClick={() => updateStatus(prod.idProducto, 1)}
                                        >
                                            <i className="bi bi-x text-red-600"></i>
                                        </button>
                                    )}

                                    <Link href={`/updateProduct/${prod.idProducto}`}>
                                        <button
                                            className="m-2 rounded-md text-white"
                                            title="Editar"
                                        >
                                            <i className="bi bi-pencil-square text-cyan-500"></i>
                                        </button>
                                    </Link>

                                    <button
                                        className="m-1 rounded-md text-white"
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash3-fill text-red-500"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    );
}
