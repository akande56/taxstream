// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import PolicySettings from "./components/PolicySettings";
import StaffEnrollment from "./components/StaffEnrollment";
import Audit from "./components/Audit";
import Assessment from "./components/Assessment";
import Profile from "./components/Profile";
import DashboardContent from "./components/Dashboard";
import PolicySettingsLocation from "./components/PolicySettingsLocation";
import PolicySettingsBusiness from "./components/PolicySettingsBusiness";
import ResetPassword from "./pages/ResetPassword";

import OTPVerification from "./pages/OTPVerification";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardContent />} />
          <Route path="policy-settings" element={<PolicySettings />}>
            <Route index element={<PolicySettingsLocation />} />
            <Route path="location" element={<PolicySettingsLocation />} />
            <Route path="business" element={<PolicySettingsBusiness />} />
          </Route>
          <Route path="staff-enrollment" element={<StaffEnrollment />} />
          <Route path="audit" element={<Audit />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
      </Routes>
    </Router>
  );
};

export default App;
