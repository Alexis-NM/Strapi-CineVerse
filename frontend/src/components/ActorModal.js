export default function ActorModal({ actor, movies, onClose }) {
  if (!actor) return null;

  const actedIn = movies.filter((movie) =>
    movie.actors?.some((a) => a.documentId === actor.documentId)
  );

  const directed = movies.filter((movie) =>
    movie.directors?.some((d) => d.documentId === actor.documentId)
  );

  return (
    <div className="text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">
          {actor.firstname} {actor.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl transition"
        >
          ✕
        </button>
      </div>

      {actor.biography && (
        <div className="mb-6 max-h-48 overflow-y-auto pr-2">
          <h3 className="font-semibold text-white mb-2">🧾 Biographie :</h3>
          <p className="text-sm text-gray-300 text-justify leading-relaxed">
            {actor.biography}
          </p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold text-white mb-2">🎬 Films :</h3>
        {actedIn.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {actedIn.map((movie) => (
              <li key={movie.documentId}>{movie.title}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun film trouvé.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-white mb-2">🎞️ Réalisations :</h3>
        {directed.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {directed.map((movie) => (
              <li key={movie.documentId}>{movie.title}</li>
            ))}
          </ul>
        ) : (
          <p>Aucune réalisation trouvée.</p>
        )}
      </div>
    </div>
  );
}
