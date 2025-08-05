// Modern API implementation using fetch (works in browser)
const CLIENT_ID = "9a56e0a6";

export const jamendoAPI = {
  // Search for tracks
  searchTracks: async (query: string, limit: number = 10) => {
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        audioformat: "mp32",
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
      return data;
    } catch (error) {
      console.error("Error fetching music:", error);
      throw error;
    }
  },

  // Get popular tracks
  getPopularTracks: async (limit: number = 8) => {
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: limit.toString(),
        audioformat: "mp32",
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

