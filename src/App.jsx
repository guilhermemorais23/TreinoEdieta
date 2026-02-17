import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WeeklySummary from "./pages/WeeklySummary";
import MonthlySummary from "./pages/MonthlySummary";

function Private({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/treinos" element={<Private><Workouts /></Private>} />
      <Route path="/resumo-semanal" element={<Private><WeeklySummary /></Private>} />
      <Route path="/resumo-mensal" element={<Private><MonthlySummary /></Private>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
    </Routes>
  );
}