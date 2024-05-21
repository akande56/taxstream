import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { OverallPaymentIncomeReview } from "./OverallPaymentIncomeReview";
import { OverallTaxPayStatusReview } from "./OverallTaxPayStatusReview";

const DashboardView = () => {
  return (
    <div className="main__dashboard p-8 space-y-6 ">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4  *:odd:bg-[#E5ECF6] *:even:bg-[#E3F5FF] ">
        {/* Total Tax Area */}
        <Card x-chunk="dashboard-01-chunk-0" className="border-none ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm ">Total Tax Area</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-xl font-semibold">7573</p>
            <div className="flex  items-center gap-2">
              <p className="text-xs text-muted-foreground">Active now</p>
              <TrendingUp size={18} color="#3d3d3d" strokeWidth={1} />
            </div>
          </CardContent>
        </Card>
        {/* Active Tax Collectors */}
        <Card x-chunk="dashboard-01-chunk-0" className="border-none ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm ">Active Tax Collectors</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-xl font-semibold">2318</p>
            <div className="flex  items-center gap-2">
              <p className="text-xs text-muted-foreground">Active now</p>
              <TrendingUp size={18} color="#3d3d3d" strokeWidth={1} />
            </div>
          </CardContent>
        </Card>
        {/* Total Registered Company */}
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm ">Total Registered Company</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-xl font-semibold">2318</p>
            <div className="flex  items-center gap-2">
              <p className="text-xs text-muted-foreground">Active now</p>
              <TrendingUp size={18} color="#3d3d3d" strokeWidth={1} />
            </div>
          </CardContent>
        </Card>
        {/* Total Registered Individual */}
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm ">
              Total Registered Individual
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-xl font-semibold">2318</p>
            <div className="flex  items-center gap-2">
              <p className="text-xs text-muted-foreground">Active now</p>
              <TrendingUp size={18} color="#3d3d3d" strokeWidth={1} />
            </div>
          </CardContent>
        </Card>
      </div>
      <OverallTaxPayStatusReview />
      <OverallPaymentIncomeReview />
    </div>
  );
};

export default DashboardView;
