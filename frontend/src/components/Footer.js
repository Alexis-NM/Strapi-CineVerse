import React from "react";
import { NavLink } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Movies", to: "/home" },
  { label: "Actors", to: "/actors" },
  { label: "Directors", to: "/filmmakers" },
  { label: "Favorites", to: "/favorites" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0b0b] text-gray-300">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-[10px] uppercase tracking-[0.35em] text-white/70">
              Logo
            </div>
            <span className="text-2xl font-semibold tracking-[0.35em] uppercase">
              Cineverse
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Discover, explore, and track the cinematic worlds that inspire you.
            Open a movie, actor, or director to dive into their universe instantly.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
            Navigation
          </h3>
          <nav className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {FOOTER_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
            Contact
          </h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>
              <span className="text-white/80">Support:</span>{" "}
              support@cineverse.app
            </li>
            <li>
              <span className="text-white/80">Press:</span>{" "}
              press@cineverse.app
            </li>
            <li>
              21 Crunchers Avenue, Los Angeles, CA 90001
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p className="tracking-wide">
            © {currentYear} Cineverse. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <NavLink to="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </NavLink>
            <span>•</span>
            <NavLink to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </NavLink>
            <span>•</span>
            <NavLink to="/legal-notice" className="hover:text-white transition-colors">
              Legal Notice
            </NavLink>
            <span>•</span>
            <NavLink to="/cookies" className="hover:text-white transition-colors">
              Cookie Settings
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
