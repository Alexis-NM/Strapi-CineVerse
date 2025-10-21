
const API_URL = "http://localhost:1337/api";

export async function fetchMovies() {
  try {
    const response = await fetch(`${API_URL}/movies`);
    if (!response.ok) throw new Error("Erreur lors du chargement des films");
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("❌ Erreur API Strapi (films):", err);
    throw err;
  }
}

export async function fetchMoviesWithActors() {
  try {
    const response = await fetch(`${API_URL}/movies?populate[actors]=*`);
    if (!response.ok) throw new Error("Erreur lors du chargement des films");
    const data = await response.json();
    return data.data; 
  } catch (err) {
    console.error("❌ Erreur API Strapi:", err);
    return [];
  }
}

