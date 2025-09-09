'use client';

import { useParams } from "next/navigation";
import Product from "@/components/product/Product";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/actions";
import { useTenant } from "@/app/context/dataContext";
import type { Producto } from "@/types/producto";

export default function UpdateProduct() {
    const { tenantId } = useTenant();
    const { idProduct } = useParams();

    const [product, setProduct] = useState<Producto>();

    useEffect(() => {
        async function fetchData() {
            console.log("entro aqui")
            const data = await getProductById(tenantId || "", idProduct as string);
            console.log("data:", data)
            setProduct(data);
        }

        fetchData();
    }, [tenantId, idProduct]);

    return (
        product ? <Product data={product} /> : <p>Cargando...</p>
    );
}