// Modern API implementation using fetch (works in browser)
const CLIENT_ID = "9a56e0a6";

// Global settings object to store user preferences
export const audioSettings = {
  format: "mp32", // Default to high quality
  setFormat: (format: "mp32" | "mp31") => {
    audioSettings.format = format;
  },
  getFormat: () => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("audioQuality");
    return saved || audioSettings.format;
  },
};

export const jamendoAPI = {
  // Search for tracks
  searchTracks: async (
    query: string,
    limit: number = 50,
    audioFormat?: string
  ) => {
    try {
      const format = audioFormat || audioSettings.getFormat();
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        audioformat: format,
        search: query,
      });

      const url = `https://api.jamendo.com/v3.0/tracks/?${params}`;
      console.log("Fetching from:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Optional: Add client-side filtering for more precise results
      if (data.results) {
        data.results = data.results.filter((track: any) => {
          const searchTerm = query.toLowerCase();
          const trackName = (track.name || "").toLowerCase();
          const artistName = (track.artist_name || "").toLowerCase();
          const albumName = (track.album_name || "").toLowerCase();

          return (
            trackName.includes(searchTerm) ||
            artistName.includes(searchTerm) ||
            albumName.includes(searchTerm)
          );
        });
      }

      return data;
    } catch (error) {
      console.error("Error fetching music:", error);
      throw error;
    }
  },

  // Get popular tracks
  getPopularTracks: async (limit: number = 8, audioFormat?: string) => {
    try {
      const format = audioFormat || audioSettings.getFormat();
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        audioformat: format,
        order: "popularity_total",
        cover_image: "big",
      });

      const url = `https://api.jamendo.com/v3.0/tracks/?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching popular tracks:", error);
      throw error;
    }
  },
};
