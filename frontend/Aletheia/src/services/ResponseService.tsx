import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export type PollResponse = {
  id: number;
  responder_id: number;
  poll_id: number;
};

export const answerService = {
  createResponse: async (poll_id: number) => {
    const user = localStorage.getItem("user");
    const response = await axios.post(`${API_BASE_URL}/answers`, {
      answers: refinedAnswers,
    });
    return response.data;
  },
};
