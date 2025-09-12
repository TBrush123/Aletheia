import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { responseService } from "../services/ResponseService";
import { authService } from "@/services/authService";
import { pollService, type Poll } from "@/services/PollService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AccountPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await responseService.getResponses();

        // Fetch poll details for each response
        const enrichedResponses = await Promise.all(
          data.map(async (res: any) => {
            try {
              const poll = await pollService.getPollDetails(res.poll_id);
              return { ...res, poll_title: poll.title };
            } catch (err) {
              console.error(`Error fetching poll ${res.poll_id}:`, err);
              return { ...res, poll_title: "Unknown Poll" };
            }
          })
        );

        setResponses(enrichedResponses);
        console.log("Enriched responses:", enrichedResponses);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      <Card className="shadow-lg rounded-2xl p-8 w-11/12 md:w-9/12">
        <CardTitle className="font-bold text-4xl mb-10 text-center">
          My Account
        </CardTitle>
        <div className="space-y-6 mb-10">
          <CardHeader>Your responses:</CardHeader>
          {loading ? (
            <p className="text-center text-gray-500">Loading responses...</p>
          ) : responses.length > 0 ? (
            responses.map((response) => (
              <Card
                key={response.id}
                className="p-6 rounded-xl shadow-sm border hover:shadow-md transition-all"
              >
                <h2 className="text-lg font-semibold mb-2">
                  {response.poll_title}
                </h2>
                <p className="text-gray-500 text-sm">
                  Created on{" "}
                  {new Date(response.created_at).toLocaleDateString()}
                </p>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center">No responses yet.</p>
          )}
        </div>
        <div className="text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="px-6 py-3 text-lg flex items-center gap-2 rounded-md"
              >
                <Trash2 className="w-5 h-5" /> Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    className="transform bg-red-600 hover:bg-red-700"
                    onClick={() => authService.deleteAccount()}
                  >
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
