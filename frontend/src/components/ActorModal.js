import { motion } from "framer-motion";

export default function ActorModal({ actor, movies, onClose }) {
  if (!actor) return null;

  // Trouver les films où l'acteur est présent
  const actedIn = movies.filter((m) =>
    m.actors?.some((a) => a.documentId === actor.documentId)
  );
  const directed = movies.filter((m) =>
    m.directors?.some((d) => d.documentId === actor.documentId)
  );

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-6 max-w-2xl w-full relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <div className="flex flex-col items-center">
          <img
            src={
              actor.profile_url ||
              "https://via.placeholder.com/200x250?text=No+Image"
            }
            alt={actor.firstname}
            className="w-40 h-52 object-cover rounded mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">
            {actor.firstname} {actor.name}
          </h2>

          <div className="mt-4 text-gray-700 w-full">
            {actedIn.length > 0 && (
              <>
                <h3 className="font-semibold mb-2">🎭 Acteur dans :</h3>
                <ul className="list-disc list-inside mb-4">
                  {actedIn.map((m) => (
                    <li key={m.documentId}>{m.title}</li>
                  ))}
                </ul>
              </>
            )}

            {directed.length > 0 && (
              <>
                <h3 className="font-semibold mb-2">🎬 Réalisateur de :</h3>
                <ul className="list-disc list-inside">
                  {directed.map((m) => (
                    <li key={m.documentId}>{m.title}</li>
                  ))}
                </ul>
              </>
            )}

            {actedIn.length === 0 && directed.length === 0 && (
              <p className="text-center text-gray-500">Aucune donnée disponible.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
