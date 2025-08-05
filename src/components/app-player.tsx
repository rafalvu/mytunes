import {
  Heart,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/context/MusicContext";

const AppPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    setVolume,
    seekTo,
    toggleLike,
    isTrackLiked,
  } = useMusic();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
  };

  const handleProgressChange = (newValue: number[]) => {
    const newTime = (newValue[0] / 100) * duration;
    seekTo(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleLike = () => {
    if (currentTrack) {
      toggleLike(currentTrack);
      console.log(
        `${isTrackLiked(currentTrack.id) ? "Unliked" : "Liked"} track:`,
        currentTrack.name
      );
    }
  };

  const isLiked = currentTrack ? isTrackLiked(currentTrack.id) : false;

  const controls = [
    {
      id: "back",
      icon: SkipBack,
      onClick: () => console.log("Previous track"),
    },
    {
      id: "playPause",
      icon: isPlaying ? Pause : Play,
      onClick: togglePlayPause,
    },
    {
      id: "forward",
      icon: SkipForward,
      onClick: () => console.log("Next track"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-white z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
          {currentTrack?.image ? (
            <img
              src={currentTrack.image}
              alt={currentTrack.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              🎵
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium">
            {currentTrack?.name || "No track selected"}
          </div>
          <div className="text-xs text-gray-400">
            {currentTrack?.artist_name || "Unknown artist"}
          </div>
        </div>
        <button
          className={`p-2 rounded transition-colors ${
            isLiked
              ? "bg-white text-gray-900 hover:bg-gray-100"
              : "hover:bg-gray-800 text-white"
          }`}
          onClick={handleLike}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Play Controls */}
      <div className="flex items-center gap-4">
        {controls.map((control) => (
          <button
            key={control.id}
            onClick={control.onClick}
            className="p-2 rounded hover:bg-gray-800 transition-colors"
            disabled={!currentTrack && control.id === "playPause"}
          >
            <control.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="flex-1 max-w-md mx-8">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleProgressChange}
          max={100}
          step={1}
          className="w-full"
          disabled={!currentTrack}
        />
      </div>

      {/* Time & Volume */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="text-xs text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default AppPlayer;
