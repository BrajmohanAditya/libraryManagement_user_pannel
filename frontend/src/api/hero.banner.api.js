import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getHeroSectionApi = async () => {
    const res = await axios.get(`${baseUrl}/banner`, {
        withCredentials: true
    });
    return res.data;
};