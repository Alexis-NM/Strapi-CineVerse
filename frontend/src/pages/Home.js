import React, { useEffect, useState } from "react";
import { fetchMovies } from "../api/api";

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadMovies() {
      const data = await fetchMovies();
      setMovies(data);
    }
    loadMovies();
  }, []);

  return (
    <div className="bg-[#141414] min-h-screen text-white">

      <main className="p-8">
        {movies.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            Chargement des films...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="p-4 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {movie.title}
                </h2>
                <p className="text-gray-400 text-sm mb-1">
                   Réalisateur : {movie.director}
                </p>
                <p className="text-gray-500 text-sm">
                   Sortie : {movie.releaseDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
