"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::movie.movie", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        poster_picture: true, // media au 1er niveau
        categories: { fields: ["id", "name", "slug"] },
        actors: {
          fields: ["id", "name", "firstname"],
          populate: { profil_picture: true }, // ✅ media imbriqué
        },
        directors: {
          fields: ["id", "name", "firstname"],
          populate: { profil_picture: true }, // ✅ media imbriqué
        },
      },
      sort: ctx.query?.sort || { release_date: "desc" },
    };
    return await super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        poster_picture: true,
        categories: { fields: ["id", "name", "slug"] },
        actors: {
          fields: ["id", "name", "firstname", "birthdate", "gender"],
          populate: { profil_picture: true },
        },
        directors: {
          fields: ["id", "name", "firstname", "birthdate", "gender"],
          populate: { profil_picture: true }, 
        },
      },
    };
    return await super.findOne(ctx);
  },
}));
