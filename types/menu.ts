export interface Menu {
    idMenu: string;
    urlMenu: string;
    titulo: string;
    idCategoria: string;
    userId: string;
    estado: boolean;
    orden: number;
    subMenu?: string;
}