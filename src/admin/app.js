import React from "react";

const DotIcon = () =>
  React.createElement("span", {
    style: {
      display: "inline-block",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "currentColor",
    },
  });

const App = {
  register(app) {
    // Lien de menu -> IMPORTANT: Component est un LOADER asynchrone qui retourne un import()
    if (typeof app.addMenuLink === "function") {
      app.addMenuLink({
        to: "/tmdb-tools",
        intlLabel: { id: "tmdb.tools", defaultMessage: "TMDB Import" },
        icon: DotIcon, // ou supprime cette ligne si tu préfères sans icône
        Component: async () => {
          // Retourne le module importé (Strapi s'occupe de prendre .default)
          return import("./pages/TmdbToolsPage.js");
        },
        permissions: [], // on garde le contrôle d'accès côté API via la policy
        exact: true,
      });
    }

    // (facultatif) — retire tout le reste pour éliminer les interférences le temps de valider
    // Tu pourras remettre les widgets/injections plus tard si tu veux.
  },

  bootstrap() {},
  async registerTrads() {
    return {};
  },
};

export default App;
