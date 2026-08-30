import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  rating?: number;
}

const UserDetailModal = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/admin/users/${userId}`)
      .then((res) => setDetail(res.data.data))
      .catch((err) => setError(err?.response?.data?.message ?? "Failed to load user"));
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">User details</h2>
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {!error && !detail && <p className="text-sm text-slate-500">Loading...</p>}

        {detail && (
          <dl className="space-y-2 text-sm">
            <div><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-900">{detail.name}</dd></div>
            <div><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{detail.email}</dd></div>
            <div><dt className="text-slate-500">Address</dt><dd className="font-medium text-slate-900">{detail.address}</dd></div>
            <div><dt className="text-slate-500">Role</dt><dd className="font-medium text-slate-900">{detail.role}</dd></div>
            {detail.role === "STORE_OWNER" && (
              <div><dt className="text-slate-500">Store rating</dt><dd className="font-medium text-slate-900">{detail.rating?.toFixed(2)}</dd></div>
            )}
          </dl>
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;