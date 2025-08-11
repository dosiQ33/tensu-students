import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import MainPage2 from "./pages/student-pages/main/MainPage2";
import ProfilePage from "./pages/student-pages/profile/ProfilePage";
import StatsPage from "./pages/student-pages/stats/StatsPage";
import OnboardingPage from "./pages/onboarding/Onboarding";
import TrainingsPage from "./pages/student-pages/trainings/TrainingsPage";

function AppRoutes() {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <div className={isOnboarding ? "" : "pt-20"}>
      <Routes>
        <Route path="/main" element={<MainPage2 />} />
        {/* <Route path="/payment" element={<PaymentPage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/trainings" element={<TrainingsPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
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
