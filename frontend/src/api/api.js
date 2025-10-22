const API_URL = "http://localhost:1337/api";

// -- Utilitaire : remet en URL absolue les médias Strapi si besoin --
function toAbsoluteUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `http://localhost:1337${url}`;
}

// --- Helper: fetch avec JWT + gestion JSON + erreurs ---
async function apiFetch(path, options = {}) {
  const jwt = localStorage.getItem("jwt");

  const headers = {
    ...(options.headers || {}),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await res.text();

  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    console.error(`[API] ${res.status} ${path} ->`, json);
    throw new Error(
      `Erreur API ${res.status}: ${
        typeof json === "string"
          ? json
          : json?.error?.message || "Requête échouée"
      }`
    );
  }
  return json ?? {};
}

// --- Movies ---
export async function fetchMovies() {
  try {
    const data = await apiFetch(`/movies?populate=*&pagination[pageSize]=1000`);
    return data.data || [];
  } catch (err) {
    console.error("❌ Erreur API Strapi (films):", err);
    throw err;
  }
}

// --- Actors ---
export async function fetchActors() {
  try {
    const url =
      `/personalities` +
      `?filters[is_actor][$eq]=true` +
      `&populate[acted_in][fields][0]=title` +
      `&populate[acted_in][fields][1]=release_date` +
      `&populate[profil_picture][fields][0]=url` +
      `&pagination[pageSize]=1000`;

    console.log("📡 Fetching actors from:", `${API_URL}${url}`);

    const data = await apiFetch(url);
    // Décommentez la ligne suivante en cas de debug profond :
    // console.log("🎥 Data Strapi complète (acteurs):", JSON.stringify(data, null, 2));

    const items = data.data || [];

    const actors = items.map((item) => {
      const attr = item.attributes || {};

      const actedIn =
        attr.acted_in?.data?.map((movie) => ({
          id: movie.id,
          title: movie.attributes?.title ?? "Titre inconnu",
          release_date: movie.attributes?.release_date ?? null,
        })) || [];

      const pictureUrl = toAbsoluteUrl(
        attr.profil_picture?.data?.attributes?.url || attr.profile_url
      );

      return {
        id: item.id,
        firstname: attr.firstname,
        name: attr.name,
        birthdate: attr.birthdate,
        biography: attr.biography,
        gender: attr.gender,
        is_actor: attr.is_actor,
        is_filmmaker: attr.is_filmmaker,
        profile_url: pictureUrl,
        acted_in: actedIn,
      };
    });

    console.log(`✅ ${actors.length} acteurs récupérés`);
    return actors;
  } catch (err) {
    console.error("❌ Erreur API Strapi (acteurs):", err);
    return [];
  }
}

// --- Filmmakers ---
export async function fetchFilmmakers() {
  try {
    const url =
      `/personalities` +
      `?filters[is_filmmaker][$eq]=true` +
      `&populate[directed][fields][0]=title` +
      `&populate[directed][fields][1]=release_date` +
      `&populate[profil_picture][fields][0]=url` +
      `&pagination[pageSize]=1000`;

    console.log("📡 Fetching filmmakers from:", `${API_URL}${url}`);

    const data = await apiFetch(url);
    // Décommentez la ligne suivante en cas de debug profond :
    // console.log("🎬 Data Strapi complète (réalisateurs):", JSON.stringify(data, null, 2));

    const items = data.data || [];

    const filmmakers = items.map((item) => {
      const attr = item.attributes || {};

      const directed =
        attr.directed?.data?.map((movie) => ({
          id: movie.id,
          title: movie.attributes?.title ?? "Titre inconnu",
          release_date: movie.attributes?.release_date ?? null,
        })) || [];

      const pictureUrl = toAbsoluteUrl(
        attr.profil_picture?.data?.attributes?.url || attr.profile_url
      );

      return {
        id: item.id,
        firstname: attr.firstname,
        name: attr.name,
        birthdate: attr.birthdate,
        biography: attr.biography,
        gender: attr.gender,
        is_actor: attr.is_actor,
        is_filmmaker: attr.is_filmmaker,
        profile_url: pictureUrl,
        directed,
      };
    });

    console.log(`✅ ${filmmakers.length} réalisateurs récupérés`);
    return filmmakers;
  } catch (err) {
    console.error("❌ Erreur API Strapi (réalisateurs):", err);
    return [];
  }
}
