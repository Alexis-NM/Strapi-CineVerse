import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PersonModal from "./PersonModal";
import { MdOutlineNoPhotography } from "react-icons/md";

export default function PersonCard({ person, type }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  let movies = [];

  if (type === "actor") {
    movies = person.acted_in || [];
  } else if (type === "filmmaker") {
    movies = person.directed || [];
  } else if (person.is_actor && person.is_filmmaker) {
    const actedIn = person.acted_in || [];
    const directed = person.directed || [];
    movies = [
      ...actedIn,
      ...directed.filter((d) => !actedIn.some((a) => a.id === d.id)),
    ];
  }

  return (
    <div className="relative">
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

      <div
        className={`bg-[#1a1a1a] rounded-2xl shadow-md p-4 flex items-center gap-6 w-[360px] text-gray-200 cursor-pointer transition-transform duration-300 hover:scale-105 relative ${
          isOpen ? "z-50" : "z-10"
        }`}
        onClick={toggleOpen}
      >

        <div className="w-28 h-40 rounded-xl shadow flex items-center justify-center bg-gray-800 overflow-hidden">
          {person.profile_url ? (
            <img
              src={person.profile_url}
              alt={`${person.firstname || ""} ${person.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <MdOutlineNoPhotography className="text-gray-500 text-5xl" />
          )}
        </div>

        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-xl font-semibold text-white">
            {person.firstname} {person.name}
          </h3>
          {person.birthdate && (
            <p className="text-sm text-gray-400">
              🎂 {new Date(person.birthdate).toLocaleDateString("fr-FR")}
            </p>
          )}
          {person.gender && person.gender !== "unspecified" && (
            <p className="text-sm capitalize">Genre : {person.gender}</p>
          )}
        </div>
      </div>

      {/* Modale */}
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
              <PersonModal
                person={person}
                movies={movies}  
                type={type}       
                onClose={() => setIsOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
