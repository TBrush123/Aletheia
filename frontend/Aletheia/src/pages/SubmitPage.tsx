import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

function SubmitPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-lg shadow-2xl p-10">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold text-black">
            Thank you for answering!
          </CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Your answers have been saved successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-700 mt-6 text-lg">
          You can now safely close this page.
        </CardContent>
      </Card>
    </div>
  );
}

export default SubmitPage;
