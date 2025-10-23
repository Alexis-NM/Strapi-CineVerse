import React from "react";
import TmdbImportButton from "../components/TmdbImportButton.js";

const TmdbToolsPage = () =>
  React.createElement(
    "div",
    { style: { padding: 24, display: "grid", gap: 16 } },
    React.createElement("h2", null, "TMDB Import"),
    React.createElement(
      "p",
      null,
      "Clique sur le bouton ci-dessous pour lancer l’import des données TMDB."
    ),
    React.createElement(TmdbImportButton, null)
  );

export default TmdbToolsPage;
