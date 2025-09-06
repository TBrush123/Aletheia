import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export type Poll = {
  id: number;
  title: string;
  created_by: string;
};

export const pollService = {
  createPoll: async (title: string) => {
    const user = localStorage.getItem("user");
    const response = await axios.post(`${API_BASE_URL}/polls`, {
      title,
      creator_id: JSON.parse(user || "{}").id,
    });
    return response.data;
  },
  getPolls: async () => {
    const user = localStorage.getItem("user");
    const response = await axios.get(`${API_BASE_URL}/polls`, {
      params: { creator_id: JSON.parse(user || "{}").id },
    });
    return response.data;
  },
  getPollDetails: async (pollId: number) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/polls/${pollId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getPollQuestions: async (pollId: number) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/questions/${pollId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getAnswerNumber: async (pollId: number) => {
    const response = await axios.get(
      `${API_BASE_URL}/polls/${pollId}/answers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
