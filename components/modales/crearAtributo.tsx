'use client'

/* eslint-disable */
import { useState } from "react";
import { useTenant } from "@/app/context/dataContext";
import { saveOrUpdateCategories, saveOrUpdateColor, saveOrUpdateMarca, saveOrUpdateSubCategories } from "@/lib/actions";

interface ModalAddCategorie {
    idcategoria?: string;
    accion: string;
    attribute: string;
    value?: string;
    onClose: () => void;
    onSaved: (result: any) => void;
}


export const ModalAddAttribute = ({ idcategoria, accion, attribute, value, onClose, onSaved }: ModalAddCategorie) => {
    const { tenantId, userId } = useTenant();
    const [newAttribute, setNewAttribute] = useState(value || "");
    const [alert, setAlert] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (newAttribute == "" || newAttribute == null) {
            setAlert("Ingrese un valor para continuar")
            return;
        }

        const result = attribute === "Categoria" ?
            await saveOrUpdateCategories(tenantId || "", userId || "", idcategoria || "", newAttribute) : attribute === "Sub Categoria" ?
                await saveOrUpdateSubCategories(tenantId || "", userId || "", newAttribute) : attribute === "Marca" ?
                    await saveOrUpdateMarca(tenantId || "", userId || "", newAttribute) : attribute === "Color" ?
                        await saveOrUpdateColor(tenantId || "", userId || "", newAttribute) : null;
        // 👇 avisamos al padre pasándole el resultado
        onSaved(result);

        onClose(); // cerrar modal si deseas
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 lg:mx-0 ">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-secondary">{accion} {attribute}</h2>
                </div>

                <input
                    type="text"       // 👈 permite decimales
                    placeholder={attribute}
                    value={newAttribute}
                    onChange={(e) => {
                        setAlert("")
                        setNewAttribute(e.target.value)
                    }}
                    className="border p-2 w-full focus:outline-none focus:border-cyan-500 focus:ring-cyan-500"
                />
                {alert && (
                    <label className="text-red-500 text-xs">{alert}</label>
                )}

                <div className="flex justify-end space-x-4 mt-4">
                    <button onClick={handleSubmit} className="bg-cyan-500 text-white px-4 py-2 rounded">
                        Guardar
                    </button>
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                        Cancelar
                    </button>
                </div>
            </div>
        </div >
    );
};