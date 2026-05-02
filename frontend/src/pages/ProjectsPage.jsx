import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import { projectAPI, userAPI } from "../services/api";

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedMembers, setSelectedMembers] = useState({});
  const [error, setError] = useState("");

  const loadProjects = async () => {
    const response = await projectAPI.getMyProjects();
    setProjects(response.data);
  };

  const loadUsers = async () => {
    const response = await userAPI.getUsers();
    setUsers(response.data);
  };

  useEffect(() => {
    Promise.all([loadProjects(), loadUsers()]).catch((err) => {
      setError(err.response?.data?.message || "Failed to load projects");
    });
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await projectAPI.create(form);
      setForm({ name: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const addMember = async (projectId) => {
    const memberId = selectedMembers[projectId];
    if (!memberId) return;

    setError("");
    try {
      await projectAPI.addMember(projectId, memberId);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const removeMember = async (projectId, memberId) => {
    setError("");
    try {
      await projectAPI.removeMember(projectId, memberId);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Projects</h2>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {user?.role === "admin" && (
        <form onSubmit={handleCreateProject} className="mb-6 rounded-lg bg-white p-5 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Create Project</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button className="mt-3 rounded-md bg-slate-900 text-white px-4 py-2 hover:bg-slate-800" type="submit">
            Create
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project}>
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-medium">Members</p>
              {project.members?.map((member) => (
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 border border-slate-200" key={member._id}>
                  <span>
                    {member.name} ({member.role})
                  </span>
                  {user?.role === "admin" && String(project.admin?._id) === String(user._id) && String(project.admin?._id) !== String(member._id) && (
                    <button
                      type="button"
                      onClick={() => removeMember(project._id, member._id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {user?.role === "admin" && String(project.admin?._id) === String(user._id) && (
              <div className="mt-3 flex gap-2">
                <select
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={selectedMembers[project._id] || ""}
                  onChange={(e) =>
                    setSelectedMembers((prev) => ({
                      ...prev,
                      [project._id]: e.target.value
                    }))
                  }
                >
                  <option value="">Select user</option>
                  {users
                    .filter((item) => !project.members.some((member) => member._id === item._id))
                    .map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} ({item.role})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => addMember(project._id)}
                  className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            )}
          </ProjectCard>
        ))}
      </div>

      {!projects.length && <p className="text-sm text-slate-500 mt-3">No projects found.</p>}
    </Layout>
  );
};

export default ProjectsPage;
