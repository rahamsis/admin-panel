"use client";
import { useState } from "react";

export default function Settings() {
  const [title, setTitle] = useState("Mi página");
  const [description, setDescription] = useState("Descripción aquí");
  const [color, setColor] = useState("#3b82f6");

  const handleSave = () => {
    alert("Configuración guardada para este tenant 🚀");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Configuración del sitio</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Título"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Descripción"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-10 border rounded"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
