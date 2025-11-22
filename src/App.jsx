// src/App.jsx
import { Routes, Route } from "react-router-dom";
import NursePage from "./pages/NursePage";
import HospitalPage from "./pages/HospitalPage";

export default function App() {
  return (
    <Routes>
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/hospital" element={<HospitalPage />} />
      <Route path="*" element={<div style={{padding:20}}>Invalid Route</div>} />
    </Routes>
  );
}
