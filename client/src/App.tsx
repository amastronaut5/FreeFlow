import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detections from "./pages/Detections";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/Upload";
import DashboardLayout from "./components/layout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/detections"
            element={<Detections />}
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
