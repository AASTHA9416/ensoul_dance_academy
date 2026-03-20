import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TrialFormPage from "./pages/TrialFormPage";
import TrialIntroPage from "./pages/TrialIntroPage";

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/free-trial" element={<TrialIntroPage />} />
        <Route path="/free-trial/form" element={<TrialFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}
