import { useState } from "react";
import ActorModal from "./ActorModal";

export default function ActorCard({ actor }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* --- La carte --- */}
      <div
        className="bg-[#1a1a1a] rounded-2xl shadow-md p-4 flex items-center gap-6 w-[360px] transition-transform duration-300 text-gray-200 hover:scale-105 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={
            actor.profile_url ||
            "https://via.placeholder.com/150x200?text=No+Image"
          }
          alt={`${actor.firstname || ""} ${actor.name}`}
          className="w-28 h-40 object-cover rounded-xl shadow"
        />
        <div className="flex flex-col justify-center gap-4">
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

      {/* --- Modale Overlay --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)} 
        >
          <div
            className="bg-[#222] rounded-2xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()} 
          >
            <ActorModal actor={actor} movies={actor.acted_in || []} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
