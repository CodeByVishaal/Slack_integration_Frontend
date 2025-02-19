import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dashboard from "./pages/DashboardPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Home from "./pages/HomePage";
import ProgramPage from "./pages/ProgramsPage";
import Submissions from "./pages/SubmissionsPage";
import PrivateRoute from "./pages/PrivateRoute";
import SlackIntegration from "./pages/SlackIntegration";
import SlackChannel from "./pages/SlackChannel";
import EditProgram from "./pages/EditProgram";
import SlackAuthPage from "./pages/SlackAuthPage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import EditSubmission from "./pages/EditSubmission";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AspectRatio ratio={16 / 9}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/programs/edit/:id" element={<EditProgram />} />
          <Route path="/submissions/edit/:id" element={<EditSubmission />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/programs"
            element={
              <PrivateRoute>
                <ProgramPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <PrivateRoute>
                <Submissions />
              </PrivateRoute>
            }
          />
          <Route
            path="/select-slack-channel"
            element={
              <PrivateRoute>
                <SlackChannel />
              </PrivateRoute>
            }
          />
          <Route
            path="/slack"
            element={
              <PrivateRoute>
                <SlackIntegration />
              </PrivateRoute>
            }
          />

          <Route
            path="/slack-auth-test"
            element={
              <PrivateRoute>
                <SlackAuthPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AspectRatio>
  );
}

export default App;
