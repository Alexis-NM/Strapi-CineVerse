import React from "react";

function Footer() {
  return (
    <footer className="bg-[#141414] text-gray-300 mt-12">
      <div className="flex justify-start px-8 py-4">
        <h1 className="text-2xl font-extrabold text-[#e50000]">
          Cineverse
        </h1>
      </div>

      <div className="border-t border-gray-700 mx-8"></div>

      <div className="flex flex-col md:flex-row items-center justify-between text-sm py-4 px-8">
    
        <p className="text-gray-500">
          © 2025 Cineverse — All rights reserved.
        </p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-red-500 transition-colors">
            Terms of Use
          </a>
          <span className="text-gray-600">|</span>
          <a href="#" className="hover:text-red-500 transition-colors">
            Privacy Policy
          </a>
          <span className="text-gray-600">|</span>
          <a href="#" className="hover:text-red-500 transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
