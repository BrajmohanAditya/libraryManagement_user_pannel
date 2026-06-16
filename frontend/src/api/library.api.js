import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Get all libraries (paginated)
export const getLibrariesApi = async ({ page = 1, limit = 10 } = {}) => {
  const res = await axios.get(`${baseUrl}/librarys`, {
    params: { page, limit },
    withCredentials: true,
  });
  return res.data;
};

// Search libraries
export const searchLibrariesApi = async (query, { page = 1, limit = 10 } = {}) => {
  const res = await axios.get(`${baseUrl}/librarys/search`, {
    params: { q: query, page, limit },
    withCredentials: true,
  });
  return res.data;
};

// Get nearest libraries
export const getNearestLibrariesApi = async ({ latitude, longitude, radius = 5, page = 1, limit = 10 }) => {
  const res = await axios.get(`${baseUrl}/librarys/nearest`, {
    params: { latitude, longitude, radius, page, limit },
    withCredentials: true,
  });
  return res.data;
};
