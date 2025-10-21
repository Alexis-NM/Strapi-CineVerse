export default function ActorModal({ actor, movies, onClose }) {
  if (!actor) return null;

  const actedIn = movies.filter((movie) =>
    movie.actors?.some((a) => a.documentId === actor.documentId)
  );

  const directed = movies.filter((movie) =>
    movie.directors?.some((d) => d.documentId === actor.documentId)
  );

  return (
    <div className="w-full bg-[#222] mt-4 p-4 rounded-xl text-gray-300">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-white">
          Détails de {actor.firstname} {actor.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-2">Films joués :</h3>
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

      <div className="mt-4">
        <h3 className="font-semibold text-white mb-2">Réalisations :</h3>
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
