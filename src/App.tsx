import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/Home";
import SchedulePage from "./pages/Schedule";
import ClubsPage from "./pages/Clubs";
import QRScannerPage from "./pages/QRScanner";
import ProfilePage from "./pages/student-pages/profile/ProfilePage";

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/qr" element={<QRScannerPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default function App() {
  React.useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      if (tg.isVersionAtLeast('7.7')) {
        tg.disableVerticalSwipes();
      }
    }
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
