'use server';

import { Menu } from "@/types/menu";
import { Producto } from "@/types/producto";
import { WebSite } from "@/types/webSite";

/* eslint-disable */

export async function getAllProduct(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/all-products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': 'application/json'
            },
            next: { revalidate: 0 }
        });

        const data: Producto[] = await response.json();

        return data.map((row) => ({
            idProducto: row.idProducto,
            idCategoria: row.idCategoria,
            categoria: row.categoria,
            idSubCategoria: row.idSubCategoria,
            subCategoria: row.subCategoria,
            idMarca: row.idMarca,
            marca: row.marca,
            nombre: row.nombre,
            precio: row.precio,
            tipo: row.tipo,
            cantidad: row.cantidad,
            idColor: row.idColor,
            color: row.color,
            descripcion: row.descripcion,
            destacado: row.destacado,
            nuevo: row.nuevo,
            masVendido: row.masVendido,
            activo: row.activo,
            fotos: row.fotos,
            productospaquete: row.productospaquete
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
            categoria: row.categoria,
            activo: row.activo
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
            subCategoria: row.subCategoria,
            idCategoria: row.idCategoria,
            categoria: row.categoria,
            activo: row.activo
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
            marca: row.marca,
            urlFoto: row.urlFoto,
            activo: row.activo
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
            color: row.color,
            activo: row.activo
        }));
    } catch (error) {
        console.error('Error al obtener los colores:', error);
        throw new Error("Error al obtener los colores");
    }
}

export async function updateStatusProduct(tenant: string, idProduct: string, status: number) {
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

export async function saveProduct(tenant: string, formData: FormData) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/save-product`, {
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
        console.error("Error al guardar el producto", error);
        throw new Error("Error al guardar el producto")
    }
}

export async function updateProduct(tenant: string, formData: FormData) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-product`, {
            method: 'PUT',
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
        console.error("Error al  actualizar el producto", error);
        throw new Error("Error al  actualizar el producto")
    }
}

export async function saveOrUpdateCategories(tenant: string, userId: string, idCategoria: string, categoria: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-categorie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ userId, categoria, idCategoria }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al actualizar o guardar la categoria:', error);
        throw new Error("Error al actualizar o guardar la categoria");
    }
}

export async function saveOrUpdateSubCategories(tenant: string, userId: string, idSubCategoria: string, subCategoria: string, idCategoria: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-subcategorie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ userId, idSubCategoria, subCategoria, idCategoria }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al actualizar o guardar la subcategoria:', error);
        throw new Error("Error al actualizar o guardar la subcategoria");
    }
}

export async function deleteSubCategorie(tenant: string, idSubCategoria: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/delete-subcategorie`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ idSubCategoria }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al eliminar la subcategoria:', error);
        throw new Error("Error al eliminar la subcategoria");
    }
}

export async function saveOrUpdateMarca(tenant: string, formData: FormData) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-marca`, {
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
        console.error('Error al actualizar o guardar la marca:', error);
        throw new Error("Error al actualizar o guardar la marca");
    }
}

export async function deleteMarca(tenant: string, idMarca: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/delete-brand`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ idMarca }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al eliminar la marca:', error);
        throw new Error("Error al eliminar la marca");
    }
}

export async function saveOrUpdateColor(tenant: string, userId: string, idColor: string, color: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-or-save-color`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ userId, idColor, color }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error al actualizar o guardar el color:', error);
        throw new Error("Error al actualizar o guardar el color");
    }
}

export async function getProductById(tenant: string, idProduct: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/product-by-idProduct?idProduct=${idProduct}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();
        const row = data[0];

        return {
            idProducto: row.idProducto,
            idCategoria: row.idCategoria,
            categoria: row.categoria,
            idSubCategoria: row.idSubCategoria,
            subCategoria: row.subCategoria,
            idMarca: row.idMarca,
            marca: row.marca,
            nombre: row.nombre,
            precio: row.precio,
            tipo: row.tipo,
            cantidad: row.cantidad,
            idColor: row.idColor,
            color: row.color,
            descripcion: row.descripcion,
            rutaCloudinary: row.rutaCloudinary,
            destacado: row.destacado,
            nuevo: row.nuevo,
            masVendido: row.masVendido,
            activo: row.activo,
            fotos: row.fotos,
            productospaquete: row.productospaquete
        } as Producto;
    } catch (error) {
        console.error('Error al obtener los productos por ID:', error);
        throw new Error("Error al obtener los productos por ID");
    }
}

