import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { fetchMovies } from "../api/api";
import CardMovies from "../components/CardMovies";
import MovieOverlay from "../components/MovieOverlay";

function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const data = await fetchMovies();
        setMovies(data || []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des films");
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
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

  // 👇 Quand Home se charge, si l’URL contient ?movie=xx
  useEffect(() => {
    const movieId = searchParams.get("movie");
    if (movieId && movies.length > 0) {
      const movie = movies.find((m) => String(m.id) === String(movieId));
      if (movie) {
        setSelectedMovie(movie);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [searchParams, movies]);

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white">
      <main className="p-8 max-w-7xl mx-auto">
        {selectedMovie && (
          <MovieOverlay
            movie={selectedMovie}
            onClose={() => {
              setSelectedMovie(null);
              setPendingSelection(null);
            }}
          />
        )}

        <h1 className="text-3xl font-bold mb-4">Discover</h1>

        {loading ? (
          <p className="text-gray-400 text-center mt-10">Chargement...</p>
        ) : error ? (
          <p className="text-red-400 text-center mt-10">{error}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {movies.map((movie) => (
              <CardMovies
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
