"use strict";

const slugify = require("slugify");
const uploadFromUrl = require("../../../utils/upload-from-url"); // src/utils/upload-from-url.js

module.exports = ({ strapi }) => {
  // --- helpers internes ---

  const genderMap = {
    0: "unspecified",
    1: "female",
    2: "male",
    3: "non_binary",
  };

  function toSlug(name, fallback = "") {
    const base = name || fallback || "";
    const s = slugify(base, { lower: true, strict: true, locale: "fr" });
    return s || slugify(String(Date.now()), { lower: true, strict: true });
  }

  async function upsertCategoriesFromGenres(genres = []) {
    const ids = [];
    for (const g of genres) {
      if (!g || !g.id || !g.name) continue;

      let cat = await strapi.db.query("api::category.category").findOne({
        where: { tmdb_id: g.id },
        select: ["id"],
      });

      const slug = toSlug(g.name, String(g.id));

      if (!cat) {
        cat = await strapi.entityService.create("api::category.category", {
          data: {
            tmdb_id: g.id,
            name: g.name,
            slug, // ✅ on fournit explicitement le uid
            publishedAt: new Date().toISOString(),
          },
        });
      } else {
        // au cas où des anciennes lignes aient slug null
        await strapi.entityService.update("api::category.category", cat.id, {
          data: { slug },
        });
      }
      ids.push(cat.id);
    }
    return ids;
  }

  async function upsertPerson(
    personId,
    displayName,
    flags = { actor: false, filmmaker: false }
  ) {
    // cherche par tmdb_id
    let p = await strapi.db.query("api::personality.personality").findOne({
      where: { tmdb_id: personId },
      select: ["id"],
    });

    if (!p) {
      // fetch détails TMDb
      const tmdb = strapi.service("api::movie.tmdb");
      const person = await tmdb.fetchPersonDetails(personId).catch(() => ({}));

      const full = displayName || person.name || "";
      const { firstName, lastName } = strapi
        .service("api::movie.tmdb")
        .splitName(full);
      const data = {
        tmdb_id: personId,
        name: lastName || person.name || full, // champ "name" requis dans ton schema
        firstname: firstName || "",
        biography: person.biography || null,
        birthdate: person.birthday || null,
        gender: genderMap[person.gender] || "unspecified",
        is_actor: !!flags.actor,
        is_filmmaker: !!flags.filmmaker,
        publishedAt: new Date().toISOString(),
      };

      // photo de profil (optionnel)
      if (person.profile_path) {
        try {
          const url = strapi
            .service("api::movie.tmdb")
            .imageUrl(person.profile_path, "w500");
          const up = await uploadFromUrl(
            strapi,
            url,
            `person_${personId}.jpg`,
            {}
          );
          if (up?.id) data.profil_picture = up.id;
        } catch (e) {
          strapi.log.warn(
            `[TMDb Import] profil_picture upload failed for person ${personId}: ${e.message}`
          );
        }
      }

      p = await strapi.entityService.create("api::personality.personality", {
        data,
      });
      return p.id;
    }

    // s'assurer que les flags sont à jour
    const patch = {};
    if (flags.actor) patch.is_actor = true;
    if (flags.filmmaker) patch.is_filmmaker = true;
    if (Object.keys(patch).length) {
      await strapi.entityService.update("api::personality.personality", p.id, {
        data: patch,
      });
    }
    return p.id;
  }

  return {
    /**
     * Importe la page "popular" et enrichit:
     * - catégories (genres) avec slug
     * - réalisateurs/acteurs (personnalités complètes)
     * - poster (upload)
     * - durée (runtime)
     * - trailer (YouTube)
     */
    async importPopular(page = 1) {
      const tmdb = strapi.service("api::movie.tmdb");
      const movies = await tmdb.fetchPopular(page);

      let created = 0;
      let skipped = 0;

      for (const m of movies) {
        // 1) skip si déjà importé
        const exists = await strapi.db.query("api::movie.movie").findOne({
          where: { tmdb_id: m.id },
          select: ["id"],
        });
        if (exists) {
          skipped++;
          continue;
        }

        // 2) détails, vidéos, crédits
        const [details, videos, credits] = await Promise.all([
          tmdb.fetchMovieDetails(m.id),
          tmdb.fetchMovieVideos(m.id),
          tmdb.fetchMovieCredits(m.id),
        ]);

        // 3) catégories (genres)
        const categoryIds = await upsertCategoriesFromGenres(
          details.genres || []
        );

        // 4) réalisateurs
        const directorCrew = (credits.crew || []).filter(
          (c) => c.job === "Director"
        );
        const directorIds = [];
        for (const d of directorCrew) {
          const id = await upsertPerson(d.id, d.name, { filmmaker: true });
          directorIds.push(id);
        }

        // 5) acteurs (top 10)
        const topCast = (credits.cast || []).slice(0, 10);
        const actorIds = [];
        for (const a of topCast) {
          const id = await upsertPerson(a.id, a.name, { actor: true });
          actorIds.push(id);
        }

        // 6) trailer
        const trailerObj =
          (videos || [])
            .filter((v) => v.site === "YouTube" && v.type === "Trailer")
            .sort((a, b) => {
              // official d'abord, sinon par published_at desc si dispo
              const oa = a.official ? 1 : 0;
              const ob = b.official ? 1 : 0;
              if (oa !== ob) return ob - oa;
              const da = Date.parse(a.published_at || a.publishedAt || 0) || 0;
              const db = Date.parse(b.published_at || b.publishedAt || 0) || 0;
              return db - da;
            })[0] || null;
        const trailerUrl = trailerObj
          ? `https://www.youtube.com/watch?v=${trailerObj.key}`
          : null;

        // 7) poster (upload)
        let posterId = null;
        if (details.poster_path) {
          try {
            const url = tmdb.imageUrl(details.poster_path, "w780");
            const up = await uploadFromUrl(
              strapi,
              url,
              `movie_${m.id}.jpg`,
              {}
            );
            posterId = up?.id || null;
          } catch (e) {
            strapi.log.warn(
              `[TMDb Import] poster upload failed for movie ${m.id}: ${e.message}`
            );
          }
        }

        // 8) création du film
        await strapi.entityService.create("api::movie.movie", {
          data: {
            tmdb_id: m.id,
            title: m.title || m.original_title,
            description: details.overview || m.overview || null,
            release_date: m.release_date || details.release_date || null,
            popularity: m.popularity ?? details.popularity ?? null,
            duration_minutes: details.runtime || null,
            trailer: trailerUrl,
            poster_picture: posterId,
            categories: categoryIds,
            actors: actorIds,
            directors: directorIds,
            publishedAt: new Date().toISOString(),
          },
        });

        created++;
      }

      strapi.log.info(
        `[TMDb Import] Page ${page} → Films créés: ${created}, ignorés: ${skipped}`
      );
      return { page, created, skipped, totalProcessed: movies.length };
    },
  };
};
