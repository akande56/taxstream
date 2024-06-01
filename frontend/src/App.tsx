// // App.js
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Dashboard } from "./pages/Dashboard";
// import { LoginPage } from "./pages/Login";
// import PolicySettings from "./components/PolicySettings";
// import StaffEnrollment from "./components/StaffEnrollment";
// import Audit from "./components/Audit";
// import Assessment from "./components/Assessment";
// import Profile from "./components/Profile";
// import DashboardContent from "./components/Dashboard";
// import PolicySettingsLocation from "./components/PolicySettingsLocation";
// import PolicySettingsBusiness from "./components/PolicySettingsBusiness";
// import ResetPassword from "./pages/ResetPassword";

// import OTPVerification from "./pages/OTPVerification";
// import Signup from "./pages/Signup";
// import PayeeEnrollment from "./components/PayeeEnrollment";
// import Forbidden from "./components/errors/Forbidden";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />

//         <Route path="/dashboard" element={<Dashboard />}>
//           <Route index element={<DashboardContent />} />
//           <Route path="policy-settings" element={<PolicySettings />}>
//             <Route index element={<PolicySettingsLocation />} />
//             <Route path="location" element={<PolicySettingsLocation />} />
//             <Route path="business" element={<PolicySettingsBusiness />} />
//           </Route>
//           <Route path="staff-enrollment" element={<StaffEnrollment />} />
//           <Route path="payee-enrollment" element={<PayeeEnrollment />} />
//           <Route path="audit" element={<Audit />} />
//           <Route path="assessment" element={<Assessment />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/register" element={<Signup />} />
//         <Route path="/otp-verification" element={<OTPVerification />} />
//         {/* Error Routes */}
//         <Route path="/403" element={<Forbidden />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// src/App.tsx
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
import PayeeEnrollment from "./components/PayeeEnrollment";
import Forbidden from "./components/errors/Forbidden";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { roles } from "./lib/roles";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/403" element={<Forbidden />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={<Dashboard />}
                roles={["admin", "assessment", "ict"]}
              />
            }
          >
            <Route index element={<DashboardContent />} />
            <Route
              path="policy-settings"
              element={
                <ProtectedRoute
                  element={<PolicySettings />}
                  roles={roles.policySettings}
                />
              }
            >
              <Route index element={<PolicySettingsLocation />} />
              <Route path="location" element={<PolicySettingsLocation />} />
              <Route path="business" element={<PolicySettingsBusiness />} />
            </Route>
            <Route
              path="staff-enrollment"
              element={
                <ProtectedRoute
                  element={<StaffEnrollment />}
                  roles={roles.staffEnrollment}
                />
              }
            />
            <Route
              path="payee-enrollment"
              element={
                <ProtectedRoute
                  element={<PayeeEnrollment />}
                  roles={roles.payeeEnrollment}
                />
              }
            />
            <Route
              path="audit"
              element={
                <ProtectedRoute element={<Audit />} roles={roles.audit} />
              }
            />
            <Route
              path="assessment"
              element={
                <ProtectedRoute
                  element={<Assessment />}
                  roles={roles.assessment}
                />
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute
                  element={<Profile />}
                  roles={["admin", "assessment", "ict"]}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
