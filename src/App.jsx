
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash.jsx";
import Login from "./pages/Login.jsx";
import Classes from "./pages/Classes.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/create-quiz/:className" element={<CreateQuiz />} />
        {/* Redirect any unknown routes to splash */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
