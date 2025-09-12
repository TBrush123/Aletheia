import { useState } from "react";
import { pollService, type Poll } from "../services/PollService";
import { questionService } from "../services/QuestionService";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  function canSubmit() {
    return (
      questions.every((q) => q.trim() !== "") &&
      questions.length > 0 &&
      title.trim() !== ""
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const poll: Poll = await pollService.createPoll(title);
    for (const q of questions) {
      await questionService.addQuestion(poll.id, q);
    }
    navigate("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Create a New Poll
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="poll-title" className="text-lg">
                Poll Title
              </Label>
              <Input
                id="poll-title"
                type="text"
                placeholder="Enter poll title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Label className="w-6 text-center">{index + 1}.</Label>
                  <Input
                    type="text"
                    placeholder="Enter question"
                    value={q}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index] = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteQuestion(index)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ))}
              {questions[questions.length - 1].trim() !== "" && (
                <Button type="button" variant="outline" onClick={addQuestion}>
                  + Add another question
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center my-4">
            <Button type="submit" disabled={!canSubmit()} className="w-1/2">
              Submit Poll
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default PollCreate;
