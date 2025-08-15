import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/common/dashboard/Dashboard"), {
  ssr: false,
});

export default function DashboardPage() {
  return <Dashboard />;
}
