import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import PollCreate from "./pages/PollCreate";
import Polls from "./pages/Polls";
import PollsAnswer from "./pages/PollAnswer";
import SubmitPage from "./pages/SubmitPage";
import PollDetails from "./pages/PollDetails";
import AISummary from "./pages/AISummary";
import Account from "./pages/Account";
import Navbar from "./features/Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/polls/create" element={<PollCreate />} />
        <Route path="/polls" element={<Polls />} />
        <Route path="/polls/:id" element={<PollsAnswer />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/polls/:id/details" element={<PollDetails />} />
        <Route path="/polls/:id/summary" element={<AISummary />} />
        <Route path="/profile/" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
