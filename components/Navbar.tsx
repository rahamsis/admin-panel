"use client";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./userMenu";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-700 ml-20 lg:ml-10">Panel Administrativo</h1>
      
      <div className={`flex flex-row items-center gap-3 text-center ml-5`}>
        <ThemeSwitcher/>
        <UserMenu />
      </div>
      
    </header>
  );
};

export default Navbar;
