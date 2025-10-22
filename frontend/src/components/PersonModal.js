export default function PersonModal({ person, onClose }) {
  if (!person) return null;

  const actedIn = person.acted_in || [];
  const directed = person.directed || [];

  return (
    <div className="text-gray-300">
      {/* --- Header --- */}
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

      {/* --- Bio --- */}
      {person.biography && (
        <div className="mb-6 max-h-48 overflow-y-auto pr-2">
          <h3 className="font-semibold text-white mb-2">🧾 Biographie :</h3>
          <p className="text-sm text-gray-300 text-justify leading-relaxed">
            {person.biography}
          </p>
        </div>
      )}

      {/* --- Films joués --- */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-2">🎬 Films joués :</h3>
        {actedIn.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {actedIn.map((movie) => (
              <li key={movie.id}>
                {movie.title}{" "}
                {movie.release_date && (
                  <span className="text-gray-500 text-sm">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">Aucun film joué trouvé.</p>
        )}
      </div>

      {/* --- Films réalisés --- */}
      <div>
        <h3 className="font-semibold text-white mb-2">🎞️ Films réalisés :</h3>
        {directed.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {directed.map((movie) => (
              <li key={movie.id}>
                {movie.title}{" "}
                {movie.release_date && (
                  <span className="text-gray-500 text-sm">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">Aucun film réalisé trouvé.</p>
        )}
      </div>
    </div>
  );
}
