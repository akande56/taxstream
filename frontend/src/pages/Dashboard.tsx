/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboards/admin/AdminDashboard";
import TaxPayerDashboard from "@/components/dashboards/user/TaxPayerDashboard";
export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role === "supervisor1") {
    return <AdminDashboard />;
  }
  if (user?.role === "tax_payer") {
    return <TaxPayerDashboard />;
  }

  return <div>No matching role found</div>;
}
