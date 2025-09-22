import { useEffect } from "react";

interface ModalAlert {
    message: string;
    onClose: () => void;
}

export const ModalAlert = ({ message, onClose }: ModalAlert) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 lg:mx-0 ">
                <div className="text-yellow-500 flex justify-center pb-3">
                    <i className="bi bi-exclamation-triangle-fill text-4xl"></i>
                </div>

                <div className="text-center">
                    <h2 className="text-lg mb-4 text-gray-700">{message}</h2>
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg bg-cyan-500 text-white">
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}