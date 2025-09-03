"use client";
import { useEffect, useState } from "react";
import { getAllProduct } from "@/lib/actions";

interface Productos {
    idProducto: number;
    categoria: string;
    subCategoria: string;
    marca: string;
    nombre: string;
    precio: number;
    color: string;
    decripcion: string;
    imagen: string;
    destacado: boolean;
    nuevo: boolean;
    masVendido: boolean;
    activo: boolean;
    //   fotos: string[];
}


export default function Products() {
    const [products, setProducts] = useState<Productos[]>([]);

    // llenar los productos
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllProduct("importonyperu");
                console.log("data:")
                console.log(data)
                setProducts(data);
            } catch (error) {
                console.error("Error obteniendo los productos en /product/page.tsx - 33:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <div className="space-y-4">

                <button
                    // onClick={""}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Guardar
                </button>
            </div>
        </div>
    );
}
