import React, { useState, useEffect } from "react";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppPlayer from "@/components/app-player";
import { Play, Pause } from "lucide-react";

// Import page components
import Playlists from "@/pages/playlists";
import Liked from "@/pages/liked";
import Settings from "@/pages/settings";
import { jamendoAPI } from "@/data/api";
import { MusicProvider, useMusic } from "@/context/MusicContext";

interface Track {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  image?: string;
  album_name?: string;
  duration?: number;
}

// Home page component
function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useMusic();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const data = await jamendoAPI.getPopularTracks(8);
        setTracks(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch tracks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">MyTunes</h1>
        <p>Loading popular tracks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">MyTunes</h1>
        <p className="text-red-500">Error loading tracks: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">MyTunes</h1>
      <p className="text-gray-700">Trending Today</p>
      <div className="mt-6">
        <div className="grid grid-cols-4 gap-4">
          {tracks.slice(0, 8).map((track) => (
            <div
              key={track.id}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
                {track.image ? (
                  <img
                    src={track.image}
                    alt={track.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    🎵
                  </div>
                )}
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="bg-white rounded-full p-3 hover:scale-110 transition-transform"
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="w-6 h-6 text-black" />
                    ) : (
                      <Play className="w-6 h-6 text-black" />
                    )}
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-sm truncate mb-1">
                {track.name}
              </h3>
              <p className="text-gray-600 text-xs truncate mb-3">
                {track.artist_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Search page component
function Search() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <p className="text-gray-700">Search for your favorite music...</p>
    </div>
  );
}

// Layout component that wraps all pages
function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 pb-20 overflow-y-auto">
            <SidebarTrigger />
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
      <AppPlayer />
    </div>
  );
}

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pages/playlists" element={<Playlists />} />
        <Route path="pages/liked" element={<Liked />} />
        <Route path="pages/search" element={<Search />} />
        <Route path="pages/settings" element={<Settings />} />
      </Route>
    )
  );

  return (
    <MusicProvider>
      <RouterProvider router={router} />
    </MusicProvider>
  );
}
