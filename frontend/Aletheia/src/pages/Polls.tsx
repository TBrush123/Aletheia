import { pollService, type Poll } from "../services/PollService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function Polls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const data = await pollService.getPolls();
        setPolls(data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPolls();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="bg-white shadow-lg rounded-xl p-6 w-9/12 text-center">
          <h1 className="font-bold text-4xl mb-8">Polls Page</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="bg-white shadow-lg rounded-xl p-6 w-9/12 text-center">
        <h1 className="font-bold text-4xl mb-8">Polls Page</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll: Poll) => (
            <Card>
              <Link to={`/polls/${poll.id}/details`} key={poll.id}>
                <h2 className="font-semibold text-xl mb-2">{poll.title}</h2>
                <h6 className="text-gray-500 mb-2">
                  Questions: {poll.question_count || 0} | Responses:{" "}
                  {poll.response_count || 0}
                </h6>
              </Link>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Polls;
