const API_URL = "http://localhost:1337/api";


export async function fetchMovies() {
  try {
    const response = await fetch(`${API_URL}/movies?populate=*`);
    if (!response.ok) throw new Error("Erreur lors du chargement des films");
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("❌ Erreur API Strapi (films):", err);
    throw err;
  }
}

export async function fetchActors() {
  try {
    const url = `${API_URL}/personalities?filters[is_actor][$eq]=true&populate[acted_in][fields][0]=title&populate[acted_in][fields][1]=release_date&pagination[pageSize]=1000`;
    console.log("📡 Fetching actors from:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur HTTP ${response.status} - ${text}`);
    }

    const data = await response.json();
      console.log("🎥 Data Strapi complète (acteurs):", JSON.stringify(data, null, 2));

    const items = data.data || [];

    const actors = items.map((item) => {
      const attr = item.attributes || item;

      return {
        id: item.id,
        firstname: attr.firstname,
        name: attr.name,
        birthdate: attr.birthdate,
        biography: attr.biography,
        gender: attr.gender,
        is_actor: attr.is_actor,
        is_filmmaker: attr.is_filmmaker,

        profile_url: attr.profil_picture?.data
          ? `http://localhost:1337${attr.profil_picture.data.attributes.url}`
          : attr.profile_url || null,

        acted_in:
        attr.acted_in?.map((movie) => ({
          id: movie.id,
          title: movie.title || "Titre inconnu",
          release_date: movie.release_date || null,
        })) || [],

      };
    });

    console.log(`✅ ${actors.length} acteurs récupérés`);
    return actors;
  } catch (err) {
    console.error("❌ Erreur API Strapi (acteurs):", err);
    return [];
  }
}

export async function fetchFilmmakers() {
  try {
    const url = `${API_URL}/personalities?filters[is_filmmaker][$eq]=true&populate=directed`;
    console.log("📡 Fetching filmmakers from:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur HTTP ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("🎬 Data Strapi complète (réalisateurs):", JSON.stringify(data, null, 2));

    const items = data.data || [];

    const filmmakers = items.map((item) => {
      const attr = item.attributes || item;

      return {
        id: item.id,
        firstname: attr.firstname,
        name: attr.name,
        birthdate: attr.birthdate,
        biography: attr.biography,
        gender: attr.gender,
        is_actor: attr.is_actor,
        is_filmmaker: attr.is_filmmaker,

        profile_url: attr.profil_picture?.data
          ? `http://localhost:1337${attr.profil_picture.data.attributes.url}`
          : attr.profile_url || null,

        directed:
          attr.directed?.map((movie) => ({
            id: movie.id,
            title: movie.title || "Titre inconnu",
            release_date: movie.release_date || null,
          })) || [],
      };
    });

    console.log(`✅ ${filmmakers.length} réalisateurs récupérés`);
    return filmmakers;
  } catch (err) {
    console.error("❌ Erreur API Strapi (réalisateurs):", err);
    return [];
  }
}


