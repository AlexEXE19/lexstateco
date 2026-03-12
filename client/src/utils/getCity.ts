export const getSuggestions = async (
  query: string,
  setSuggestions: (suggestions: any[]) => void,
) => {
  if (query.length < 3) {
    setSuggestions([]);
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=en`,
      {
        headers: {
          "User-Agent": "MyPropertyApp/1.0",
        },
      },
    );
    const data = await response.json();
    setSuggestions(data);
  } catch (error) {
    console.error("Autocomplete fetch error:", error);
    setSuggestions([]);
  }
};
