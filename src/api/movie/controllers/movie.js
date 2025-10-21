"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

function mediaUrl(m) {
  // renvoie l’URL d’un média Strapi (relative), ou null
  if (!m || (!m.data && !m.url)) return null;
  const f = m.data ? m.data.attributes : m; // selon populate=*
  return f?.url || null;
}

function addPosterAndPeopleFallback(entity) {
  if (!entity?.attributes) return entity;

  const a = entity.attributes;

  // poster normalisé
  const uploaded = mediaUrl(a.poster_picture);
  a.poster = uploaded || a.poster_url || null;

  // acteurs
  if (a.actors?.data) {
    a.actors.data = a.actors.data.map((p) => {
      const pa = p.attributes || {};
      const up = mediaUrl(pa.profil_picture);
      pa.profile = up || pa.profile_url || null;
      p.attributes = pa;
      return p;
    });
  }

  // réalisateurs
  if (a.directors?.data) {
    a.directors.data = a.directors.data.map((p) => {
      const pa = p.attributes || {};
      const up = mediaUrl(pa.profil_picture);
      pa.profile = up || pa.profile_url || null;
      p.attributes = pa;
      return p;
    });
  }

  return entity;
}

module.exports = createCoreController("api::movie.movie", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        poster_picture: true,
        categories: { fields: ["name", "slug"] },
        actors: {
          populate: { profil_picture: true },
          fields: ["name", "firstname", "profile_url"],
        },
        directors: {
          populate: { profil_picture: true },
          fields: ["name", "firstname", "profile_url"],
        },
      },
      sort: ctx.query?.sort || { release_date: "desc" },
    };

    const res = await super.find(ctx);
    res.data = (res.data || []).map(addPosterAndPeopleFallback);
    return res;
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        poster_picture: true,
        categories: { fields: ["name", "slug"] },
        actors: {
          populate: { profil_picture: true },
          fields: ["name", "firstname", "birthdate", "gender", "profile_url"],
        },
        directors: {
          populate: { profil_picture: true },
          fields: ["name", "firstname", "birthdate", "gender", "profile_url"],
        },
      },
    };

    const res = await super.findOne(ctx);
    if (res?.data) res.data = addPosterAndPeopleFallback(res.data);
    return res;
  },
}));
