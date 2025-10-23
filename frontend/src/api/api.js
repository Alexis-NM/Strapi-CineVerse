// ───────────────────────────────────────────────────────────────────────────────
// Base URL (configurable via .env) : NEXT_PUBLIC_API_URL=http://localhost:1337
// ───────────────────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const API_URL = `${API_BASE}/api`;

// ───────────────────────────────────────────────────────────────────────────────
// Utilitaire : remet en URL absolue les médias Strapi si besoin
// ───────────────────────────────────────────────────────────────────────────────
export function toAbsoluteUrl(url) {
  if (!url) return null;
  // Déjà absolue ?
  if (/^https?:\/\//i.test(url)) return url;
  try {
    // Résout correctement /uploads/… par rapport à http://host/
    const base = new URL(API_BASE);
    base.pathname = "/";
    return new URL(url, base.toString()).toString();
  } catch {
    // Fallback simple
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Helper fetch : ajoute JWT si présent, parse JSON/texte, remonte les erreurs
// ───────────────────────────────────────────────────────────────────────────────
export async function apiFetch(path, options = {}) {
  const jwt =
    (typeof window !== "undefined" && localStorage.getItem("jwt")) || null;

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
    json = text; // parfois Strapi peut renvoyer du texte
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

// ───────────────────────────────────────────────────────────────────────────────
// Movies
// ───────────────────────────────────────────────────────────────────────────────
export async function fetchMovies() {
  const url = `/movies?populate=*&pagination[pageSize]=1000`;
  const data = await apiFetch(url);
  return Array.isArray(data?.data) ? data.data : [];
}

// ───────────────────────────────────────────────────────────────────────────────
// Actors
// ───────────────────────────────────────────────────────────────────────────────
export async function fetchActors() {
  // On demande explicitement les champs du modèle principal + relations utiles
  const url =
    `/personalities` +
    `?filters[is_actor][$eq]=true` +
    `&fields[0]=firstname` +
    `&fields[1]=name` +
    `&fields[2]=birthdate` +
    `&fields[3]=gender` +
    `&fields[4]=biography` +
    `&fields[5]=is_actor` +
    `&fields[6]=is_filmmaker` +
    `&fields[7]=profile_url` +
    `&populate[acted_in][fields][0]=title` +
    `&populate[acted_in][fields][1]=release_date` +
    `&populate[profil_picture][fields][0]=url` +
    `&pagination[pageSize]=1000`;

  console.log("📡 Fetching actors from:", `${API_URL}${url}`);
  const data = await apiFetch(url);

  const items = Array.isArray(data?.data) ? data.data : [];

  const actors = items.map((item) => {
    // Compat : certaines configs renvoient { id, attributes }, d'autres "à plat"
    const attr = item?.attributes ?? item ?? {};

    const actedInRaw = attr?.acted_in?.data || attr?.acted_in || [];
    const actedIn = actedInRaw.map((movie) => ({
      id: movie.id,
      title: movie.attributes?.title ?? movie.title ?? "Titre inconnu",
      release_date:
        movie.attributes?.release_date ?? movie.release_date ?? null,
    }));


    const pictureUrl = toAbsoluteUrl(
      attr?.profil_picture?.data?.attributes?.url || attr?.profile_url
    );

    return {
      id: item?.id ?? attr?.id,
      firstname: attr?.firstname ?? "",
      name: attr?.name ?? "",
      birthdate: attr?.birthdate ?? null,
      biography: attr?.biography ?? "",
      gender: attr?.gender ?? "unspecified",
      is_actor: attr?.is_actor ?? false,
      is_filmmaker: attr?.is_filmmaker ?? false,
      profile_url: pictureUrl ?? null,
      acted_in: actedIn,
    };
  });

  console.log(`✅ ${actors.length} acteurs récupérés`);
  return actors;
}

// ───────────────────────────────────────────────────────────────────────────────
// Filmmakers
// ───────────────────────────────────────────────────────────────────────────────
export async function fetchFilmmakers() {
  const url =
    `/personalities` +
    `?filters[is_filmmaker][$eq]=true` +
    `&fields[0]=firstname` +
    `&fields[1]=name` +
    `&fields[2]=birthdate` +
    `&fields[3]=gender` +
    `&fields[4]=biography` +
    `&fields[5]=is_actor` +
    `&fields[6]=is_filmmaker` +
    `&fields[7]=profile_url` +
    `&populate[directed][fields][0]=title` +
    `&populate[directed][fields][1]=release_date` +
    `&populate[profil_picture][fields][0]=url` +
    `&pagination[pageSize]=1000`;

  console.log("📡 Fetching filmmakers from:", `${API_URL}${url}`);
  const data = await apiFetch(url);

  const items = Array.isArray(data?.data) ? data.data : [];

  const filmmakers = items.map((item) => {
    const attr = item?.attributes ?? item ?? {};

    const directedRaw = attr?.directed?.data || attr?.directed || [];
    const directed = directedRaw.map((movie) => ({
      id: movie.id,
      title: movie.attributes?.title ?? movie.title ?? "Titre inconnu",
      release_date:
        movie.attributes?.release_date ?? movie.release_date ?? null,
    }));


    const pictureUrl = toAbsoluteUrl(
      attr?.profil_picture?.data?.attributes?.url || attr?.profile_url
    );

    return {
      id: item?.id ?? attr?.id,
      firstname: attr?.firstname ?? "",
      name: attr?.name ?? "",
      birthdate: attr?.birthdate ?? null,
      biography: attr?.biography ?? "",
      gender: attr?.gender ?? "unspecified",
      is_actor: attr?.is_actor ?? false,
      is_filmmaker: attr?.is_filmmaker ?? false,
      profile_url: pictureUrl ?? null,
      directed,
    };
  });

  console.log(`✅ ${filmmakers.length} réalisateurs récupérés`);
  return filmmakers;
}
