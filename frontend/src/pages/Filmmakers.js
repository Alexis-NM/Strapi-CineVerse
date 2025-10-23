import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchFilmmakers } from "../api/api";
import PersonCard from "../components/PersonCard";
import Pagination from "../components/Pagination";
import PersonModal from "../components/PersonModal";

export default function Filmmakers() {
  const [filmmakers, setFilmmakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadFilmmakers = async () => {
      const data = await fetchFilmmakers();
      setFilmmakers(data);
      setLoading(false);
    };
    loadFilmmakers();
  }, []);

  // Réception d'un réalisateur mis en avant depuis la recherche globale
  useEffect(() => {
    const highlight = location.state?.highlight;
    if (highlight?.type === "filmmaker" && highlight.item) {
      setSelectedPerson({ ...highlight.item, __fromSearch: true });
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Mise à jour du réalisateur sélectionné avec la version récupérée depuis l'API
  useEffect(() => {
    if (!selectedPerson?.__fromSearch || filmmakers.length === 0) return;
    const match = filmmakers.find((person) => person.id === selectedPerson.id);
    if (match) {
      setSelectedPerson(match);
    }
  }, [filmmakers, selectedPerson]);

  // Calcul des données pour la page actuelle
  const totalPages = Math.ceil(filmmakers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedFilmmakers = filmmakers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 bg-[#141414] text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Réalisateurs / réalisatrices
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : filmmakers.length === 0 ? (
        <p className="text-center text-gray-400">Aucun réal trouvé.</p>
      ) : (
        <>
          {/* Cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-44 gap-y-10 max-w-6xl justify-items-center">
            {displayedFilmmakers.map((person) => (
              <PersonCard key={person.id} person={person} type="filmmaker" />
            ))}
          </div>

          {/* Pagination */}
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
                movies={selectedPerson?.directed || []}
                type="filmmaker"
                onClose={() => setSelectedPerson(null)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
