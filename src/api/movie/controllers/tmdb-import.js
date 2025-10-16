"use strict";

module.exports = {
  async importPopular(ctx) {
    const page = Number(ctx.request.body?.page || 1);
    const res = await strapi
      .service("api::movie.tmdb-import")
      .importPopular(page);
    ctx.body = res;
  },
};
