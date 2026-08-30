import { useEffect, useState } from "react";
import api from "../../lib/axios";
import SortableTableHeader from "../../components/SortableTableHeader";
import AddStoreForm from "./AddStoreForm";

interface AdminStoreRow {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
}

const AdminStoresPage = () => {
  const [stores, setStores] = useState<AdminStoreRow[]>([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { sortBy, sortOrder };
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    api
      .get("/admin/stores", { params })
      .then((res) => setStores(res.data.data))
      .catch((err) => setError(err?.response?.data?.message ?? "Failed to load stores"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchStores, [filters, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-slate-900">Stores</h1>
        <button onClick={() => setShowForm((v) => !v)} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
          {showForm ? "Close" : "Add store"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <AddStoreForm onCreated={() => { setShowForm(false); fetchStores(); }} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <SortableTableHeader label="Name" field="name" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Email" field="email" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Address" field="address" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Rating" field="rating" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No stores found</td></tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.address}</td>
                  <td className="px-4 py-3">{s.rating.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStoresPage;