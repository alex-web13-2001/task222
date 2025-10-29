import React from "react";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Topbar />
        <main className="content-wrapper">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
