import { pollService } from "../services/PollService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PollAnswer() {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<{
    id: number;
    title: string;
    created_by: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<
    Array<{ id: number; text: string }>
  >([]);

  useEffect(() => {
    if (id) {
      pollService
        .getPollDetails(Number(id))
        .then((data) => {
          setPoll(data);
        })
        .catch((error) => {
          console.error("Error fetching poll details:", error);
          setLoading(false);
        });
      pollService
        .getPollQuestions(Number(id))
        .then((data) => {
          setQuestions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching poll questions:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!poll) {
    return <div>Poll not found</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form className="bg-white shadow-lg rounded-xl p-6 w-6/12 text-center">
        <h1 className="text-4xl font-bold mb-4">{poll.title}</h1>
        <p className="text-gray-600 mb-4">Created by: {poll.created_by}</p>
        <ol type="1" className="list-decimal list-inside">
          {questions.map((question) => (
            <>
              <li key={question.id} className="mb-2 flex text-left">
                {question.text}
              </li>
              <input type="text" className="border p-2 w-full mb-4" />
            </>
          ))}   
        </ol>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
}

export default PollAnswer;
