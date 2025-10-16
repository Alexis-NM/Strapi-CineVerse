"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/tmdb/import/popular",
      handler: "tmdb-import.importPopular",
      config: {
        policies: ["admin::isAuthenticatedAdmin"], // réservé aux admins
      },
    },
  ],
};

// requête curl :

// curl -X POST "http://localhost:1337/api/tmdb/import/popular" \
//   -H "Authorization: Bearer $ADMIN_JWT" \
//   -H "Content-Type: application/json" \
//   -d '{"page":1}'