import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { createApp } from "../src/app.js";

let app;
let mongoServer;

const createCategory = async (payload) => {
  const response = await request(app).post("/api/categories").send(payload);
  assert.equal(response.status, 201);
  return response.body;
};

const createProject = async (payload) => {
  const response = await request(app).post("/api/projects").send(payload);
  assert.equal(response.status, 201);
  return response.body;
};

const createTask = async (payload) => {
  const response = await request(app).post("/api/tasks").send(payload);
  assert.equal(response.status, 201);
  return response.body;
};

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.NODE_ENV = "test";
  await connectDatabase(mongoServer.getUri());
  app = createApp();
});

test.after(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDatabase();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test("category creation persists data", async () => {
  const payload = { name: "Design", color: "#ff5733", description: "Design related" };
  const category = await createCategory(payload);

  assert.ok(category._id);
  assert.equal(category.name, payload.name);

  const listResponse = await request(app).get("/api/categories");
  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.length, 1);
  assert.equal(listResponse.body[0]._id.toString(), category._id);
});

test("project workflow saves columns and relations", async () => {
  const category = await createCategory({ name: "Development", color: "#3357ff" });

  const project = await createProject({
    name: "Website Redesign",
    description: "Revamp public site",
    links: [{ label: "Design", url: "https://example.com" }],
    categories: [category._id],
    columns: [
      { name: "Assigned", status: "assigned" },
      { name: "In Progress", status: "in_progress" },
      { name: "Done", status: "done" }
    ]
  });

  assert.ok(project._id);
  assert.equal(project.columns.length, 3);
  assert.equal(project.categories.length, 1);
  assert.equal(project.categories[0]._id.toString(), category._id);

  const fetchResponse = await request(app).get(`/api/projects/${project._id}`);
  assert.equal(fetchResponse.status, 200);
  assert.equal(fetchResponse.body.columns.length, 3);
});

test("task lifecycle maintains ordering and status", async () => {
  const category = await createCategory({ name: "QA", color: "#00b894" });
  const project = await createProject({
    name: "Mobile App",
    columns: [
      { name: "Assigned", status: "assigned" },
      { name: "In Progress", status: "in_progress" },
      { name: "Review", status: "review" },
      { name: "Done", status: "done" }
    ]
  });

  const [assignedColumn, inProgressColumn] = project.columns;

  const firstTask = await createTask({
    title: "Write test plan",
    description: "Outline coverage",
    project: project._id,
    category: category._id,
    column: assignedColumn._id,
    priority: "high",
    tags: [],
    links: [{ label: "Spec", url: "https://specs.local" }]
  });

  assert.equal(firstTask.status, "assigned");
  assert.equal(firstTask.column._id.toString(), assignedColumn._id);
  assert.equal(firstTask.position, 0);

  const secondTask = await createTask({
    title: "Execute regression",
    project: project._id,
    column: assignedColumn._id,
    position: 0
  });

  assert.equal(secondTask.position, 0);

  const listResponse = await request(app).get("/api/tasks").query({ project: project._id });
  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.length, 2);

  const moveResponse = await request(app)
    .patch(`/api/tasks/${firstTask._id}/move`)
    .send({ columnId: inProgressColumn._id, position: 0 });

  assert.equal(moveResponse.status, 200);
  assert.equal(moveResponse.body.column._id.toString(), inProgressColumn._id);
  assert.equal(moveResponse.body.status, "in_progress");

  const updatedList = await request(app).get("/api/tasks").query({ project: project._id });
  assert.equal(updatedList.body.find((task) => task._id === firstTask._id).status, "in_progress");
  assert.equal(
    updatedList.body.find((task) => task._id === secondTask._id).position,
    0
  );
});
