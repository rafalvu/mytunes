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
      playTrack(track, likedTracks);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liked Tracks</h1>
      {likedTracks.length > 0 ? (
        <ul className="space-y-4">
          {likedTracks.map((track) => (
            <li key={track.id} className="flex items-center space-x-4">
              <div className="relative group">
                <img
                  src={track.image || "/assets/default-cover.jpg"}
                  alt={track.name}
                  className="w-16 h-16 rounded object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="bg-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg"
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="w-4 h-4 text-black" />
                    ) : (
                      <Play className="w-4 h-4 text-black" />
                    )}
                  </button>
                </div>
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
