import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err?.response?.data?.message ?? "Failed to load dashboard"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!stats) return <p className="text-sm text-slate-500">Loading dashboard...</p>;

  const cards = [
    { label: "Total users", value: stats.totalUsers },
    { label: "Total stores", value: stats.totalStores },
    { label: "Total ratings", value: stats.totalRatings },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboardPage;