import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

interface Track {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  image?: string;
  duration?: number;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  likedTracks: Track[];
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleLike: (track: Track) => void;
  isTrackLiked: (trackId: string) => boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(50);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: Track) => {
    // Stop current track if playing
    if (audioRef.current) {
      audioRef.current.pause();
      // Remove existing event listeners
      const currentAudio = audioRef.current;
      currentAudio.removeEventListener("loadedmetadata", updateDuration);
      currentAudio.removeEventListener("timeupdate", updateTime);
      currentAudio.removeEventListener("ended", handleTrackEnd);
    }

    // Create new audio element
    const audio = new Audio(track.audio);
    audioRef.current = audio;

    // Set volume
    audio.volume = volume / 100;

    // Add event listeners
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleTrackEnd);

    // Play the track
    audio.play().catch(console.error);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const updateDuration = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      pauseTrack();
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleLike = (track: Track) => {
    setLikedTracks((prev) => {
      const isAlreadyLiked = prev.some(
        (likedTrack) => likedTrack.id === track.id
      );
      if (isAlreadyLiked) {
        return prev.filter((likedTrack) => likedTrack.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  const isTrackLiked = (trackId: string): boolean => {
    return likedTracks.some((track) => track.id === trackId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        likedTracks,
        playTrack,
        pauseTrack,
        togglePlayPause,
        setVolume,
        seekTo,
        toggleLike,
        isTrackLiked,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
