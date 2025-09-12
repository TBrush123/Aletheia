import { pollService } from "../services/PollService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerService } from "../services/AnswerService";
import { responseService } from "../services/ResponseService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }
  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Poll not found
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const responseData = await responseService.createResponse(Number(id));

      await answerService.submitAnswers(answers, responseData.id);

      navigate("/submit");
    } catch (err) {
      console.error("Error during submit:", err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-3xl shadow-2xl p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          <CardHeader className="space-y-3">
            <CardTitle className="text-4xl font-bold text-center">
              {poll.title}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Created by: {poll.created_by}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ol className="list-decimal list-inside space-y-10">
              {questions.map((question, index) => (
                <li key={question.id} className="space-y-4">
                  <Label
                    htmlFor={`q-${question.id}`}
                    className="text-xl font-semibold"
                  >
                    {question.text}
                  </Label>
                  <Input
                    id={`q-${question.id}`}
                    type="text"
                    placeholder={`Your answer for Question ${index + 1}`}
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: e.target.value,
                      }))
                    }
                    className="h-12 text-lg"
                  />
                </li>
              ))}
            </ol>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              type="submit"
              className="w-full sm:w-auto h-12 px-8 text-lg"
            >
              Submit Answers
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default PollAnswer;
