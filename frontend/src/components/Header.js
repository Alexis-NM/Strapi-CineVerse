import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

function Header() {
  return (
    <header className="bg-[#141414] text-white px-8 py-4 flex items-center justify-between shadow-md">

      <h1 className="text-2xl font-extrabold tracking-wider cursor-pointer text-[#e50000] hover:text-red-400 transition-colors">
        Cineverse
      </h1>

      <nav className="flex items-center gap-10">
        <button className="text-lg font-medium hover:text-red-500 transition-colors">
          Movies
        </button>
        <button className="text-lg font-medium hover:text-red-500 transition-colors">
          Actors
        </button>
      </nav>

      <div className="flex items-center gap-6 text-xl">
        <button className="hover:text-red-500 transition-colors">
          <FaSearch />
        </button>
        <button className="hover:text-red-500 transition-colors relative">
          <FaBell />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
