import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me")
};

export const userAPI = {
  getUsers: () => api.get("/users")
};

export const projectAPI = {
  create: (payload) => api.post("/projects", payload),
  getMyProjects: () => api.get("/projects"),
  addMember: (projectId, memberId) => api.post(`/projects/${projectId}/members`, { memberId }),
  removeMember: (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`)
};

export const taskAPI = {
  create: (projectId, payload) => api.post(`/tasks/project/${projectId}`, payload),
  byProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status })
};

export const dashboardAPI = {
  stats: () => api.get("/dashboard")
};
