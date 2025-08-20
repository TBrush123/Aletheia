import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const authService = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },
  register: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      password,
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(atob(token.split(".")[1])) : null;
  },
};

export default authService;
