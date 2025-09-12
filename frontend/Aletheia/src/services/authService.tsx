import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export type User = { id: number; username: string };

export const authService = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    console.log("Login response:", response.data);

    localStorage.setItem("token", "banana"); // Test token
    response.data.token = "banana"; // Test token
    response.data.user = {
      id: response.data.user_id,
      username: response.data.username,
    };
    console.log("Storing user:", response.data.user);
    return response.data;
  },
  register: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      password,
    });
    localStorage.setItem("token", "banana"); // Test token
    response.data.token = "banana"; // Test token
    response.data.user = {
      id: response.data.user_id,
      username: response.data.username,
    };
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(atob(token.split(".")[1])) : null;
  },
  deleteAccount: async () => {
    try {
      const user = localStorage.getItem("user");
      const user_id = JSON.parse(user || "{}").id;

      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE_URL}/users/delete`, {
        params: { user_id },
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  },
};
