"use strict";
const axios = require("axios");

const api = axios.create({
  baseURL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: process.env.TMDB_LANG || "fr-FR",
  },
  timeout: 15000,
});

const IMG_BASE = process.env.TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";

module.exports = () => ({
  async fetchPopular(page = 1) {
    const { data } = await api.get("/movie/popular", { params: { page } });
    return data.results;
  },

  async fetchMovieCredits(movieId) {
    const { data } = await api.get(`/movie/${movieId}/credits`);
    return data;
  },

  async fetchMovieDetails(movieId) {
    const { data } = await api.get(`/movie/${movieId}`);
    return data; // contient runtime, genres, poster_path, etc.
  },

  async fetchMovieVideos(movieId) {
    const { data } = await api.get(`/movie/${movieId}/videos`);
    return data.results || [];
  },

  async fetchPersonDetails(personId) {
    const { data } = await api.get(`/person/${personId}`);
    return data; // biography, birthday, gender, profile_path...
  },

  pickDirector(crew = []) {
    return crew.filter((c) => c.job === "Director");
  },

  pickBestTrailer(videos = []) {
    // on préfère un trailer YouTube officiel
    const candidates = videos.filter(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );
    return (
      candidates.find((v) => v.official) ||
      candidates.find((v) =>
        (v.name || "").toLowerCase().includes("official")
      ) ||
      candidates[0] ||
      null
    );
  },

  imageUrl(path, size = "original") {
    if (!path) return null;
    // size: "w500", "w780", "original"…
    return `${IMG_BASE}/${size}${path}`;
  },

  splitName(fullName = "") {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: "", lastName: parts[0] };
    return {
      firstName: parts.slice(0, -1).join(" "),
      lastName: parts.slice(-1).join(" "),
    };
  },
});
