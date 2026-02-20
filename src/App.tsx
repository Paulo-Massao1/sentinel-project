import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Identify from "./pages/Identify";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/identify" element={<Identify />} />
      </Routes>
    </BrowserRouter>
  );
}
