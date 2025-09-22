export function createRutaCloudinary(tenant: string, categoria: string) {
    return [tenant, categoria.toLowerCase()]
        .filter(Boolean)
        .join("/") + "/";
}


export const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};
