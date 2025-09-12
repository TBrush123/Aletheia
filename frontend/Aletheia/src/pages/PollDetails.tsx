import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { pollService, type Poll } from "../services/PollService";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function PollDetails() {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = localStorage.getItem("user");
  const currentUserId = user ? JSON.parse(user).id : null;
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      pollService
        .getPollDetails(Number(id))
        .then((data) => {
          if (data.creator_id === currentUserId) {
            setPoll(data);
          } else {
            setError("You do not have permission to view this poll.");
            setPoll(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching poll details:", error);
          setError("Error fetching poll details.");
          setPoll(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, currentUserId]);
  function handleSubmit() {
    if (poll) {
      navigate(`/polls/${poll.id}/summary`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <CardTitle className="text-3xl font-semibold text-gray-900 text-center">
            Poll Details
          </CardTitle>

          <CardDescription className="text-lg text-center text-gray-600 mt-2"></CardDescription>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <CardHeader className="flex flex-col items-center border border-gray-200 rounded-lg py-6 bg-green-600 transition-transform transform hover:bg-green-800 hover:text-white hover:scale-105">
              <span className="text-4xl font-bold text-white"></span>
              <span className="text-lg text-gray-100 mt-1">Questions</span>
              <MessageSquare className="text-white mt-2" />
            </CardHeader>
            <CardHeader className="flex flex-col items-center border border-gray-200 rounded-lg py-6 bg-blue-600 transition-transform transform hover:bg-blue-800 hover:text-white hover:scale-105">
              <span className="text-4xl font-bold text-white"></span>
              <span className="text-lg text-gray-100 mt-1">Responses</span>
              <Users className="text-white mt-2" />
            </CardHeader>
          </div>

          <div className="mt-8 text-center">
            <Button
              className="inline-flex items-center gap-2 px-10 py-5   text-lg rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              onClick={handleSubmit}
            >
              <Sparkles className="w-5 h-5" />
              AI Summary
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }
  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Poll not found</div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <CardTitle className="text-3xl font-semibold text-gray-900 text-center">
          Poll Details
        </CardTitle>

        <CardDescription className="text-lg text-center text-gray-600 mt-2">
          {" "}
          {poll.title}
          {" By "}
          <span className="font-medium text-gray-800">{`${poll.created_by}`}</span>
        </CardDescription>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <CardHeader className="flex flex-col items-center border border-gray-200 rounded-lg py-6 bg-green-600 transition-transform transform hover:bg-green-800 hover:text-white hover:scale-105">
            <span className="text-4xl font-bold text-white">
              {poll.question_count || 0}
            </span>
            <span className="text-lg text-gray-100 mt-1">Questions</span>
            <MessageSquare className="text-white mt-2" />
          </CardHeader>
          <CardHeader className="flex flex-col items-center border border-gray-200 rounded-lg py-6 bg-blue-600 transition-transform transform hover:bg-blue-800 hover:text-white hover:scale-105">
            <span className="text-4xl font-bold text-white">
              {poll.response_count || 0}
            </span>
            <span className="text-lg text-gray-100 mt-1">Responses</span>
            <Users className="text-white mt-2" />
          </CardHeader>
        </div>

        <div className="mt-8 text-center">
          <Button
            className="inline-flex items-center gap-2 px-10 py-5   text-lg rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            onClick={handleSubmit}
          >
            <Sparkles className="w-5 h-5" />
            AI Summary
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PollDetails;
