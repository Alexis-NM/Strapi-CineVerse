export default function ActorCard({ actor }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:scale-105 transition-transform duration-300 cursor-pointer w-[420px] h-[220px]">
      <img
        src={
          actor.profile_url ||
          "https://via.placeholder.com/150x200?text=No+Image"
        }
        alt={`${actor.firstname} ${actor.name}`}
        className="w-32 h-44 object-cover rounded-xl shadow-lg"
      />

      <div className="flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-white mb-2">
          {actor.firstname} {actor.name}
        </h3>
      </div>
    </div>
  );
}
