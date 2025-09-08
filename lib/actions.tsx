'use server';

/* eslint-disable */

export async function getAllProduct(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/all-products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data.map((row: any) => ({
            idProducto: row.idProducto,
            idCategoria: row.idCategoria,
            categoria: row.categoria,
            idSubCategoria: row.idSubCategoria,
            subCategoria: row.subCategoria,
            idMarca: row.idMarca,
            marca: row.marca,
            nombre: row.nombre,
            precio: row.precio,
            idcolor: row.idColor,
            color: row.color,
            descripcion: row.descripcion,
            imagen: row.imagen,
            destacado: row.destacado,
            nuevo: row.nuevo,
            masVendido: row.masVendido,
            activo: row.activo,
            // fotos: row.fotosAdicionales?.split(',') ?? []
        }));
    } catch (error) {
        console.error('Error al obtener los productos destacados o nuevos o más vendidos:', error);
        throw new Error("Error al obtener los productos destacados o nuevos o más vendidos");
    }
}

export async function getAllCategories(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/all-categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data.map((row: any) => ({
            idCategoria: row.idCategoria,
            categoria: row.categoria
        }));
    } catch (error) {
        console.error('Error al obtener las categorias:', error);
        throw new Error("Error al obtener las categorias");
    }
}

export async function getAllSubCategories(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/all-subcategories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data.map((row: any) => ({
            idSubCategoria: row.idSubCategoria,
            subCategoria: row.subCategoria
        }));
    } catch (error) {
        console.error('Error al obtener las subCategorias:', error);
        throw new Error("Error al obtener las subCategorias");
    }
}

export async function getAllBrands(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/all-brands`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data.map((row: any) => ({
            idMarca: row.idMarca,
            marca: row.marca
        }));
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
        throw new Error("Error al obtener las marcas");
    }
}

export async function getAllColors(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/all-colors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data.map((row: any) => ({
            idColor: row.idColor,
            color: row.color
        }));
    } catch (error) {
        console.error('Error al obtener los colores:', error);
        throw new Error("Error al obtener los colores");
    }
}

export async function updateStatusProduct(tenant: string, idProduct: number, status: number) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ idProduct, status }),
            next: { revalidate: 0 }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al actualizar el estado del producto", error);
        throw new Error("Error al actualizar el estado del producto")
    }
}

export async function saveOrUpdateProduct(tenant: string, formData: FormData) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/save-or-update-product`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: formData,
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error al  actualizar o guardar el producto", error);
        throw new Error("Error al  actualizar o guardar el producto")
    }
}

export async function saveOrUpdateCategories(tenant: string, userId: string, categoria: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-categorie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ userId, categoria }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al actualizar o guardar la categoria:', error);
        throw new Error("Error al actualizar o guardar la categoria");
    }
}

export async function saveOrUpdateSubCategories(tenant: string, userId: string, subCategoria: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-subcategorie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ userId, subCategoria }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al actualizar o guardar la subcategoria:', error);
        throw new Error("Error al actualizar o guardar la subcategoria");
    }
}

export async function saveOrUpdateMarca(tenant: string, userId: string, marca: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-marca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ userId, marca }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al actualizar o guardar la marca:', error);
        throw new Error("Error al actualizar o guardar la marca");
    }
}

export async function saveOrUpdateColor(tenant: string, userId: string, color: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-color`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ userId, color }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al actualizar o guardar el color:', error);
        throw new Error("Error al actualizar o guardar el color");
    }
}