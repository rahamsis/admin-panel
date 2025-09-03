"use client";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1 className="text-xl font-semibold text-gray-700">Panel Administrativo</h1>
      <ThemeSwitcher />
    </header>
  );
};

export default Navbar;
