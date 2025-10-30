import React from "react";
import { NavLink } from "react-router-dom";

const primaryLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/projects", label: "Projects", icon: "🗂️" },
  { to: "/categories", label: "Categories", icon: "🏷️" }
];

const secondaryLinks = [
  { to: "/calendar", label: "Calendar", icon: "🗓️" },
  { to: "/chats", label: "Chats", icon: "💬" },
  { to: "/analytics", label: "Analytics", icon: "📈" }
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span role="img" aria-hidden>
          ✨
        </span>
        Mondays
      </div>

      <div className="sidebar__nav">
        <div className="sidebar__nav-group">
          <span className="sidebar__label">Main</span>
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}>
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar__nav-group">
          <span className="sidebar__label">Workspace</span>
          {secondaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}>
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="sidebar__projects">
        <div className="sidebar__label">Quick Links</div>
        <NavLink to="/projects" className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}>
          <span>➕</span>
          New Project
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
