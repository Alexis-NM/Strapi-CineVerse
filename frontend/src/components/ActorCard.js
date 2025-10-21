import { useState } from "react";
import ActorModal from "./ActorModal";

export default function ActorCard({ actor, movies }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-[#1a1a1a] rounded-2xl shadow-md p-4 flex flex-col items-center w-[360px] transition-transform duration-300"
    >
      <div
        className="flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={
            actor.profile_url ||
            "https://via.placeholder.com/150x200?text=No+Image"
          }
          alt={`${actor.firstname} ${actor.name}`}
          className="w-28 h-40 object-cover rounded-xl shadow"
        />
        <div>
          <h3 className="text-xl font-semibold text-white">
            {actor.firstname} {actor.name}
          </h3>
        </div>
      </div>

      {isOpen && (
        <ActorModal
          actor={actor}
          movies={movies}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
