import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchActors } from "../api/api";
import PersonCard from "../components/PersonCard";
import Pagination from "../components/Pagination";
import PersonModal from "../components/PersonModal";

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const itemsPerPage = 9;

  useEffect(() => {
    const loadActors = async () => {
      const data = await fetchActors();
      setActors(data);
      setLoading(false);
    };

    loadActors();
  }, []);

  // Réception d'un acteur mis en avant depuis la barre de recherche
  useEffect(() => {
    const highlight = location.state?.highlight;
    if (highlight?.type === "actor" && highlight.item) {
      setSelectedPerson({ ...highlight.item, __fromSearch: true });
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Lorsque la liste complète est chargée, remplace l'objet provisoire par la version fraîche
  useEffect(() => {
    if (!selectedPerson?.__fromSearch || actors.length === 0) return;
    const match = actors.find((actor) => actor.id === selectedPerson.id);
    if (match) {
      setSelectedPerson(match);
    }
  }, [actors, selectedPerson]);

  const totalPages = Math.ceil(actors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActors = actors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 bg-[#141414] text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Acteurs / actrices
      </h1>

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

      {selectedPerson ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPerson(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-3xl w-full mx-4 my-16">
            <div className="bg-[#1b1b1b] rounded-2xl shadow-2xl p-6">
              <PersonModal
                person={selectedPerson}
                movies={selectedPerson?.acted_in || []}
                type="actor"
                onClose={() => setSelectedPerson(null)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
