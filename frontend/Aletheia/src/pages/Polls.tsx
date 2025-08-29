import { pollService, type Poll } from "../services/PollService";
import { useEffect, useState } from "react";

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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading polls...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white shadow-lg rounded-xl p-6 w-9/12 text-center">
        <h1 className="font-bold text-4xl mb-8">Polls Page</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll: Poll) => (
            <div
              key={poll.id}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="font-semibold text-xl mb-2">{poll.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Polls;