export async function updateStatusCategorie(tenant: string, idCategoria: string, status: number) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-status-categorie`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ idCategoria, status }),
            next: { revalidate: 0 }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al actualizar el estado de la categoria", error);
        throw new Error("Error al actualizar el estado de la categoria")
    }
}

export async function updateStatusSubCategorie(tenant: string, idSubCategoria: string, status: number) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-status-subcategorie`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ idSubCategoria, status }),
            next: { revalidate: 0 }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al actualizar el estado de la subcategoria", error);
        throw new Error("Error al actualizar el estado de la subcategoria")
    }
}

export async function updateStatusBrand(tenant: string, idMarca: string, status: number) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-status-brand`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ idMarca, status }),
            next: { revalidate: 0 }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al actualizar el estado de la marca", error);
        throw new Error("Error al actualizar el estado de la marca")
    }
}

export async function updateStatusColor(tenant: string, idColor: string, status: number) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-status-color`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
            body: JSON.stringify({ idColor, status }),
            next: { revalidate: 0 }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al actualizar el estado del color", error);
        throw new Error("Error al actualizar el estado del color")
    }
}

export async function getMenus(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/backendApi/menus`, {
            method: 'GET',
            cache: "no-store", // evita cache estático de Next.js
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                'accept': '/'
            },
        });

        const data = await response.json();

        return data.menus.map((item: Menu) => ({
            idMenu: String(item.idMenu),
            urlMenu: String(item.urlMenu),
            titulo: String(item.titulo),
            idCategoria: String(item.idCategoria),
            userId: String(item.userId),
            orden: Number(item.orden),
            estado: Boolean(item.estado),
            subMenu: item.subMenu ? item.subMenu.split(",") : [],
        }));
        // const menus: Menu[] = data.menus.map((item: any) => ({
        //     idMenu: String(item.idMenu),
        //     urlMenu: String(item.urlMenu),
        //     titulo: String(item.titulo),
        //     idCategoria: String(item.idCategoria),
        //     userId: String(item.userId),
        //     orden: Number(item.orden),
        //     estado: Boolean(item.estado),
        //     subMenu: item.subMenu ? item.subMenu.split(",") : [],
        // }));

        // const categorias: Categoria[] = data.categorias.map((item: any) => ({
        //     idCategoria: String(item.idCategoria),
        //     categoria: String(item.categoria),
        //     activo: Boolean(item.activo),
        //     subMenu: item.subMenu ? item.subMenu.split(",") : [],
        // }));

        // return { menus, categorias };
    } catch (error) {
        console.error('Error cargando menús:', error);
        throw new Error("Error cargando menús");
    }
}

export async function saveMenu(tenant: string, body: Menu[]) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/save-menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                "accept": "application/json"
            },
            body: JSON.stringify(body),
            next: { revalidate: 0 }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al guardar el menu", error);
        throw new Error("Error al guardar el menu")
    }
}

export async function getWebSite(tenant: string) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/get-website`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                "accept": "application/json"
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data.map((row: WebSite) => ({
            idEmpresa: row.idEmpresa,
            nombre: row.nombre,
            telefonoPrincipal: row.telefonoPrincipal,
            telefonoSecundario: row.telefonoSecundario,
            direccionPrincipal: row.direccionPrincipal,
            direccionSecundaria: row.direccionSecundaria,
            correo: row.correo,
            logo: row.logo
        }));
    } catch (error) {
        console.error("Error al traer los datos de la compañia", error);
        throw new Error("Error al traer los datos de la compañia")
    }
}

export async function updateWebSite(tenant: string, formData: FormData) {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/update-website`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                "X-Tenant-ID": tenant,
                "accept": "/"
            },
            body: formData,
            next: { revalidate: 0 }
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al guardar los datos de la compañia", error);
        throw new Error("Error al guardar los datos de la compañia")
    }
}