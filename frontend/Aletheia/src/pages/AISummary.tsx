import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartNoAxesColumn,
  ChartNoAxesCombined,
  CircleMinus,
  CirclePlus,
} from "lucide-react";
import { pollService } from "../services/PollService";
import { Button } from "@/components/ui/button";

function AISummary() {
  const { id } = useParams<{ id: string }>();
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<object>({});

  const user = localStorage.getItem("user");
  const currentUserId = user ? Number(JSON.parse(user).id) : null;

  function RegenerateResponse() {
    pollService
      .regenerateResponse(Number(id))
      .then(() => window.location.reload());
  }

  useEffect(() => {
    document.title = "AI Summary - Aletheia";
    if (id) {
      pollService
        .getPollDetails(Number(id))
        .then((data) => {
          setCreatorId(data.creator_id);
          console.log("Creator ID:", data.creator_id);

          return pollService.getAISummary(Number(id)).then((summaryData) => {
            if (data.creator_id === currentUserId) {
              setSummary(summaryData);
              console.log("AI Summary data:", summaryData);
            } else {
              console.log(data.creator_id, currentUserId);
              setError("You do not have permission to view this poll.");
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching poll details or summary:", error);
          setError("Error fetching poll details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, currentUserId]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="shadow-lg rounded-2xl p-8 w-10/12">
          <CardTitle className="font-bold text-4xl mb-10 text-center">
            AI Summary Page
          </CardTitle>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 rounded-xl shadow-sm border">
              <CardTitle className="flex items-center gap-2 text-green-600 font-semibold text-4xl mb-4">
                <CirclePlus /> Positive Feedback
              </CardTitle>
              <p className="text-gray-700 text-2xl leading-relaxed">
                <Skeleton className="h-4 w-[250px]" />
              </p>
            </Card>

            <Card className="p-6 rounded-xl shadow-sm border">
              <CardTitle className="flex items-center gap-2 text-red-600 font-semibold text-4xl mb-4">
                <CircleMinus /> Negative Feedback
              </CardTitle>
              <p className="text-gray-700 text-2xl leading-relaxed">
                <Skeleton className="h-4 w-[250px]" />
              </p>
            </Card>

            <Card className="p-6 rounded-xl shadow-sm border">
              <CardTitle className="flex items-center gap-2 text-blue-600 font-semibold text-4xl mb-4">
                <ChartNoAxesCombined /> Suggestions for Improvement
              </CardTitle>
              <p className="text-gray-700 text-2xl leading-relaxed">
                <Skeleton className="h-4 w-[250px]" />
              </p>
            </Card>
          </div>
        </Card>
      </div>
    );
  }
  if (summary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="shadow-lg rounded-2xl p-8 w-10/12 ">
          <CardTitle className="font-bold text-4xl mb-10 text-center">
            AI Summary Page
          </CardTitle>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 rounded-xl shadow-sm border">
              <CardTitle className="flex items-center gap-2 text-green-600 font-semibold text-4xl mb-4">
                <CirclePlus /> Positive Feedback
              </CardTitle>
              <p className="text-gray-700 text-2xl leading-relaxed">
                {summary.positive_feedback}
              </p>
            </Card>

            <Card className="p-6 rounded-xl shadow-sm border">
              <CardTitle className="flex items-center gap-2 text-red-600 font-semibold text-4xl mb-4">
                <CircleMinus /> Negative Feedback
              </CardTitle>
              <p className="text-gray-700 text-2xl leading-relaxed">
                {summary.negative_feedback}
              </p>
            </Card>

            <Card className="p-6 rounded-xl shadow-sm border">
              <CardTitle className="flex items-center gap-2 text-blue-600 font-semibold text-4xl mb-4">
                <ChartNoAxesCombined /> Suggestions for Improvement
              </CardTitle>
              <p className="text-gray-700 text-2xl leading-relaxed">
                {summary.suggestions_for_improvement}
              </p>
            </Card>
          </div>
          <Button
            className="w-32 h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            onClick={() => {
              RegenerateResponse();
            }}
          >
            Regenerate
          </Button>
        </Card>
      </div>
    );
  }
}

export default AISummary;
