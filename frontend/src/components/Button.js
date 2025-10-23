export default function Button({ children, disabled, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`"bg-[#e50000] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        ${
          disabled
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-[#e50000] text-white hover:bg-[#b30000]"
        }`
      }
    >
      {children}
    </button>
  );
}
