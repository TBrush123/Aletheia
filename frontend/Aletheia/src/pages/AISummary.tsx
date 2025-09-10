import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { pollService } from "../services/PollService";

function AISummary() {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<object>({});

  const user = localStorage.getItem("user");
  const currentUserId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    document.title = "AI Summary - Aletheia";
    if (id) {
      pollService
        .getAISummary(Number(id))
        .then((data) => {
          if (data.creator_id === currentUserId) {
            setSummary(data);
          } else {
            setError("You do not have permission to view this poll.");
          }
        })
        .catch((error) => {
          console.error("Error fetching poll details:", error);
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
          <p className="text-gray-700 text-lg">
            This is a placeholder for the AI Summary feature. More details will
            be added soon.
          </p>
        </Card>
      </div>
    );
  }
}

export default AISummary;
