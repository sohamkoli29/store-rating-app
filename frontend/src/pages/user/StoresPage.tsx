import { useEffect, useState } from "react";
import api from "../../lib/axios";
import SortableTableHeader from "../../components/SortableTableHeader";
import StarRating from "../../components/StarRating";

interface StoreRow {
  id: string;
  name: string;
  address: string;
  overallRating: number;
  myRating: number | null;
}

const StoresPage = () => {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { sortBy, sortOrder };
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    api
      .get("/stores", { params })
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

  const handleRate = async (storeId: string, rating: number, isUpdate: boolean) => {
    setSavingId(storeId);
    setError(null);
    try {
      if (isUpdate) await api.put(`/stores/${storeId}/ratings`, { rating });
      else await api.post(`/stores/${storeId}/ratings`, { rating });
      fetchStores();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to save rating");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <h1 className="text-lg font-semibold text-slate-900">Stores</h1>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input placeholder="Search by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Search by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <SortableTableHeader label="Store" field="name" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Address" field="address" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Overall rating" field="overallRating" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Your rating</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No stores found</td></tr>
            ) : (
              stores.map((store) => (
                <tr key={store.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">{store.name}</td>
                  <td className="px-4 py-3">{store.address}</td>
                  <td className="px-4 py-3">{store.overallRating.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StarRating
                      value={store.myRating ?? 0}
                      disabled={savingId === store.id}
                      onChange={(rating) => handleRate(store.id, rating, store.myRating !== null)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoresPage;