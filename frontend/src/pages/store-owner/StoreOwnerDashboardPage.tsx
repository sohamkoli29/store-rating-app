import { useEffect, useState } from "react";
import api from "../../lib/axios";
import SortableTableHeader from "../../components/SortableTableHeader";

interface Rater {
  userId: string;
  name: string;
  email: string;
  rating: number;
  ratedAt: string;
}

interface DashboardData {
  store: { id: string; name: string; address: string };
  averageRating: number;
  totalRatings: number;
  raters: Rater[];
}

type SortField = "name" | "email" | "rating" | "ratedAt";

const StoreOwnerDashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setLoading(true);
    api
      .get("/store-owner/dashboard")
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err?.response?.data?.message ?? "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field: string) => {
    const f = field as SortField;
    if (sortBy === f) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(f);
      setSortOrder("asc");
    }
  };

  if (loading) return <p className="px-6 py-8 text-sm text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="px-6 py-8 text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const dir = sortOrder === "desc" ? -1 : 1;
  const sortedRaters = [...data.raters].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1 * dir;
    if (a[sortBy] > b[sortBy]) return 1 * dir;
    return 0;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{data.store.name}</h1>
        <p className="text-sm text-slate-500">{data.store.address}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average rating</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{data.averageRating.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total ratings</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{data.totalRatings}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <SortableTableHeader label="Name" field="name" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Email" field="email" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Rating" field="rating" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Rated at" field="ratedAt" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sortedRaters.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No ratings yet</td></tr>
            ) : (
              sortedRaters.map((r) => (
                <tr key={r.userId} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.rating}</td>
                  <td className="px-4 py-3">{new Date(r.ratedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreOwnerDashboardPage;