import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

function Logout() {
  const { logout } = useAuth();
  logout();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-md shadow-2xl p-8">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold text-black">
            You have been logged out
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Thank you for using <span className="font-semibold">Aletheia</span>!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-700 mt-6 text-base">
          We hope to see you again soon.
        </CardContent>
      </Card>
    </div>
  );
}

export default Logout;
