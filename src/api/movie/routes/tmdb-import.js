"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/tmdb/import/popular",
      handler: "tmdb-import.importPopular",
    },
  ],
};
