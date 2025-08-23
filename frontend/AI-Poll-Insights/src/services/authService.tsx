import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export type User = { id: number; username: string };

export const authService = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    ///if (response.data.token) {
    /// localStorage.setItem("token", response.data.token);
    ///}

    localStorage.setItem("token", "banana"); // Test token
    response.data.token = "banana"; // Test token
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
