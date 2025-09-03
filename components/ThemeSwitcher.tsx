"use client";
import { useState } from "react";

const ThemeSwitcher = () => {
  const [dark, setDark] = useState(false);
  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeSwitcher;
