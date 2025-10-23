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
/* Helper fetch : ajoute JWT si présent, parse JSON/texte, remonte les erreurs */
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
// Helpers de normalisation
// ───────────────────────────────────────────────────────────────────────────────

// Assure que l'on récupère toujours un tableau depuis une relation Strapi
function extractCollection(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (Array.isArray(input?.data)) return input.data;
  return [];
}

// Prépare un résumé de film (utilisé dans les suggestions)
function normalizeMovieSummary(entity) {
  if (!entity) return null;
  const attr = entity.attributes ?? entity ?? {};
  const id = entity.id ?? attr.id ?? null;
  const posterSource = attr.poster ?? attr.poster_url ?? null;
  const poster = posterSource ? toAbsoluteUrl(posterSource) : null;
  const posterUrl = attr.poster_url ? toAbsoluteUrl(attr.poster_url) : poster;

  return {
    id,
    title: attr.title ?? "",
    release_date: attr.release_date ?? null,
    poster,
    poster_url: posterUrl,
  };
}

// Prépare un résumé de personnalité (nom + visuel)
function normalizePersonSummary(entity) {
  if (!entity) return null;
  const attr = entity.attributes ?? entity ?? {};
  const id = entity.id ?? attr.id ?? null;
  const profileSource =
    attr.profile ??
    attr.profile_url ??
    attr?.profil_picture?.data?.attributes?.url ??
    null;
  const profile = profileSource ? toAbsoluteUrl(profileSource) : null;

  return {
    id,
    firstname: attr.firstname ?? "",
    name: attr.name ?? "",
    profile_url: profile,
  };
}

// Transforme une réponse Strapi de film complet en objet exploitable sur le front
// Transforme une réponse Strapi de film complet en objet exploitable sur le front
export function normalizeMovie(entity) {
  if (!entity) return null;
  const attr = entity.attributes ?? entity ?? {};
  const id = entity.id ?? attr.id ?? null;

  // Poster: accepte string (poster / poster_url) et media (poster_picture)
  const posterSource = attr.poster ?? attr.poster_url ?? null;
  const computedPoster = posterSource ? toAbsoluteUrl(posterSource) : null;
  const fallbackPoster =
    attr.poster_url && !computedPoster
      ? toAbsoluteUrl(attr.poster_url)
      : computedPoster;

  // Banner: accepte string (banner / banner_url) et media (banner_picture)
  const bannerMediaUrl = attr?.banner_picture?.data?.attributes?.url ?? null;
  const bannerSource = attr.banner ?? attr.banner_url ?? bannerMediaUrl ?? null;
  const computedBanner = bannerSource ? toAbsoluteUrl(bannerSource) : null;
  const fallbackBanner =
    attr.banner_url && !computedBanner
      ? toAbsoluteUrl(attr.banner_url)
      : computedBanner;

  // Si tu ajoutes un champ multiple "banners" (media multiple), on l’extrait proprement
  const banners = extractCollection(attr.banners)
    .map((m) => {
      const u = m?.attributes?.url ?? m?.url ?? null;
      return u ? toAbsoluteUrl(u) : null;
    })
    .filter(Boolean);

  // Relations
  const actors = extractCollection(attr.actors)
    .map(normalizePersonSummary)
    .filter(Boolean);

  const directors = extractCollection(attr.directors)
    .map(normalizePersonSummary)
    .filter(Boolean);

  const categories = extractCollection(attr.categories)
    .map((category) => {
      if (!category) return null;
      const catAttr = category.attributes ?? category ?? {};
      return {
        id: category.id ?? catAttr.id ?? null,
        name: catAttr.name ?? "",
        slug: catAttr.slug ?? "",
      };
    })
    .filter(Boolean);

  return {
    id,
    title: attr.title ?? "",
    slug: attr.slug ?? "",
    overview: attr.overview ?? attr.description ?? "",
    description: attr.description ?? attr.overview ?? "",
    release_date: attr.release_date ?? null,
    duration_minutes:
      attr.duration_minutes ?? attr.duration ?? attr.runtime ?? null,
    popularity: attr.popularity ?? attr.views ?? null,

    // Poster final
    poster: computedPoster || fallbackPoster,
    poster_url: fallbackPoster || computedPoster,

    // Banner final (supporte url, media simple, ou carrousel)
    banner: computedBanner || fallbackBanner || banners[0] || null,
    banner_url: fallbackBanner || computedBanner || banners[0] || null,
    banners, // tableau si tu actives un champ media multiple

    trailer_url: attr.trailer_url ?? attr.trailer ?? null,

    cast: actors.map((person) => ({
      id: person.id,
      name: [person.firstname, person.name].filter(Boolean).join(" ").trim(),
      photo: person.profile_url,
    })),

    actors,
    directors,
    categories,
  };
}

