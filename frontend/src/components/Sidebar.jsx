import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/projects" },
  { label: "Tasks", path: "/tasks" },
  { label: "Profile", path: "/profile" }
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button (mobile) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed top-4 left-4 z-50 rounded-md bg-slate-900 p-2 text-white"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile when open */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white p-5 transition-transform duration-200 md:static md:translate-x-0 md:w-64 md:min-h-screen ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        aria-hidden={!open && "true"}
      >
        <div className="relative flex h-full flex-col">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Team Task Manager</h1>
              {/* Close button for mobile */}
              <button
                onClick={() => setOpen(false)}
                className="md:hidden rounded bg-slate-800 p-1 text-slate-200"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
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
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2 transition ${
                    active ? "bg-slate-700" : "hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <button
              type="button"
              onClick={logout}
              className="absolute bottom-4 right-4 rounded-md bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-700 md:static md:w-full"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
