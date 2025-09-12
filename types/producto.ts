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
    destacado: boolean;
    nuevo: boolean;
    masVendido: boolean;
    activo: boolean;
    fotos: Fotos[];
}

export interface Fotos {
    idFoto: string;
    url_foto: string;
    rutaCloudinary: string;
    isPrincipal: boolean;
}

export interface Categoria {
    idCategoria: string;
    categoria: string;
}

export interface SubCategoria {
    idSubCategoria: string;
    subCategoria: string;
}

export interface Marca {
    idMarca: string;
    marca: string;
}

export interface Color {
    idColor: string;
    color: string;
}