import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMovies } from "../api/api";
import CardMovies from "../components/CardMovies";
import MovieOverlay from "../components/MovieOverlay";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function loadMovies() {
      try {
        setLoading(true);
        const data = await fetchMovies();
        if (mounted) setMovies(data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to load movies");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMovies();
    return () => (mounted = false);
  }, []);

  // Lorsque la navigation provient de la recherche, on récupère l'ID du film à ouvrir
  useEffect(() => {
    const highlight = location.state?.highlight;
    if (highlight?.type === "movie" && highlight.item) {
      const item = highlight.item;
      setSelectedMovie(item);
      setPendingSelection(item);
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
      // Nettoie l'état de navigation pour éviter une réouverture involontaire
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Une fois la liste des films chargée, on remplace par la version la plus à jour
  useEffect(() => {
    if (!pendingSelection || movies.length === 0) return;
    const match = movies.find((movie) => movie.id === pendingSelection.id);
    if (match) {
      setSelectedMovie(match);
      setPendingSelection(null);
    }
  }, [movies, pendingSelection]);

  useEffect(() => {
    if (selectedMovie)
      console.log(
        "selectedMovie set:",
        selectedMovie.id || selectedMovie.title || selectedMovie
      );
  }, [selectedMovie]);

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white">
      <main className="p-8 max-w-7xl mx-auto">
        {selectedMovie ? (
          <MovieOverlay
            movie={selectedMovie}
            onClose={() => {
              setSelectedMovie(null);
              setPendingSelection(null);
            }}
          />
        ) : null}

        <h1 className="text-3xl font-bold mb-4">Discover</h1>

        {loading ? (
          <p className="text-gray-400 text-center mt-10">Loading movies...</p>
        ) : error ? (
          <p className="text-red-400 text-center mt-10">{error}</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            No movies available.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {movies.map((movie) => (
                <CardMovies
                  key={movie.id}
                  movie={movie}
                  onClick={(m) => {
                    try {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } catch (e) {
                      window.scrollTo(0, 0);
                    }
                    setSelectedMovie(m);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
