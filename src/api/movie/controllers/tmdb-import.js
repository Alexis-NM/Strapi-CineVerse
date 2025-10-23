"use strict";

module.exports = {
  async importPopular(ctx) {
    try {
      const page = Number(ctx.request.body?.page || 1);
      const res = await strapi
        .service("api::movie.tmdb-import")
        .importPopular(page);

      ctx.body = { imported: res };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  },
};
