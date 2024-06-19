/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboardContent from "./dashboards/admin/AdminDashboardContent";
import UserDashboardContent from "./dashboards/user/UserDashboardContent";

const DashboardContent: React.FC = () => {
  //   const [getTaxPaymentActivity, setTaxPaymentActivity] = useState([]);

  const { user } = useAuth();
  if (user?.role === "supervisor2") {
    return <AdminDashboardContent />;
  } else if (user?.role === "supervisor1") {
    return <UserDashboardContent />;
  }
};

export default DashboardContent;