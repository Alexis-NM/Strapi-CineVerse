import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActorModal from "./ActorModal";

export default function ActorCard({ actor }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* --- Overlay global flouté --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* --- La carte --- */}
      <div
        className={`bg-[#1a1a1a] rounded-2xl shadow-md p-4 flex items-center gap-6 w-[360px] text-gray-200 cursor-pointer transition-transform duration-300 hover:scale-105 relative ${
          isOpen ? "z-50" : "z-10"
        }`}
        onClick={toggleOpen}
      >
        <img
          src={
            actor.profile_url ||
            "https://via.placeholder.com/150x200?text=No+Image"
          }
          alt={`${actor.firstname || ""} ${actor.name}`}
          className="w-28 h-40 object-cover rounded-xl shadow"
        />
        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-xl font-semibold text-white">
            {actor.firstname} {actor.name}
          </h3>
          {actor.birthdate && (
            <p className="text-sm text-gray-400">
              🎂 {new Date(actor.birthdate).toLocaleDateString("fr-FR")}
            </p>
          )}
          {actor.gender && actor.gender !== "unspecified" && (
            <p className="text-sm capitalize">Genre : {actor.gender}</p>
          )}
        </div>
      </div>

      {/* --- Modale sous la card --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden relative z-50"
          >
            <div className="bg-[#222] rounded-2xl mt-3 p-6 shadow-lg">
              <ActorModal
                actor={actor}
                movies={actor.acted_in || []}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
