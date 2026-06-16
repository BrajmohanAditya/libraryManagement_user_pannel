import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Helper to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Login API
export const loginApi = async (credentials) => {
  const res = await axios.post(`${baseUrl}/users/login`, credentials);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// Signup API
export const signupApi = async (userData) => {
  const res = await axios.post(`${baseUrl}/users/signup`, userData);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// Get User Profile API
export const getProfileApi = async () => {
  const res = await axios.get(`${baseUrl}/users/profile`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Update Profile API
export const updateProfileApi = async (userData) => {
  const res = await axios.put(`${baseUrl}/users/update`, userData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
