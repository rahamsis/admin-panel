"use client";

import { getAllCategories, getMenus, saveMenu } from "@/lib/actions";
import { useEffect, useRef, useState } from "react";
import { useTenant } from "@/app/context/dataContext";
import { Categoria } from "@/types/producto";
import { Menu } from "@/types/menu";
import { ModalSucces } from "@/components/modales/succes";
import { ModalAlert } from "@/components/modales/alert";

export default function MenuSelector() {
  const { tenantId, userId } = useTenant();
  const [available, setAvailable] = useState<Categoria[]>([]);
  const [selected, setSelected] = useState<Categoria[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activecategorie, setActivecategorie] = useState<Categoria | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalSaveMenu, setModalSaveMenu] = useState<string | null>(null)
  const [modalFailSaveMenu, setModalFailSaveMenu] = useState<string | null>(null)

  const refSelect = useRef<HTMLDivElement>(null);

  // 🔹 Cargar categorías disponibles
  useEffect(() => {
    fetchData()
  }, []);


  async function fetchData() {
    try {
      setIsLoading(true);
      if (!tenantId) return;

      const data = await getAllCategories(tenantId);
      // setAvailable(data);

      //cargamos el menu existente 
      const result = await getMenus(tenantId);
      const menuAsCategorias: Categoria[] = result.map((m: Menu) => ({
        idCategoria: m.idCategoria,
        categoria: m.titulo,
        activo: m.estado
      }));

      setSelected(menuAsCategorias);

      setAvailable(
        data.filter(
          (cat: Categoria) => !result.some((m: Menu) => m.idCategoria === cat.idCategoria)
        )
      );

    } catch (error) {
      console.error("Error obteniendo las categorias:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Cerrar al hacer clic fuera de ambos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refSelect.current &&
        !refSelect.current.contains(event.target as Node) &&
        refSelect.current &&
        !refSelect.current.contains(event.target as Node)
      ) {
        setActivecategorie(null);
        setActiveIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔹 Agregar item
  const addItem = (item: Categoria) => {
    if (selected.length >= 6) return; // máximo 6
    if (selected.some((i) => i.idCategoria === item.idCategoria)) return; // evitar duplicados
    setSelected([...selected, item]);
    setAvailable(available.filter((i) => i.idCategoria !== item.idCategoria));
  };

  // 🔹 Quitar item
  const removeItem = (item: Categoria) => {
    setAvailable([...available, item]); // vuelve a disponibles
    setSelected(selected.filter((i) => i.idCategoria !== item.idCategoria));
    setActiveIndex(null); // limpiar selección
  };

  // 🔹 Subir item
  const moveUp = () => {
    if (activeIndex === null || activeIndex === 0) return;
    const newList = [...selected];
    [newList[activeIndex - 1], newList[activeIndex]] = [
      newList[activeIndex],
      newList[activeIndex - 1],
    ];
    setSelected(newList);
    setActiveIndex(activeIndex - 1);
  };

  // 🔹 Bajar item
  const moveDown = () => {
    if (activeIndex === null || activeIndex === selected.length - 1) return;
    const newList = [...selected];
    [newList[activeIndex + 1], newList[activeIndex]] = [
      newList[activeIndex],
      newList[activeIndex + 1],
    ];
    setSelected(newList);
    setActiveIndex(activeIndex + 1);
  };

  // 🔹 Guardar cambios en DB
  const handleSaveMenu = async () => {
    const toUrl = (text: string): string =>
      "/" + text.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      const selectedAsmenu: Menu[] = selected.map((s: Categoria, index: number) => ({
        idMenu: "",
        urlMenu: toUrl(s.categoria),
        titulo: s.categoria,
        idCategoria: s.idCategoria,
        userId: userId || "",
        estado: true,
        orden: index + 1,
      }));

      const result = await saveMenu(tenantId || "", selectedAsmenu)

      if (result.status == 200) {
        setModalSaveMenu("El menú fue actualizado satisfactoriamente")
      } else {
        setModalFailSaveMenu("No se pudo actualizar el menú, intentelo nuevamente")

        fetchData();
      }

    } catch (error) {
      console.error("Error al guardar el menu. ", error);
    }

  };

  return (
    <div className="bg-white p-6 lg:rounded-xl shadow min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Menu Principal</h2>

      <div className="flex gap-6 p-6 justify-center" ref={refSelect}>
        {/* Columna izquierda */}
        <div className="flex flex-row">
          <div className="flex justify-center">
            <div className="flex flex-col justify-center gap-2 px-3">
              <button
                onClick={moveUp}
                className="p-2 border border-slate-300 rounded hover:bg-gray-300"
              >
                <i className="bi bi-chevron-up text-xl"></i>
              </button>
              <button
                onClick={moveDown}
                className="p-2 border border-slate-300 rounded hover:bg-gray-300"
              >
                <i className="bi bi-chevron-down text-xl"></i>
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-2">Menu navbar</h2>

            <div className="border rounded-lg w-40 lg:w-80 h-64 overflow-y-auto">
              {selected.map((cat, index) => (
                <div
                  key={cat.idCategoria}
                  onClick={() => {
                    setActiveIndex(index);
                    setActivecategorie(null);
                  }}
                  className={`px-3 py-2 cursor-pointer ${activeIndex === index
                    ? "text-cyan-500 font-semibold"
                    : "hover:bg-gray-200"
                    }`}
                >
                  {cat.categoria}
                </div>
              ))}
              {selected.length === 0 && (
                <p className="text-gray-400 text-sm p-3">Sin categorías</p>
              )}
            </div>

            <button
              onClick={() =>
                activeIndex !== null && removeItem(selected[activeIndex])
              }
              className="mt-4 px-4 py-2 border border-slate-300 rounded hover:bg-gray-200"
            >
              Retirar <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Columna derecha */}
        <div>
          <h2 className="font-bold mb-2">Categorias</h2>
          <div className="border rounded-lg w-40 lg:w-80 h-64 overflow-y-auto">
            {isLoading ? (
              <p className="text-gray-400 text-sm p-2">Cargando...</p>
            ) : (
              available.map((item) => (
                <div
                  key={item.idCategoria}
                  onClick={() => {
                    setActivecategorie(item);
                    setActiveIndex(null);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${activecategorie?.idCategoria === item.idCategoria
                    ? "text-cyan-500 font-semibold"
                    : "hover:bg-gray-200"
                    }`}
                >
                  {item.categoria}
                </div>
              ))
            )}
            {available.length === 0 && !isLoading && (
              <p className="text-gray-400 text-sm p-2">Sin categorías</p>
            )}
          </div>

          <button
            onClick={() =>
              activecategorie !== null && addItem(activecategorie)
            }
            className="mt-4 px-4 py-2 border border-slate-300 rounded hover:bg-gray-200"
          >
            <i className="bi bi-chevron-left"></i> Asignar
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-10 lg:pt-20">
        <button
          onClick={handleSaveMenu}
          disabled={selected.length === 0}
          className="mt-4 px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600"
        >
          Guardar Menú
        </button>
      </div>

      {modalSaveMenu && (
        <ModalSucces
          message={modalSaveMenu}
          onClose={() => setModalSaveMenu(null)}
        />
      )}

      {modalFailSaveMenu && (
        <ModalAlert
          message={modalFailSaveMenu}
          onClose={() => setModalFailSaveMenu(null)}
        />
      )}
    </div>

  );
}
