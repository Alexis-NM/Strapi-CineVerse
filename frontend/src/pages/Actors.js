import { useEffect, useState } from "react";
import { fetchActors } from "../api/api";
import PersonCard from "../components/PersonCard"; // 🔹 nouveau nom

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActors = async () => {
      const data = await fetchActors();
      setActors(data);
      setLoading(false);
    };

    loadActors();
  }, []);

  return (
    <div className="p-8 bg-[#141414] text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">Acteurs / actrices</h1>

      {loading ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : actors.length === 0 ? (
        <p className="text-center text-gray-400">Aucun acteur/trice trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-44 gap-y-10 max-w-6xl justify-items-center">
          {actors.map((actor) => (
            <PersonCard key={actor.id} person={actor} type="actor" />
          ))}
        </div>
      )}
    </div>
  );
}
