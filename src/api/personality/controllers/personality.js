"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::personality.personality", () => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        profil_picture: true,
        acted_in: {
          fields: ["id", "title", "release_date"],
          populate: { poster_picture: true },
        },
        directed: {
          fields: ["id", "title", "release_date"],
          populate: { poster_picture: true },
        },
      },
      sort: ctx.query?.sort || { name: "asc" },
    };
    return await super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        profil_picture: true,
        acted_in: {
          fields: ["id", "title", "release_date"],
          populate: { poster_picture: true },
        },
        directed: {
          fields: ["id", "title", "release_date"],
          populate: { poster_picture: true },
        },
      },
    };
    return await super.findOne(ctx);
  },
}));
