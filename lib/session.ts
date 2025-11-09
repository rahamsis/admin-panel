/* eslint-disable */

export const fetchUserLogin = async (email: string, password: string, tenantId: string): Promise<any> => {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-tenant-id": tenantId || "",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return null;
    }
};