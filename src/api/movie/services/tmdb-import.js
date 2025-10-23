"use strict";

const slugify = require("slugify");

module.exports = ({ strapi }) => {
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
        select: ["id", "slug"],
      });

      const slug = toSlug(g.name, String(g.id));

      if (!cat) {
        cat = await strapi.entityService.create("api::category.category", {
          data: {
            tmdb_id: g.id,
            name: g.name,
            slug,
            publishedAt: new Date().toISOString(),
          },
        });
      } else if (!cat.slug) {
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
    let p = await strapi.db.query("api::personality.personality").findOne({
      where: { tmdb_id: personId },
      select: ["id"],
    });

    if (!p) {
      const tmdb = strapi.service("api::movie.tmdb");
      const person = await tmdb.fetchPersonDetails(personId).catch(() => ({}));

      const full = displayName || person.name || "";
      const { firstName, lastName } = tmdb.splitName(full);
      const data = {
        tmdb_id: personId,
        name: lastName || person.name || full,
        firstname: firstName || "",
        biography: person.biography || null,
        birthdate: person.birthday || null,
        gender: genderMap[person.gender] || "unspecified",
        is_actor: !!flags.actor,
        is_filmmaker: !!flags.filmmaker,
        profile_url: person.profile_path
          ? tmdb.imageUrl(person.profile_path, "w500")
          : null,
        publishedAt: new Date().toISOString(),
      };

      p = await strapi.entityService.create("api::personality.personality", {
        data,
      });
      return p.id;
    }

    // mettre à jour flags si nécessaires
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
    async importPopular(page = 1) {
      const tmdb = strapi.service("api::movie.tmdb");
      const movies = await tmdb.fetchPopular(page);

      let created = 0;
      let skipped = 0;
      let updated = 0;

      for (const m of movies) {
        const existing = await strapi.entityService.findMany(
          "api::movie.movie",
          {
            filters: { tmdb_id: m.id },
            fields: [
              "id",
              "trailer",
              "duration_minutes",
              "poster_url",
              "banner_url",
            ],
            limit: 1,
          }
        );
        const found = Array.isArray(existing) ? existing[0] : null;

        const [details, videos, credits] = await Promise.all([
          tmdb.fetchMovieDetails(m.id),
          tmdb.fetchMovieVideos(m.id),
          tmdb.fetchMovieCredits(m.id),
        ]);

        // Trailer (YouTube)
        const trailerObj =
          (videos || [])
            .filter((v) => v.site === "YouTube" && v.type === "Trailer")
            .sort((a, b) => {
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

        // Réals & Acteurs
        const directorCrew = (credits.crew || []).filter(
          (c) => c.job === "Director"
        );
        const directorIds = [];
        for (const d of directorCrew)
          directorIds.push(
            await upsertPerson(d.id, d.name, { filmmaker: true })
          );

        const actorIds = [];
        for (const a of (credits.cast || []).slice(0, 10)) {
          actorIds.push(await upsertPerson(a.id, a.name, { actor: true }));
        }

        // Catégories
        const categoryIds = await upsertCategoriesFromGenres(
          details.genres || []
        );

        // URL poster TMDb (fallback)
        const posterUrl = details.poster_path
          ? tmdb.imageUrl(details.poster_path, "w500")
          : null;

        // URL bannière TMDb (backdrop)
        const bannerUrl = details.backdrop_path
          ? tmdb.imageUrl(details.backdrop_path, "w1280")
          : null;

        if (!found) {
          await strapi.entityService.create("api::movie.movie", {
            data: {
              tmdb_id: m.id,
              title: m.title || m.original_title,
              description: details.overview || m.overview || null,
              release_date: m.release_date || details.release_date || null,
              popularity: m.popularity ?? details.popularity ?? null,
              duration_minutes: details.runtime || null,
              trailer: trailerUrl,
              poster_url: posterUrl,
              banner_url: bannerUrl,
              categories: categoryIds,
              actors: actorIds,
              directors: directorIds,
              publishedAt: new Date().toISOString(),
            },
          });
          created++;
        } else {
          const data = {};
          if (!found.trailer && trailerUrl) data.trailer = trailerUrl;
          if (!found.duration_minutes && details.runtime)
            data.duration_minutes = details.runtime;
          if (!found.poster_url && posterUrl) data.poster_url = posterUrl;
          if (!found.banner_url && bannerUrl) data.banner_url = bannerUrl;

          if (categoryIds.length) data.categories = categoryIds;
          if (actorIds.length) data.actors = actorIds;
          if (directorIds.length) data.directors = directorIds;

          if (Object.keys(data).length) {
            await strapi.entityService.update("api::movie.movie", found.id, {
              data,
            });
            updated++;
          } else {
            skipped++;
          }
        }
      }

      strapi.log.info(
        `[TMDb Import] Page ${page} → created: ${created}, updated: ${updated}, skipped: ${skipped}`
      );
      return { page, created, updated, skipped, totalProcessed: movies.length };
    },
  };
};
