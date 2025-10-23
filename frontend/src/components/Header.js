import React from "react";
import { NavLink } from "react-router-dom";
import { LuSearch, LuCircleUser } from "react-icons/lu";

function Header() {
  const navItems = [
    { label: "Movies", to: "/home" },
    { label: "Actors", to: "/actors" },
    { label: "Directors", to: "/filmmakers" },
    { label: "Favorites", to: "/favorites" },
  ];

  return (
    <header className="bg-[#0c0c0c] text-white border-t border-[#1b68d2] border-b border-white/10">
      <div className="relative w-full px-4 sm:px-6 py-4 flex items-center justify-center">
        <div className="absolute left-4 sm:left-6 flex items-center gap-3 min-w-[160px] flex-shrink-0">
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-[10px] uppercase tracking-[0.35em] text-white/60">
            Logo
          </div>
          <span className="text-xl font-semibold tracking-[0.35em] uppercase">
            Cineverse
          </span>
        </div>

        <nav className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-2xl p-1 shadow-inner overflow-x-auto whitespace-nowrap">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                    : "text-gray-400 hover:text-white/90",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute right-4 sm:right-6 flex items-center gap-6 text-xl min-w-[100px] justify-end flex-shrink-0">
          <button
            type="button"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Search"
          >
            <LuSearch />
          </button>
          <NavLink
            to="/account"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Account"
          >
            <LuCircleUser className="text-2xl" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
