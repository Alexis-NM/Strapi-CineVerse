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
    const url = `${API_URL}/personalities?filters[is_actor][$eq]=true&populate[acted_in][populate]=poster&pagination[pageSize]=1000`;
    console.log("📡 Fetching actors from:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur HTTP ${response.status} - ${text}`);
    }

    const data = await response.json();
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
          attr.acted_in?.data?.map((movie) => {
            const m = movie.attributes || movie;
            return {
              id: movie.id,
              title: m.title,
              release_date: m.release_date,
              poster_url: m.poster?.data
                ? `http://localhost:1337${m.poster.data.attributes.url}`
                : m.poster_url || null,
            };
          }) || [],
      };
    });

    console.log(`✅ ${actors.length} acteurs récupérés`);
    return actors;
  } catch (err) {
    console.error("❌ Erreur API Strapi (acteurs):", err);
    return [];
  }
}
