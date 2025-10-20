"use strict";
const axios = require("axios");

const api = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: process.env.TMDB_LANG,
  },
  timeout: 10000,
});

module.exports = () => ({
  async fetchPopular(page = 1) {
    const { data } = await api.get("/movie/popular", { params: { page } });
    return data.results;
  },
  async fetchMovieCredits(movieId) {
    const { data } = await api.get(`/movie/${movieId}/credits`);
    return data;
  },
  pickDirector(crew = []) {
    const d = crew.find((c) => c.job === "Director");
    return d ? d.name : null;
  },
  splitName(fullName = "") {
    const parts = fullName.split(" ");
    return {
      firstName: parts.slice(0, -1).join(" ") || fullName,
      lastName: parts.slice(-1).join(" ") || "",
    };
  },
});
