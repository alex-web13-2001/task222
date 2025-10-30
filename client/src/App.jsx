import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import ProjectBoardPage from "./pages/ProjectBoard.jsx";
import ProjectsPage from "./pages/Projects.jsx";
import CategoriesPage from "./pages/Categories.jsx";
import NotFoundPage from "./pages/NotFound.jsx";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
