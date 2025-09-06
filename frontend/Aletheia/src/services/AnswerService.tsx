import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export type Answer = {
  id: number;
  question_id: number;
  text: string;
};

export const answerService = {
  submitAnswers: async (answers: { [key: number]: string }) => {
    const user = localStorage.getItem("user");
    const refinedAnswers = Object.entries(answers).map(
      ([question_id, text]) => ({
        question_id: Number(question_id),
        responder_id: JSON.parse(user || "{}").id,
        text,
      })
    );
    const response = await axios.post(`${API_BASE_URL}/answers`, {
      answers: refinedAnswers,
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
