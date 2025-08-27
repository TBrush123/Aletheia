import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export type Question = {
  id: number;
  poll_id: number;
  text: string;
};

export const questionService = {
  addQuestion: async (pollId: number, text: string) => {
    const response = await axios.post(`${API_BASE_URL}/questions`, {
      poll_id: pollId,
      text,
    });
    return response.data;
  },
  getQuestions: async (pollId: number) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/polls/${pollId}/questions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
