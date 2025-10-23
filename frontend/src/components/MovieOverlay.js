import React, { useEffect, useState, useRef } from "react";
import { HiOutlineClock } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";
import { HiX } from "react-icons/hi";

export default function MovieOverlay({ movie, onClose }) {
  const [visible, setVisible] = useState(false);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (movie) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [movie]);

  useEffect(() => {
    return undefined;
  }, [movie]);

  if (!movie) return null;

  // --- Poster & Banner fallbacks ---
  const poster = movie.poster || movie.poster_url || "";

  const banner =
    movie.banner ||
    movie.banner_url ||
    (Array.isArray(movie.banners) && movie.banners.length > 0
      ? movie.banners[0]
      : null) ||
    null;

  // Image principale de l'entête : bannière > poster
  const heroImage = banner || poster;

  const title = movie.title || "Untitled";
  const duration = movie.duration_minutes
    ? `${Math.floor(movie.duration_minutes / 60)}h${(movie.duration_minutes % 60).toString().padStart(2, "0")}`
    : "N/A";
  const views = movie.popularity ? movie.popularity : 0;

  function handleClose() {
    setVisible(false);
    setPlayingTrailer(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  }

  function getYouTubeEmbedUrl(input) {
    if (!input) return null;
    try {
      const url = new URL(input);
      if (url.hostname.includes("youtu.be"))
        return `https://www.youtube.com/embed/${url.pathname.slice(1)}?autoplay=1`;
      if (url.hostname.includes("youtube.com")) {
        const id = url.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
    } catch (e) {
      // renvoie l'input direct comme id
      return `https://www.youtube.com/embed/${input}?autoplay=1`;
    }
    return null;
  }

  const trailerSrc = getYouTubeEmbedUrl(
    movie.trailer_url || movie.trailer || movie.youtubeId || movie.youtube_id
  );

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ${visible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="bg-[#0b0b0b] rounded-2xl overflow-hidden shadow-2xl mt-6">
        <div className="relative w-full h-80 md:h-[420px] bg-black">
          {playingTrailer ? (
            trailerSrc ? (
              <iframe
                title={`trailer-${title}`}
                src={trailerSrc}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                No trailer available
              </div>
            )
          ) : heroImage ? (
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          {/* overlay gradient pour lisibilité du titre/boutons sur les bannières lumineuses */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <button
            aria-label="Close"
            onClick={handleClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-md"
          >
            <HiX className="w-6 h-6" />
          </button>

          {/* titre centré au dessus des boutons */}
          <div className="absolute left-1/2 bottom-20 md:bottom-24 transform -translate-x-1/2 text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
          </div>

          {/* boutons centrés en bas de l'image */}
          <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2 flex items-center gap-3">
            <button
              aria-label="Watch trailer"
              onClick={() => setPlayingTrailer(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md shadow disabled:opacity-50"
              disabled={!trailerSrc}
            >
              Watch Trailer
            </button>
            <button
              aria-label="Favorite"
              className="bg-transparent border border-white/20 text-white px-3 py-2 rounded-md"
            >
              ♡
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#141414] p-4 rounded-md">
                <h3 className="text-sm text-gray-300 font-semibold">
                  Description
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {movie.overview ||
                    movie.description ||
                    "No description available."}
                </p>
              </div>
              <div className="bg-[#141414] p-4 rounded-md">
                <h3 className="text-sm text-gray-300 font-semibold">Cast</h3>
                <div className="flex gap-3 mt-3 overflow-x-auto">
                  {(movie.cast || []).length > 0 ? (
                    (movie.cast || []).map((c, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden"
                        title={c.name}
                      >
                        {c.photo ? (
                          <img
                            src={c.photo}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No cast data</div>
                  )}
                </div>
              </div>
            </div>

            {/* Optionnel : miniatures si plusieurs bannières sont disponibles */}
            {Array.isArray(movie.banners) &&
            movie.banners.length > 1 &&
            !playingTrailer ? (
              <div className="bg-[#141414] p-4 rounded-md">
                <h3 className="text-sm text-gray-300 font-semibold">Images</h3>
                <div className="flex gap-3 mt-3 overflow-x-auto">
                  {movie.banners.map((b, i) => (
                    <button
                      key={i}
                      className="shrink-0 w-28 h-16 rounded overflow-hidden bg-gray-700 hover:opacity-90"
                      onClick={() => {
                        // Remplacer l’image héro par cette miniature choisie
                        // (simple set en modifiant playingTrailer si besoin)
                        setPlayingTrailer(false);
                        // Astuce légère : remonter « banner » temporairement côté objet si tu veux
                        // Ici, on ne mute pas movie. On préfère un état local pour l’image héro.
                        // Pour rester simple, on replace via image de fond (ci-dessous alternative).
                        const img = new Image();
                        img.src = b;
                        img.onload = () => {
                          // Force un repaint via un petit toggle
                          setVisible(false);
                          requestAnimationFrame(() => setVisible(true));
                        };
                      }}
                    >
                      <img
                        src={b}
                        alt={`banner-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="bg-[#141414] p-4 rounded-md">
              <h4 className="text-sm text-gray-300">Released</h4>
              <p className="text-gray-400 text-sm mt-2">
                {movie.release_date || movie.publishedAt || "Unknown"}
              </p>
            </div>

            <div className="bg-[#141414] p-4 rounded-md">
              <h4 className="text-sm text-gray-300">Runtime</h4>
              <p className="text-gray-400 text-sm mt-2">{duration}</p>
            </div>

            <div className="bg-[#141414] p-4 rounded-md">
              <h4 className="text-sm text-gray-300">Views</h4>
              <p className="text-gray-400 text-sm mt-2">{views}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
