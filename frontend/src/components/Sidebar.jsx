import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/projects" },
  { label: "Tasks", path: "/tasks" },
  { label: "Profile", path: "/profile" }
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white p-5 md:min-h-screen">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Team Task Manager</h1>
        <p className="text-slate-300 text-sm mt-2">
          {user?.name} ({user?.role})
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-md px-3 py-2 transition ${
                active ? "bg-slate-700" : "hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-8 w-full rounded-md bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
