import React, { useState } from "react";

const TmdbImportButton = () => {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  // Récupère la variable exposée par Strapi au build
  const token = process.env.STRAPI_ADMIN_TMDB_IMPORT;

  const runImport = async () => {
    setLoading(true);
    setOkMsg(null);
    setErrMsg(null);

    try {
      const res = await fetch("/api/tmdb/import/popular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const json = await res.json();
      setOkMsg(`Import OK (${json?.imported ?? "?"})`);
    } catch (e) {
      setErrMsg(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    { style: { display: "grid", gap: 8 } },
    React.createElement(
      "button",
      {
        onClick: runImport,
        disabled: loading,
        style: {
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
        },
      },
      loading ? "Import en cours…" : "Importer les populaires TMDB"
    ),
    okMsg &&
      React.createElement("div", { style: { color: "seagreen" } }, okMsg),
    errMsg &&
      React.createElement(
        "div",
        { style: { color: "crimson" } },
        `Erreur : ${errMsg}`
      )
  );
};

export default TmdbImportButton;
