import { FiSkipBack, FiSkipForward } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    const currentScrollY = window.scrollY;
    onPageChange(page);
    setTimeout(() => window.scrollTo(0, currentScrollY), 0);
  };

  const pages = [];
  const delta = 2; 

  const start = Math.max(2, currentPage - delta);
  const end = Math.min(totalPages - 1, currentPage + delta);

  if (totalPages > 1) {
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-2"
      >
        <FiSkipBack className="inline" />
      </button>
    );

    if (currentPage > delta + 2) pages.push(<span key="start-ellipsis">...</span>);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i ? "bg-red-600 font-bold" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - delta - 1) pages.push(<span key="end-ellipsis">...</span>);

    pages.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        <FiSkipForward className="inline" />
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center justify-center mt-8 mb-8">
      {pages}
    </div>
  );
}
