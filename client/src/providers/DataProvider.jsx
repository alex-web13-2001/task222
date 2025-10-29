import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  createCategoryApi,
  createProjectApi,
  createTaskApi,
  deleteCategoryApi,
  fetchCategories,
  fetchProjects,
  fetchTags,
  fetchTasks,
  fetchUsers,
  moveTaskApi,
  updateCategoryApi,
  updateProjectApi,
  updateProjectColumnsApi,
  updateTaskApi
} from "../api/client.js";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsRes, tasksRes, categoriesRes, tagsRes, usersRes] = await Promise.all([
        fetchProjects(),
        fetchTasks(),
        fetchCategories(),
        fetchTags(),
        fetchUsers()
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createProject = useCallback(
    async (payload) => {
      const response = await createProjectApi(payload);
      setProjects((prev) => [...prev, response.data]);
      return response.data;
    },
    []
  );

  const updateProject = useCallback(async (id, payload) => {
    const response = await updateProjectApi(id, payload);
    setProjects((prev) => prev.map((project) => (project._id === id ? response.data : project)));
    return response.data;
  }, []);

  const updateProjectColumns = useCallback(async (id, payload) => {
    const response = await updateProjectColumnsApi(id, payload);
    setProjects((prev) => prev.map((project) => (project._id === id ? response.data : project)));
    return response.data;
  }, []);

  const createTask = useCallback(async (payload) => {
    const response = await createTaskApi(payload);
    setTasks((prev) => [...prev, response.data]);
    return response.data;
  }, []);

  const updateTask = useCallback(async (id, payload) => {
    const response = await updateTaskApi(id, payload);
    setTasks((prev) => prev.map((task) => (task._id === id ? response.data : task)));
    return response.data;
  }, []);

  const moveTask = useCallback(async (id, payload) => {
    const response = await moveTaskApi(id, payload);
    setTasks((prev) => prev.map((task) => (task._id === id ? response.data : task)));
    return response.data;
  }, []);

  const createCategory = useCallback(async (payload) => {
    const response = await createCategoryApi(payload);
    setCategories((prev) => [...prev, response.data]);
    return response.data;
  }, []);

  const updateCategory = useCallback(async (id, payload) => {
    const response = await updateCategoryApi(id, payload);
    setCategories((prev) => prev.map((category) => (category._id === id ? response.data : category)));
    return response.data;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await deleteCategoryApi(id);
    setCategories((prev) => prev.filter((category) => category._id !== id));
  }, []);

  const value = useMemo(
    () => ({
      projects,
      tasks,
      categories,
      tags,
      users,
      loading,
      error,
      refresh: loadData,
      actions: {
        createProject,
        updateProject,
        updateProjectColumns,
        createTask,
        updateTask,
        moveTask,
        createCategory,
        updateCategory,
        deleteCategory
      }
    }),
    [
      projects,
      tasks,
      categories,
      tags,
      users,
      loading,
      error,
      loadData,
      createProject,
      updateProject,
      updateProjectColumns,
      createTask,
      updateTask,
      moveTask,
      createCategory,
      updateCategory,
      deleteCategory
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataProvider");
  }
  return context;
};
