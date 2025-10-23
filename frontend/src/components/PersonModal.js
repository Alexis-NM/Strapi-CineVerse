import { useNavigate } from "react-router-dom";

export default function PersonModal({ person, movies, type, onClose }) {
  const navigate = useNavigate();

  const handleMovieClick = (movie) => {
    onClose(); // ferme la modale
    navigate(`/home?movie=${movie.id}`); // 👈 redirige vers Home avec le film en paramètre
  };

  return (
    <div className="text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">
          {person.firstname} {person.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl transition"
        >
          ✕
        </button>
      </div>

      {person.biography && (
        <div className="mb-6 max-h-48 overflow-y-auto pr-2">
          <h3 className="font-semibold text-white mb-2">🧾 Biographie :</h3>
          <p className="text-sm text-gray-300 text-justify leading-relaxed">
            {person.biography}
          </p>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-white mb-2">
          {type === "actor" ? "🎬 Films joués :" : "🎞️ Films réalisés :"}
        </h3>

        {movies.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {movies.map((movie) => (
              <li key={movie.id}>
                <button
                  onClick={() => handleMovieClick(movie)}
                  className="text-blue-400 hover:underline hover:text-blue-300 transition"
                >
                  {movie.title}
                </button>{" "}
                {movie.release_date && (
                  <span className="text-gray-500 text-sm">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">
            Aucun film {type === "actor" ? "joué" : "réalisé"} trouvé.
          </p>
        )}
      </div>
    </div>
  );
}
