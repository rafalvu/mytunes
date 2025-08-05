import React from "react";
import { useMusic } from "@/context/MusicContext";

const Liked = () => {
  const { likedTracks } = useMusic();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liked Tracks</h1>
      {likedTracks.length > 0 ? (
        <ul className="space-y-4">
          {likedTracks.map((track) => (
            <li key={track.id} className="flex items-center space-x-4">
              <img
                src={track.image || "/assets/default-cover.jpg"}
                alt={track.name}
                className="w-16 h-16 rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{track.name}</h2>
                <p className="text-sm text-gray-600">{track.artist_name}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No liked tracks yet.</p>
      )}
    </div>
  );
};

export default Liked;
