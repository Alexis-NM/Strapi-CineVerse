
const API_URL = "http://localhost:1337/api/movies";

export async function fetchMovies() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur lors du chargement des films");
    const data = await response.json();
    return data.data; 
  } catch (err) {
    console.error("❌ Erreur API Strapi:", err);
    throw err;
  }
}
