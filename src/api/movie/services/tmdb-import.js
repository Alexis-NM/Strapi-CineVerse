"use strict";

module.exports = ({ strapi }) => ({
  /**
   * Importe la page 'popular' et relie cast/crew
   */
  async importPopular(page = 1) {
    const tmdb = strapi.service("api::movie.tmdb");
    const movies = await tmdb.fetchPopular(page);

    let created = 0;
    let skipped = 0;

    for (const m of movies) {
      // 1) Vérifier si le film est déjà présent
      const existing = await strapi.db.query("api::movie.movie").findOne({
        where: { tmdbId: m.id },
        select: ["id"],
      });
      if (existing) {
        skipped++;
        continue;
      }

      // 2) Récupérer crédits (réalisateur + acteurs)
      const credits = await tmdb.fetchMovieCredits(m.id);
      const director = tmdb.pickDirector(credits.crew);

      // 3) Upsert des acteurs (limiter à N pour la démo)
      const topCast = (credits.cast || []).slice(0, 10);
      const actorIds = [];

      for (const a of topCast) {
        const { firstName, lastName } = tmdb.splitName(a.name || "");

        let actor = await strapi.db.query("api::actor.actor").findOne({
          where: { tmdbId: a.id },
          select: ["id"],
        });

        if (!actor) {
          actor = await strapi.entityService.create("api::actor.actor", {
            data: {
              tmdbId: a.id,
              firstName,
              lastName,
              // birthDate: à compléter via /person/{id} si besoin
            },
          });
        }

        actorIds.push(actor.id);
      }

      // 4) Créer le film avec les relations et la popularité
      await strapi.entityService.create("api::movie.movie", {
        data: {
          tmdbId: m.id,
          title: m.title,
          description: m.overview,
          releaseDate: m.release_date,
          director,
          popularity: m.popularity,
          actors: actorIds,
        },
      });

      created++;
    }

    strapi.log.info(
      `[TMDb Import] Page ${page} → Films créés: ${created}, ignorés: ${skipped}`
    );

    return { page, created, skipped, totalProcessed: movies.length };
  },
});
