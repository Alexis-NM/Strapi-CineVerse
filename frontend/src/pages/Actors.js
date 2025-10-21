import { useEffect, useState } from "react";
import { fetchMoviesWithActors } from "../api/api";
import ActorCard from "../components/ActorCard";

export default function Actors() {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    fetchMoviesWithActors().then((movies) => {
      const allActors = movies.flatMap((movie) => movie.actors || []);
      const uniqueActors = Array.from(
        new Map(allActors.map((actor) => [actor.documentId, actor])).values()
      );
      setActors(uniqueActors);
    });
  }, []);

  return (
    <div className="p-8 bg-[#141414] text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">Acteurs</h1>

      {actors.length === 0 ? (
        <p className="text-center text-gray-400">Aucun acteur trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-44 gap-y-10 max-w-6xl justify-items-center">
        {actors.map((actor) => (
            <ActorCard key={actor.documentId} actor={actor} />
        ))}
        </div>

      )}
    </div>
  );
}
