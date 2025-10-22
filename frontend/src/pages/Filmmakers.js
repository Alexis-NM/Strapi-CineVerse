import { useEffect, useState } from "react";
import { fetchFilmmakers } from "../api/api";
import PersonCard from "../components/PersonCard";

export default function Filmmakers() {
  const [filmmakers, setFilmmakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilmmakers = async () => {
      const data = await fetchFilmmakers();
      setFilmmakers(data);
      setLoading(false);
    };
    loadFilmmakers();
  }, []);

  return (
    <div className="p-8 bg-[#141414] text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">Réalisateurs / réalisatrices</h1>

      {loading ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : filmmakers.length === 0 ? (
        <p className="text-center text-gray-400">Aucun réal trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-44 gap-y-10 max-w-6xl justify-items-center">
          {filmmakers.map((person) => (
            <PersonCard key={person.id} person={person} type="filmmaker" />
          ))}
        </div>
      )}
    </div>
  );
}
