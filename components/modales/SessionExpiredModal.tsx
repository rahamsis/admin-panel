"use client";

import { useSessionExpired } from "../session-expired-context";
import { useRouter } from "next/navigation";

export default function SessionExpiredModal() {
    const { isExpired, hideExpired } = useSessionExpired();
    const router = useRouter();

    if (!isExpired) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"  onClick={(e) => e.stopPropagation()}>
            <div className="bg-white p-6 rounded shadow-xl w-80 text-center">
                <h2 className="text-lg font-bold mb-3">Sesión finalizada</h2>
                <p className="mb-4 text-sm text-sidebar">
                    Tu sesión ha terminado. Por favor, inicia sesión nuevamente.
                </p>

                <button
                    onClick={() => {
                        router.push("/")
                        hideExpired();}}
                    className="px-4 py-2 bg-cyan-500 text-white rounded"
                >
                    Ir a iniciar sesión
                </button>
            </div>
        </div>
    );
}
