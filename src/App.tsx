import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Identify from "./pages/Identify";
import CasesList from "./pages/CasesList";
import NewCase from "./pages/NewCase";
import CaseDetail from "./pages/CaseDetail";
import Act from "./pages/Act";
import Sources from "./pages/Sources";
import EmergencyButton from "./components/EmergencyButton";
import LanguageToggle from "./components/LanguageToggle";

export default function App() {
  return (
    <BrowserRouter>
      <div className="fixed top-4 right-4 z-40 sm:right-5">
        <LanguageToggle />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/identify" element={<Identify />} />
        <Route path="/document" element={<CasesList />} />
        <Route path="/document/new" element={<NewCase />} />
        <Route path="/document/:id" element={<CaseDetail />} />
        <Route path="/act" element={<Act />} />
        <Route path="/sources" element={<Sources />} />
      </Routes>
      <EmergencyButton />
    </BrowserRouter>
  );
}
