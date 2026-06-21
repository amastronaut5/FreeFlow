import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detections from "./pages/Detections";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/Upload";
import DashboardLayout from "./components/layout";
import type{ Detection } from "./types/Detection";
import { useState, useEffect} from "react";
const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
function App() {
  const [violations, setViolations] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchViolations = async () => {
    try {
      const res = await axios.get(
        `${API_BACKEND_URL}/violations`
      );

      setViolations(res.data.data);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchViolations();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard violations={violations}></Dashboard>}
          />

          <Route
            path="/detections"
            element={<Detections violations={violations} setViolations={setViolations} loading={loading}></Detections>}
          />

          <Route
            path="/upload"
            element={<UploadPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
