import axios from 'axios';

export const fetchSearchResults = async (query) => {
  if (!query.trim()) return [];

  try {
    const response = await axios.get(
      `/api/v1/notes/search-notes?query=${query}`,
      { 
        withCredentials: true
      }
    );
    return response.data.data;
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
};
