import { useEffect, useState } from "react";
import { fetchMoviesWithActors } from "../api/api";

export default function Actors() {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    fetchMoviesWithActors().then((movies) => {
      const allActors = movies.flatMap((movie) => movie.actors || []);
      // 🔁 enlever les doublons par documentId
      const uniqueActors = Array.from(
        new Map(allActors.map((actor) => [actor.documentId, actor])).values()
      );
      setActors(uniqueActors);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Acteurs</h1>

      {actors.length === 0 ? (
        <p className="text-center">Aucun acteur trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {actors.map((actor) => (
            <div
              key={actor.documentId}
              className="bg-white rounded-2xl shadow p-4 flex flex-col items-center"
            >
              <img
                src={
                  actor.profile_url ||
                  "https://via.placeholder.com/150x200?text=No+Image"
                }
                alt={actor.firstname}
                className="w-32 h-48 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold text-center">
                {actor.firstname} {actor.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
