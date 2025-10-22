export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#e50000] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
    >
      {children}
    </button>
  );
}
