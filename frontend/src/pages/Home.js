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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6"> Liste des films</h1>
      {movies.length === 0 ? (
        <p>Chargement des films...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="p-4 bg-gray-100 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-700 text-sm mb-1">
                 Réalisateur : {movie.director}
              </p>
              <p className="text-gray-500 text-sm">
                 Sortie : {movie.releaseDate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
