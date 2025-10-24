import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuSearch, LuCircleUser } from "react-icons/lu";
import { searchContent } from "../api/api";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";
import logoMark from "../assets/cineverse-logo.png";

const NAV_ITEMS = [
  { label: "Movies", to: "/home" },
  { label: "Actors", to: "/actors" },
  { label: "Directors", to: "/filmmakers" },
  { label: "Favorites", to: "/favorites" },
];

const EMPTY_SUGGESTIONS = Object.freeze({
  movies: [],
  actors: [],
  filmmakers: [],
});

function formatPersonName(person) {
  if (!person) return "";
  return [person.firstname, person.name].filter(Boolean).join(" ").trim();
}

function releaseYear(dateString) {
  if (!dateString) return null;
  try {
    return new Date(dateString).getFullYear();
  } catch {
    return null;
  }
}

function sanitizeSelection(item, type) {
  if (!item) return null;
  if (type === "movie") {
    const {
      id,
      title,
      overview,
      description,
      release_date,
      duration_minutes,
      popularity,
      poster,
      poster_url,
      trailer_url,
      cast = [],
      actors = [],
      directors = [],
      categories = [],
    } = item;
    return {
      id,
      title,
      overview,
      description,
      release_date,
      duration_minutes,
      popularity,
      poster,
      poster_url,
      trailer_url,
      cast,
      actors,
      directors,
      categories,
    };
  }

  const {
    id,
    firstname,
    name,
    birthdate,
    biography,
    gender,
    profile_url,
    acted_in = [],
    directed = [],
    is_actor,
    is_filmmaker,
  } = item;

  return {
    id,
    firstname,
    name,
    birthdate,
    biography,
    gender,
    profile_url,
    acted_in,
    directed,
    is_actor,
    is_filmmaker,
  };
}

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(EMPTY_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { logout } = useAuth?.() ?? { logout: null };

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setQuery("");
    setSuggestions(EMPTY_SUGGESTIONS);
    setShowSuggestions(false);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, closeSearch]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions(EMPTY_SUGGESTIONS);
      setShowSuggestions(false);
      setError(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);
    let cancelled = false;

    const handler = setTimeout(() => {
      searchContent(trimmed)
        .then((result) => {
          if (cancelled) return;
          setSuggestions(result);
          setShowSuggestions(true);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("[search]", err);
          setError(err.message || "Recherche indisponible");
          setSuggestions(EMPTY_SUGGESTIONS);
          setShowSuggestions(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [query, isSearchOpen]);

  const hasResults =
    suggestions.movies.length +
      suggestions.actors.length +
      suggestions.filmmakers.length >
    0;

  const sections = useMemo(
    () => [
      {
        key: "movies",
        title: "Movies",
        type: "movie",
        items: suggestions.movies,
      },
      {
        key: "actors",
        title: "Actors",
        type: "actor",
        items: suggestions.actors,
      },
      {
        key: "filmmakers",
        title: "Directors",
        type: "filmmaker",
        items: suggestions.filmmakers,
      },
    ],
    [suggestions]
  );

  const handleToggleSearch = () => {
    if (isSearchOpen) closeSearch();
    else setIsSearchOpen(true);
  };

  const handleSelectSuggestion = (type, item) => {
    if (!item) return;
    const sanitized = sanitizeSelection(item, type);
    closeSearch();
    const targetRoute =
      type === "movie" ? "/home" : type === "actor" ? "/actors" : "/filmmakers";

    navigate(targetRoute, {
      state: { highlight: { type, item: sanitized } },
    });
  };

  const handleConfirmLogout = () => {
    if (typeof logout === "function") {
      logout();
    } else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-[#0c0c0c] text-white border-t border-[#1b68d2]">
      <div className="relative w-full px-5 sm:px-8 py-5 flex items-center justify-center z-10">
        {/* Logo */}
        <div className="absolute left-5 sm:left-8 flex items-center gap-3.5 min-w-[190px] flex-shrink-0">
          <img
            src={logoMark}
            alt="Cineverse logo"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover transform scale-[1.2] sm:scale-[1.3] drop-shadow-[0_0_18px_rgba(255,42,42,0.5)]"
          />
          <span className="text-[22px] font-semibold tracking-[0.35em] uppercase">
            Cineverse
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1.5 bg-black/40 border-2 border-white/15 rounded-[26px] p-1.5 shadow-[inset_0_3px_12px_rgba(0,0,0,0.45)] overflow-x-auto whitespace-nowrap">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white shadow-[0_5px_14px_rgba(0,0,0,0.36)]"
                    : "text-gray-300 hover:text-white/85",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone recherche + icône user */}
        <div className="absolute right-5 sm:right-8 flex items-center gap-6 text-[22px] min-w-[110px] justify-end flex-shrink-0 z-40">
          <div className="relative flex items-center z-50" ref={searchRef}>
            <button
              type="button"
              onClick={handleToggleSearch}
              className="text-gray-300 hover:text-white transition-colors relative z-50"
              aria-label={
                isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"
              }
              title={isSearchOpen ? "Close search" : "Open search"}
            >
              <LuSearch />
            </button>

            {/* Input */}
            <div
              className={`absolute right-[2.9rem] top-1/2 -translate-y-1/2 bg-[#141414] border-2 border-white/20 rounded-2xl overflow-hidden transition-all duration-300 origin-right shadow-xl z-50 ${
                isSearchOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => {
                  if (query.trim().length >= 2) setShowSuggestions(true);
                }}
                placeholder="Rechercher un film, un acteur, un réalisateur..."
                className="w-72 bg-transparent text-sm text-white placeholder:text-gray-500 px-4 py-2.5 outline-none"
                aria-label="Recherche"
              />
            </div>

            {/* Résultats */}
            <div
              className={`absolute right-[2.9rem] top-full mt-3.5 w-[330px] bg-[#101010] border border-white/10 rounded-3xl shadow-2xl transition-all duration-200 origin-top-right z-[9999] ${
                isSearchOpen && (showSuggestions || loading || error)
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <div className="max-h-80 overflow-y-auto px-2 py-3">
                {loading ? (
                  <p className="text-sm text-gray-400 px-3 py-2">
                    Recherche en cours…
                  </p>
                ) : error ? (
                  <p className="text-sm text-red-400 px-3 py-2">{error}</p>
                ) : hasResults ? (
                  sections
                    .filter((s) => s.items.length > 0)
                    .map((section) => (
                      <div key={section.key} className="px-1 py-1">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 px-3 pb-1">
                          {section.title}
                        </p>
                        {section.items.map((item) => {
                          const key = `${section.type}-${item.id}`;
                          const imageSrc =
                            section.type === "movie"
                              ? item.poster || item.poster_url
                              : item.profile_url;
                          const displayName =
                            section.type === "movie"
                              ? item.title
                              : formatPersonName(item);
                          const meta =
                            section.type === "movie"
                              ? ["Movie", releaseYear(item.release_date)]
                                  .filter(Boolean)
                                  .join(" • ")
                              : section.type === "actor"
                                ? "Actor"
                                : "Director";

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() =>
                                handleSelectSuggestion(section.type, item)
                              }
                              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center text-xs text-gray-400 uppercase">
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  displayName.slice(0, 2) || "?"
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">
                                  {displayName || "Sans titre"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {meta}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))
                ) : query.trim().length >= 2 ? (
                  <p className="text-sm text-gray-400 px-3 py-2">
                    Aucun résultat trouvé.
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 px-3 py-2">
                    Tapez au moins deux caractères.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* User */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <LuCircleUser className="text-[34px]" />
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log out"
        message="Are you sure you want to log out?"
        actions={[
          { label: "Cancel", onClick: () => setShowLogoutModal(false) },
          { label: "Log out", onClick: handleConfirmLogout, variant: "danger" },
        ]}
      />
    </header>
  );
}

export default Header;