// Transforme une réponse Strapi de personnalité en objet exploitable sur le front
export function normalizePerson(entity) {
  if (!entity) return null;
  const attr = entity.attributes ?? entity ?? {};
  const id = entity.id ?? attr.id ?? null;

  // Couvrir profile/profile_url ET la relation profil_picture (clé sans 'e')
  const profileSource =
    attr.profile ??
    attr.profile_url ??
    attr?.profil_picture?.data?.attributes?.url ??
    null;
  const profile = profileSource ? toAbsoluteUrl(profileSource) : null;

  return {
    id,
    firstname: attr.firstname ?? "",
    name: attr.name ?? "",
    birthdate: attr.birthdate ?? null,
    biography: attr.biography ?? "",
    gender: attr.gender ?? "unspecified",
    is_actor: attr.is_actor ?? false,
    is_filmmaker: attr.is_filmmaker ?? false,
    profile_url: profile,
    acted_in: extractCollection(attr.acted_in)
      .map(normalizeMovieSummary)
      .filter(Boolean),
    directed: extractCollection(attr.directed)
      .map(normalizeMovieSummary)
      .filter(Boolean),
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// Movies
// ───────────────────────────────────────────────────────────────────────────────
export async function fetchMovies() {
  const url = `/movies?populate=*&pagination[pageSize]=1000`;
  const data = await apiFetch(url);
  const items = Array.isArray(data?.data) ? data.data : [];
  // Chaque film est normalisé pour simplifier l'affichage côté interface
  return items.map(normalizeMovie).filter(Boolean);
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
  const actors = items.map(normalizePerson).filter(Boolean);

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
  const filmmakers = items.map(normalizePerson).filter(Boolean);
  console.log(`✅ ${filmmakers.length} réalisateurs récupérés`);
  return filmmakers;
}

// ───────────────────────────────────────────────────────────────────────────────
// Search helpers
// ───────────────────────────────────────────────────────────────────────────────

// Recherche des films correspondant au texte saisi
export async function searchMovies(query, limit = 5) {
  const trimmed = query?.trim();
  if (!trimmed) return [];
  const encoded = encodeURIComponent(trimmed);
  const url = `/movies?filters[title][$containsi]=${encoded}&pagination[pageSize]=${limit}`;
  const data = await apiFetch(url);
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map(normalizeMovie).filter(Boolean);
}

// Recherche des acteurs dont le prénom ou nom contient la requête
export async function searchActors(query, limit = 5) {
  const trimmed = query?.trim();
  if (!trimmed) return [];
  const encoded = encodeURIComponent(trimmed);
  const url =
    `/personalities` +
    `?filters[$and][0][is_actor][$eq]=true` +
    `&filters[$and][1][$or][0][firstname][$containsi]=${encoded}` +
    `&filters[$and][1][$or][1][name][$containsi]=${encoded}` +
    `&pagination[pageSize]=${limit}`;

  const data = await apiFetch(url);
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map(normalizePerson).filter(Boolean);
}

// Recherche des réalisateurs dont le prénom ou nom contient la requête
export async function searchFilmmakers(query, limit = 5) {
  const trimmed = query?.trim();
  if (!trimmed) return [];
  const encoded = encodeURIComponent(trimmed);
  const url =
    `/personalities` +
    `?filters[$and][0][is_filmmaker][$eq]=true` +
    `&filters[$and][1][$or][0][firstname][$containsi]=${encoded}` +
    `&filters[$and][1][$or][1][name][$containsi]=${encoded}` +
    `&pagination[pageSize]=${limit}`;

  const data = await apiFetch(url);
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map(normalizePerson).filter(Boolean);
}

// Lance les trois recherches en parallèle pour alimenter les suggestions
export async function searchContent(query, limit = 5) {
  const trimmed = query?.trim();
  if (!trimmed) {
    return { movies: [], actors: [], filmmakers: [] };
  }

  const [movies, actors, filmmakers] = await Promise.all([
    searchMovies(trimmed, limit),
    searchActors(trimmed, limit),
    searchFilmmakers(trimmed, limit),
  ]);

  return { movies, actors, filmmakers };
}
