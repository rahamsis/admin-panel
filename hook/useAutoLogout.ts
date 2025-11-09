import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useSessionExpired } from "@/components/session-expired-context";

export function useAutoLogout() {
    const { data: session } = useSession();
    const { showExpired } = useSessionExpired();

    useEffect(() => {
        if (!session) return;

        const exp = (session as any)?.expires;
        if (!exp) return;

        // Convierte a milisegundos
        const expTime = new Date(exp).getTime();
        const now = Date.now();
        const remaining = expTime - now;

        if (remaining <= 0) {
            signOut();
            return;
        }

        // // Prepara el temporizador
        // const timer = setTimeout(() => {
        //   signOut();
        // }, remaining);
        const timer = setTimeout(() => {
            showExpired();                 // ✅ Muestra el modal
            signOut({ redirect: false });  // ✅ Cierra sesión pero NO recarga la página
        }, remaining);

        return () => clearTimeout(timer);
    }, [session]);
}
