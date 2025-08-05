import React from "react";
import { useMusic } from "@/context/MusicContext";
import { Play, Pause } from "lucide-react";

const Liked = () => {
  const { likedTracks, currentTrack, isPlaying, playTrack, pauseTrack } =
    useMusic();

  const handlePlayTrack = (track: any) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liked Tracks</h1>
      {likedTracks.length > 0 ? (
        <ul className="space-y-4">
          {likedTracks.map((track) => (
            <li key={track.id} className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={track.image || "/assets/default-cover.jpg"}
                  alt={track.name}
                  className="w-16 h-16 rounded"
                />
                <button
                  className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow"
                  onClick={() => handlePlayTrack(track)}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </div>

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
