import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export type Answer = {
  id: number;
  question_id: number;
  text: string;
};

export const answerService = {
  submitAnswer: async (questionId: number, text: string) => {
    const user = localStorage.getItem("user");
    const response = await axios.post(`${API_BASE_URL}/answers`, {
      question_id: questionId,
      text,
      answered_by: JSON.parse(user || "{}").username,
    });
    return response.data;
  },
  getAnswers: async (questionId: number) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/answers`, {
      params: { question_id: questionId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
