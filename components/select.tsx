'use client';
import { useState, useRef, useEffect } from "react";

interface CustomSelectProps<T> {
    options: T[];
    valueKey: keyof T;
    labelKey: keyof T;
    defaultValue?: string;
    onChange?: (value: string) => void;
}

export default function CustomSelect<T>({ options, valueKey, labelKey, defaultValue, onChange }: CustomSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue || String(options[0]?.[valueKey]));

    const dropdownRef = useRef<HTMLDivElement>(null);

    // 🔹 Cuando options cambien, setear valor inicial
    useEffect(() => {
        if (options.length > 0) {
            if (defaultValue) {
                setSelected(defaultValue);
            } else {
                setSelected(String(options[0][valueKey]));
            }
        }
    }, [options, defaultValue, valueKey]);

    // Cerrar dropdown si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setSelected(value);
        setIsOpen(false);
        if (onChange) onChange(value);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Botón principal */}
            <div
                className="border border-zinc-300 px-4 py-2  cursor-pointer flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{options.find(o => String(o[valueKey]) === selected)?.[labelKey] as string}</span>
                <span className="ml-2">
                    <i className="bi bi-chevron-down"></i>
                </span>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-zinc-300 shadow-lg max-h-60 overflow-auto">
                    {options.map(opt => (
                        <li
                            key={String(opt[valueKey])}
                            className={`px-4 py-2 cursor-pointer hover:bg-cyan-500 hover:text-white ${selected === String(opt[valueKey]) ? "text-zinc-800" : "text-zinc-500"
                                }`}
                            onClick={() => handleSelect(String(opt[valueKey]))}
                        >
                            {String(opt[labelKey])}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
