import { useState } from "react";
import { pollService, type Poll } from "../services/PollService";
import { questionService } from "../services/QuestionService";
import { useNavigate } from "react-router-dom";

function PollCreate() {
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const navigate = useNavigate();

  function addQuestion() {
    setQuestions([...questions, ""]);
  }
  function deleteQuestion(index: number) {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  }
  function showAddButton() {
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
  function canSubmit() {
    return (
      questions.every((q) => q.trim() !== "") &&
      questions.length > 0 &&
      title.trim() !== ""
    );
  }
  function submitButton() {
    if (canSubmit()) {
      return (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4"
          type="submit"
        >
          Submit Poll
        </button>
      );
    }
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    pollService.createPoll(title).then((poll: Poll) => {
      questions.forEach((q) => {
        questionService.addQuestion(poll.id, q);
      });
    });
    navigate("/");
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        className="bg-white shadow-lg rounded-xl p-6 w-6/12 text-center"
        onSubmit={handleSubmit}
      >
        <div>
          <input
            type="text"
            placeholder="Poll Title"
            className="font-bold text-4xl mb-8"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <label>{index + 1}.</label>
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
        {showAddButton()}
        {submitButton()}
      </form>
    </div>
  );
}

export default PollCreate;
