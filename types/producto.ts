export interface Producto {
    idProducto: string;
    idCategoria: string;
    categoria: string;
    idSubCategoria: string;
    subCategoria: string;
    idMarca: string;
    marca: string;
    nombre: string;
    precio: number;
    cantidad: number;
    idColor: string;
    color: string;
    descripcion: string;
    imagen: string;
    destacado: boolean;
    nuevo: boolean;
    masVendido: boolean;
    activo: boolean;
    fotos: string[];
}