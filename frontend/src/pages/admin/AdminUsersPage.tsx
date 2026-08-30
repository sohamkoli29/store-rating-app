import { useEffect, useState } from "react";
import api from "../../lib/axios";
import SortableTableHeader from "../../components/SortableTableHeader";
import AddUserForm from "./AddUserForm";
import UserDetailModal from "./UserDetailModal";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewUserId, setViewUserId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { sortBy, sortOrder };
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    api
      .get("/admin/users", { params })
      .then((res) => setUsers(res.data.data))
      .catch((err) => setError(err?.response?.data?.message ?? "Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, [filters, sortBy, sortOrder]);

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
        <h1 className="text-lg font-semibold text-slate-900">Users</h1>
        <button onClick={() => setShowForm((v) => !v)} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
          {showForm ? "Close" : "Add user"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <AddUserForm onCreated={() => { setShowForm(false); fetchUsers(); }} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All roles</option>
          <option value="NORMAL_USER">Normal user</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store owner</option>
        </select>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <SortableTableHeader label="Name" field="name" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Email" field="email" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Address" field="address" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <SortableTableHeader label="Role" field="role" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
              <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No users found</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.address}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setViewUserId(u.id)} className="font-medium text-teal-600 hover:underline">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewUserId && <UserDetailModal userId={viewUserId} onClose={() => setViewUserId(null)} />}
    </div>
  );
};

export default AdminUsersPage;