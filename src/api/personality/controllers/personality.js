"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

function mediaUrl(m) {
  if (!m || (!m.data && !m.url)) return null;
  const f = m.data ? m.data.attributes : m;
  return f?.url || null;
}

function addProfileAndMoviePosterFallback(entity) {
  if (!entity?.attributes) return entity;
  const a = entity.attributes;

  // profile normalisé
  const uploaded = mediaUrl(a.profil_picture);
  a.profile = uploaded || a.profile_url || null;

  // acted_in
  if (a.acted_in?.data) {
    a.acted_in.data = a.acted_in.data.map((m) => {
      const ma = m.attributes || {};
      const up = mediaUrl(ma.poster_picture);
      ma.poster = up || ma.poster_url || null;
      m.attributes = ma;
      return m;
    });
  }

  // directed
  if (a.directed?.data) {
    a.directed.data = a.directed.data.map((m) => {
      const ma = m.attributes || {};
      const up = mediaUrl(ma.poster_picture);
      ma.poster = up || ma.poster_url || null;
      m.attributes = ma;
      return m;
    });
  }

  return entity;
}

module.exports = createCoreController(
  "api::personality.personality",
  ({ strapi }) => ({
    async find(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: {
          profil_picture: true,
          acted_in: {
            populate: { poster_picture: true },
            fields: ["title", "release_date", "poster_url"],
          },
          directed: {
            populate: { poster_picture: true },
            fields: ["title", "release_date", "poster_url"],
          },
        },
        sort: ctx.query?.sort || { name: "asc" },
      };

      const res = await super.find(ctx);
      res.data = (res.data || []).map(addProfileAndMoviePosterFallback);
      return res;
    },

    async findOne(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: {
          profil_picture: true,
          acted_in: {
            populate: { poster_picture: true },
            fields: ["title", "release_date", "poster_url"],
          },
          directed: {
            populate: { poster_picture: true },
            fields: ["title", "release_date", "poster_url"],
          },
        },
      };

      const res = await super.findOne(ctx);
      if (res?.data) res.data = addProfileAndMoviePosterFallback(res.data);
      return res;
    },
  })
);
