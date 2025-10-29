import React, { useState } from "react";

import { useDataContext } from "../providers/DataProvider.jsx";

const CategoriesPage = () => {
  const {
    categories,
    actions: { createCategory, updateCategory, deleteCategory }
  } = useDataContext();
  const [form, setForm] = useState({ name: "", color: "#6366f1", description: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name) return;
    setSaving(true);
    await createCategory(form);
    setForm({ name: "", color: "#6366f1", description: "" });
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">Categories</h1>
          <p style={{ margin: "8px 0", color: "var(--text-secondary)" }}>Maintain shared taxonomies across projects.</p>
        </div>
      </header>

      <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h3 style={{ margin: 0 }}>Create category</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Design"
              style={inputStyle}
              required
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            Color
            <input
              type="color"
              value={form.color}
              onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
              style={{ ...inputStyle, height: 44, padding: 6 }}
            />
          </label>
          <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Used for design deliverables"
            />
          </label>
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 18px",
                borderRadius: "999px",
                border: "none",
                background: "var(--accent-primary)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? "Saving…" : "Add category"}
            </button>
          </div>
        </form>
      </div>

      <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h3 style={{ margin: 0 }}>Existing categories</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {categories.map((category) => (
            <div
              key={category._id}
              style={{
                borderRadius: "var(--radius-lg)",
                padding: 20,
                border: "1px solid var(--border-light)",
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: category.color
                    }}
                  />
                  <strong>{category.name}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(category._id)}
                  style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
              {category.description && <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>{category.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-light)",
  fontSize: 14,
  background: "#f8fafc"
};

export default CategoriesPage;
