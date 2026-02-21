import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Identify from "./pages/Identify";
import CasesList from "./pages/CasesList";
import NewCase from "./pages/NewCase";
import CaseDetail from "./pages/CaseDetail";
import Act from "./pages/Act";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/identify" element={<Identify />} />
        <Route path="/document" element={<CasesList />} />
        <Route path="/document/new" element={<NewCase />} />
        <Route path="/document/:id" element={<CaseDetail />} />
        <Route path="/act" element={<Act />} />
      </Routes>
    </BrowserRouter>
  );
}
