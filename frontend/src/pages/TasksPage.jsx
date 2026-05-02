import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { projectAPI, taskAPI } from "../services/api";
import { TASK_PRIORITIES } from "../utils/constants";

const TasksPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: ""
  });
  const [error, setError] = useState("");

  const loadProjects = async () => {
    const response = await projectAPI.getMyProjects();
    setProjects(response.data);
    if (response.data.length && !selectedProjectId) {
      setSelectedProjectId(response.data[0]._id);
    }
  };

  const loadTasks = async (projectId) => {
    if (!projectId) return;
    const response = await taskAPI.byProject(projectId);
    setTasks(response.data);
  };

  useEffect(() => {
    loadProjects().catch((err) => setError(err.response?.data?.message || "Failed to load projects"));
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    loadTasks(selectedProjectId).catch((err) => setError(err.response?.data?.message || "Failed to load tasks"));
  }, [selectedProjectId]);

  const selectedProject = projects.find((project) => project._id === selectedProjectId);
  const canCreateTask = user?.role === "admin" && String(selectedProject?.admin?._id) === String(user?._id);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!selectedProjectId) return;
    setError("");
    try {
      await taskAPI.create(selectedProjectId, form);
      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignedTo: ""
      });
      await loadTasks(selectedProjectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    setError("");
    try {
      await taskAPI.updateStatus(taskId, status);
      await loadTasks(selectedProjectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Tasks</h2>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="mb-5">
        <label className="text-sm text-slate-700">Select Project</label>
        <select
          className="mt-1 w-full max-w-md rounded-md border border-slate-300 px-3 py-2"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">Choose project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {canCreateTask && (
        <form onSubmit={handleCreateTask} className="mb-6 rounded-lg bg-white p-5 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Create Task</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="date"
              className="rounded-md border border-slate-300 px-3 py-2"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
            />
            <select
              className="rounded-md border border-slate-300 px-3 py-2"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {TASK_PRIORITIES.map((priority) => (
                <option value={priority} key={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-slate-300 px-3 py-2"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              required
            >
              <option value="">Assign to member</option>
              {selectedProject?.members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <button className="mt-3 rounded-md bg-slate-900 text-white px-4 py-2 hover:bg-slate-800" type="submit">
            Create Task
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            canUpdateStatus={String(task.assignedTo?._id) === String(user?._id)}
            onUpdateStatus={updateTaskStatus}
          />
        ))}
      </div>
      {!tasks.length && <p className="text-sm text-slate-500">No tasks found for this project.</p>}
    </Layout>
  );
};

export default TasksPage;
