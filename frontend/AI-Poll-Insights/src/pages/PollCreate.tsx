import PollQuestion from "../components/PollQuestion";
import PollTitle from "../components/PollTitle";
import { useState } from "react";

function PollCreate() {
  const [questions, setQuestions] = useState<string[]>([""]);

  function addQuestion() {
    setQuestions([...questions, ""]);
  }
  function deleteQuestion(index: number) {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  }
  function showButton() {
    if (questions[questions.length - 1].trim() !== "") {
      return (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addQuestion}
        >
          <span>+</span> Add another Question
        </button>
      );
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white shadow-lg rounded-xl p-6 w-6/12 text-center">
        <PollTitle />
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <label>{index + 1}</label>
            <input
              type="text"
              placeholder="Question"
              className="mx-2"
              value={q}
              onChange={(e) => {
                const updated = [...questions];
                updated[index] = e.target.value;
                setQuestions(updated);
              }}
            />
            {questions.length > 1 && (
              <button
                onClick={() => {
                  deleteQuestion(index);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-1 my-2 rounded"
              >
                Delete Question
              </button>
            )}
          </div>
        ))}
        {showButton()}
      </div>
    </div>
  );
}

export default PollCreate;
