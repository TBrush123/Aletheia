import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { pollService } from "../services/PollService";

function AISummary() {
  const { id } = useParams<{ id: string }>();
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<object>({});

  const user = localStorage.getItem("user");
  const currentUserId = user ? Number(JSON.parse(user).id) : null;

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
  if (summary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="shadow-lg rounded-xl p-6 w-9/12 text-center">
          <CardTitle className="font-bold text-4xl mb-8">
            AI Summary Page
          </CardTitle>
          <pre className="text-left bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </Card>
      </div>
    );
  }
}

export default AISummary;
