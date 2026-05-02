import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { dashboardAPI } from "../services/api";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardAPI
      .stats()
      .then((response) => setStats(response.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h2>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {!stats ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalTasks}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">To Do</p>
            <p className="text-2xl font-bold text-slate-900">{stats.tasksByStatus["To Do"]}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">In Progress</p>
            <p className="text-2xl font-bold text-slate-900">{stats.tasksByStatus["In Progress"]}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-slate-900">{stats.tasksByStatus["Done"]}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdueTasks}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-200 md:col-span-2 xl:col-span-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tasks Per User</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {stats.tasksPerUser.length ? (
                stats.tasksPerUser.map((entry) => (
                  <div key={entry.user} className="rounded-md bg-slate-50 px-3 py-2 border border-slate-200">
                    <p className="text-sm text-slate-600">{entry.user}</p>
                    <p className="font-semibold text-slate-900">{entry.count}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No task assignments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;
