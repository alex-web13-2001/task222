import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const fetchProjects = () => apiClient.get("/projects");
export const fetchProject = (id) => apiClient.get(`/projects/${id}`);
export const createProjectApi = (payload) => apiClient.post("/projects", payload);
export const updateProjectApi = (id, payload) => apiClient.put(`/projects/${id}`, payload);
export const updateProjectColumnsApi = (id, payload) => apiClient.put(`/projects/${id}/columns`, payload);
export const deleteProjectApi = (id) => apiClient.delete(`/projects/${id}`);

export const fetchTasks = (params) => apiClient.get("/tasks", { params });
export const createTaskApi = (payload) => apiClient.post("/tasks", payload);
export const updateTaskApi = (id, payload) => apiClient.put(`/tasks/${id}`, payload);
export const moveTaskApi = (id, payload) => apiClient.patch(`/tasks/${id}/move`, payload);
export const deleteTaskApi = (id) => apiClient.delete(`/tasks/${id}`);

export const fetchCategories = () => apiClient.get("/categories");
export const createCategoryApi = (payload) => apiClient.post("/categories", payload);
export const updateCategoryApi = (id, payload) => apiClient.put(`/categories/${id}`, payload);
export const deleteCategoryApi = (id) => apiClient.delete(`/categories/${id}`);

export const fetchTags = () => apiClient.get("/tags");
export const fetchUsers = () => apiClient.get("/users");
