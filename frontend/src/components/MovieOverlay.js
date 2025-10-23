import React, { useEffect, useState, useRef } from "react";
import { HiOutlineClock } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";
import { HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { fetchPersonById } from "../api/api";

export default function MovieOverlay({ movie, onClose }) {
  const [visible, setVisible] = useState(false);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const [personLoading, setPersonLoading] = useState(false);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

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
    ? `${Math.floor(movie.duration_minutes / 60)}h${(movie.duration_minutes % 60)
        .toString()
        .padStart(2, "0")}`
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

  // ---- Gestion des personnes (acteurs/réalisateurs) ----
  function normalizeFallbackPerson(person) {
    if (!person) return null;
    let fallbackFirstname = person.firstname ?? "";
    let fallbackName = person.name ?? "";
    if (!fallbackFirstname && fallbackName) {
      const parts = fallbackName.split(" ");
      if (parts.length > 1) {
        fallbackFirstname = parts.shift();
        fallbackName = parts.join(" ");
      }
    }
    return {
      id: person.id,
      firstname: fallbackFirstname,
      name: fallbackName,
      biography: person.biography || "",
      birthdate: person.birthdate || null,
      gender: person.gender || "unspecified",
      profile_url: person.photo || person.profile_url || null,
      acted_in: person.acted_in || [],
      directed: person.directed || [],
    };
  }

  async function handlePersonClick(personData, role) {
    if (!personData?.id) return;
    const fallback = normalizeFallbackPerson(personData);
    setPersonLoading(true);
    try {
      const data = await fetchPersonById(personData.id);
      const payload = data || fallback;
      const type = role === "director" ? "filmmaker" : "actor";
      const targetRoute = role === "director" ? "/filmmakers" : "/actors";
      navigate(targetRoute, {
        state: {
          highlight: {
            type,
            item: payload,
          },
        },
      });
      handleClose();
    } catch (err) {
      console.error("Failed to load person", err);
      const type = role === "director" ? "filmmaker" : "actor";
      const targetRoute = role === "director" ? "/filmmakers" : "/actors";
      navigate(targetRoute, {
        state: {
          highlight: {
            type,
            item: fallback,
          },
        },
      });
      handleClose();
    } finally {
      setPersonLoading(false);
    }
  }

  function formatPersonDisplay(person) {
    if (!person) return "Unknown";
    const parts = [person.firstname, person.name].filter(Boolean);
    if (parts.length > 0) return parts.join(" ");
    return person.name || "Unknown";
  }

  const castMembers =
    Array.isArray(movie.cast) && movie.cast.length > 0
      ? movie.cast
      : Array.isArray(movie.actors)
      ? movie.actors
      : [];

  const directorMembers = Array.isArray(movie.directors) ? movie.directors : [];

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
        visible
          ? "max-h-[1500px] lg:max-h-[1800px] opacity-100"
          : "max-h-0 opacity-0"
      }`}
    >
      <div className="bg-[#0b0b0b] rounded-2xl overflow-hidden shadow-2xl mt-6 max-w-[1000px] xl:max-w-[1080px] mx-auto">
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
            <img src={heroImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          {/* overlay gradient pour lisibilité */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <button
            aria-label="Close"
            onClick={handleClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-md"
          >
            <HiX className="w-6 h-6" />
          </button>

          {/* Titre */}
          <div className="absolute left-1/2 bottom-20 md:bottom-24 transform -translate-x-1/2 text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
          </div>

          {/* Boutons */}
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

        <div className="px-6 py-6 lg:px-10 lg:py-10">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
            {/* Colonne principale */}
            <div className="space-y-6 lg:max-w-[660px] xl:max-w-[700px] w-full">
              <section className="bg-[#141414] p-4 lg:p-5 rounded-xl">
                <h3 className="text-sm text-gray-300 font-semibold uppercase tracking-[0.2em]">
                  Description
                </h3>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  {movie.overview || movie.description || "No description available."}
                </p>
              </section>

              <section className="bg-[#141414] p-4 lg:p-5 rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-gray-300 font-semibold uppercase tracking-[0.2em]">
                    Cast
                  </h3>
                  {personLoading ? (
                    <span className="text-xs text-gray-500">Opening…</span>
                  ) : null}
                </div>
                <div className="flex gap-4 mt-4 overflow-x-auto pb-1 custom-scroll">
                  {castMembers.length > 0 ? (
                    castMembers.map((person) => (
                      <button
                        key={person.id || person.name}
                        type="button"
                        onClick={() => handlePersonClick(person, "actor")}
                        disabled={!person.id}
                        className="group flex flex-col items-center w-[84px] transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-default"
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden ring-2 ring-transparent group-hover:ring-red-500 transition">
                          {person.photo || person.profile_url ? (
                            <img
                              src={person.photo || person.profile_url}
                              alt={formatPersonDisplay(person)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                              N/A
                            </div>
                          )}
                        </div>
                        <span className="mt-2 text-xs text-gray-300 text-center leading-tight">
                          {formatPersonDisplay(person)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No cast data</p>
                  )}
                </div>
              </section>

              {directorMembers.length > 0 ? (
                <section className="bg-[#141414] p-4 lg:p-5 rounded-xl">
                  <h3 className="text-sm text-gray-300 font-semibold uppercase tracking-[0.2em]">
                    Directors
                  </h3>
                  <div className="flex gap-4 mt-4 overflow-x-auto pb-1 custom-scroll">
                    {directorMembers.map((person) => (
                      <button
                        key={person.id || person.name}
                        type="button"
                        onClick={() => handlePersonClick(person, "director")}
                        disabled={!person.id}
                        className="group flex flex-col items-center w-[84px] transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-default"
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden ring-2 ring-transparent group-hover:ring-red-500 transition">
                          {person.profile_url ? (
                            <img
                              src={person.profile_url}
                              alt={formatPersonDisplay(person)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                              N/A
                            </div>
                          )}
                        </div>
                        <span className="mt-2 text-xs text-gray-300 text-center leading-tight">
                          {formatPersonDisplay(person)}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Miniatures si plusieurs bannières */}
              {Array.isArray(movie.banners) &&
              movie.banners.length > 1 &&
              !playingTrailer ? (
                <div className="bg-[#141414] p-4 rounded-xl">
                  <h3 className="text-sm text-gray-300 font-semibold uppercase tracking-[0.2em]">
                    Images
                  </h3>
                  <div className="flex gap-3 mt-3 overflow-x-auto">
                    {movie.banners.map((b, i) => (
                      <button
                        key={i}
                        className="shrink-0 w-28 h-16 rounded overflow-hidden bg-gray-700 hover:opacity-90"
                        onClick={() => {
                          // Simple rafraîchissement visuel
                          setPlayingTrailer(false);
                          const img = new Image();
                          img.src = b;
                          img.onload = () => {
                            setVisible(false);
                            requestAnimationFrame(() => setVisible(true));
                          };
                        }}
                      >
                        <img src={b} alt={`banner-${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Aside */}
            <aside className="space-y-4 lg:w-[260px] xl:w-[300px] flex-shrink-0">
              <div className="bg-[#141414] p-4 rounded-xl">
                <h4 className="text-sm text-gray-300 uppercase tracking-[0.2em]">
                  Released
                </h4>
                <p className="text-gray-400 text-sm mt-3">
                  {movie.release_date || movie.publishedAt || "Unknown"}
                </p>
              </div>

              <div className="bg-[#141414] p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#1f1f1f] text-gray-300">
                  <HiOutlineClock />
                </div>
                <div>
                  <h4 className="text-sm text-gray-300 uppercase tracking-[0.2em]">
                    Runtime
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">{duration}</p>
                </div>
              </div>

              <div className="bg-[#141414] p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#1f1f1f] text-gray-300">
                  <AiOutlineEye />
                </div>
                <div>
                  <h4 className="text-sm text-gray-300 uppercase tracking-[0.2em]">
                    Popularity
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">{views}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}