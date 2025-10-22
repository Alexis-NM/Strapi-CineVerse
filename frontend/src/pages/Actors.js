import { useEffect, useState } from "react";
import { fetchActors } from "../api/api";
import PersonCard from "../components/PersonCard";
import Pagination from "../components/Pagination"; 

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 9;

  useEffect(() => {
    const loadActors = async () => {
      const data = await fetchActors();
      setActors(data);
      setLoading(false);
    };

    loadActors();
  }, []);

  const totalPages = Math.ceil(actors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActors = actors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 bg-[#141414] text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">Acteurs / actrices</h1>

      {loading ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : actors.length === 0 ? (
        <p className="text-center text-gray-400">Aucun acteur/trice trouvé.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-44 gap-y-10 max-w-6xl justify-items-center">
            {currentActors.map((actor) => (
              <PersonCard key={actor.id} person={actor} type="actor" />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
