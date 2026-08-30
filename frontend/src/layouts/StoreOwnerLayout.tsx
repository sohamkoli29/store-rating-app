import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"}`;

const StoreOwnerLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-lg font-semibold text-slate-900">Store Rating Owner</span>
            <nav className="flex gap-2">
              <NavLink to="/store-owner/dashboard" className={navItemClass}>Dashboard</NavLink>
              <NavLink to="/store-owner/change-password" className={navItemClass}>Change password</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{user?.name}</span>
            <button onClick={logout} className="font-medium text-red-600 hover:underline">Log out</button>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
};

export default StoreOwnerLayout;