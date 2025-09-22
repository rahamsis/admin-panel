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
    tipo: number;
    cantidad: number;
    idColor: string;
    color: string;
    descripcion: string;
    destacado: boolean;
    nuevo: boolean;
    masVendido: boolean;
    activo: boolean;
    fotos: Fotos[];
    productospaquete: ProductosPaquete[]
}

export interface Fotos {
    idFoto: string;
    url_foto: string;
    rutaCloudinary: string;
    isPrincipal: boolean;
}

export interface ProductosPaquete {
    idProductoPaquete: string;
    idPaquete: string;
    idProducto: string;
    cantidad: number;
}

export interface Categoria {
    idCategoria: string;
    categoria: string;
    activo: boolean;
}

export interface SubCategoria {
    idSubCategoria: string;
    subCategoria: string;
    idCategoria?: string;
    categoria?: string;
    activo: boolean;
}

export interface Marca {
    idMarca: string;
    marca: string;
    activo: boolean;
}

export interface Color {
    idColor: string;
    color: string;
    activo: boolean;
}