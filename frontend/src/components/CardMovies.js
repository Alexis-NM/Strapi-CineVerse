import React from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import { AiOutlineEye } from 'react-icons/ai';

function formatDuration(minutes) {
  if (!minutes) return 'N/A';
  const m = Number(minutes);
  if (Number.isNaN(m)) return `${minutes} min`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h${mm.toString().padStart(2, '0')}` : `${mm}m`;
}

function formatViews(n) {
  const num = Number(n || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

export default function CardMovies({ movie, onClick }) {
  const poster = movie.poster || movie.poster_url || '';
  const title = movie.title || 'Untitled';
  const duration = movie.duration_minutes ? formatDuration(movie.duration_minutes) : null;
  const views = movie.popularity ? formatViews(movie.popularity) : '0';

  return (
    <article
      onClick={() => { console.log('Card clicked:', movie.id || movie.title); onClick && onClick(movie); }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick(movie)}
      className="relative rounded-2xl shadow-lg overflow-hidden bg-[#1f1f1f] px-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <div className="bg-[#1f1f1f] p-0">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-64 md:h-72 object-cover block rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-64 md:h-72 bg-[#2a2a2a] flex items-center justify-center text-gray-400 rounded-t-2xl">No image</div>
        )}
      </div>

      <div className="bg-[#1f1f1f] px-4 md:px-5 py-4 rounded-b-2xl">
        <div className="flex flex-col gap-3">
          <h3 className="text-white text-sm md:text-base font-semibold text-left truncate">{title}</h3>

          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-[#2a2a2a]/70 border border-black/40 px-3 py-2 rounded-full">
              <HiOutlineClock className="text-gray-200 text-lg" />
              <span className="text-xs md:text-sm text-gray-200">{duration || 'N/A'}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#2a2a2a]/70 border border-black/40 px-3 py-2 rounded-full">
              <AiOutlineEye className="text-gray-200 text-lg" />
              <span className="text-xs md:text-sm text-gray-200">{views}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
