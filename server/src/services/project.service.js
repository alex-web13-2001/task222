import Column from "../models/column.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

const DEFAULT_COLUMNS = [
  { name: "Backlog", status: "backlog" },
  { name: "Assigned", status: "assigned" },
  { name: "In Progress", status: "in_progress" },
  { name: "Review", status: "review" },
  { name: "Done", status: "done" }
];

export const listProjects = async () => {
  return Project.find()
    .populate("categories")
    .populate({ path: "columns", options: { sort: { order: 1 } } })
    .lean();
};

export const getProjectById = async (id) => {
  return Project.findById(id)
    .populate("categories")
    .populate({ path: "columns", options: { sort: { order: 1 } } })
    .populate({
      path: "tasks",
      populate: ["category", "tags", "assignee", "column"],
      options: { sort: { position: 1 } }
    })
    .lean();
};

export const createProject = async ({ name, description, links = [], categories = [], columns = [] }) => {
  const project = await Project.create({ name, description, links, categories });

  const columnDefinitions = columns.length ? columns : DEFAULT_COLUMNS;
  const columnDocs = await Column.insertMany(
    columnDefinitions.map((column, index) => ({
      ...column,
      project: project._id,
      order: index
    }))
  );

  project.columns = columnDocs.map((column) => column._id);
  await project.save();

  return getProjectById(project._id);
};

export const updateProject = async (id, payload) => {
  const project = await Project.findById(id);
  if (!project) {
    return null;
  }

  project.name = payload.name ?? project.name;
  project.description = payload.description ?? project.description;
  project.links = payload.links ?? project.links;
  project.categories = payload.categories ?? project.categories;
  await project.save();

  return getProjectById(id);
};

export const upsertColumns = async (projectId, columnPayload = []) => {
  const project = await Project.findById(projectId);
  if (!project) {
    return null;
  }

  const existingColumns = await Column.find({ project: projectId });

  const operations = columnPayload.map((column, index) => {
    if (column._id) {
      return Column.findByIdAndUpdate(
        column._id,
        {
          name: column.name,
          status: column.status,
          order: index
        },
        { new: true }
      );
    }

    const newColumn = new Column({
      name: column.name,
      status: column.status,
      order: index,
      project: projectId
    });
    return newColumn.save();
  });

  const updatedColumns = await Promise.all(operations);

  const payloadIds = columnPayload.filter((col) => col._id).map((col) => col._id.toString());
  const columnsToDelete = existingColumns.filter((col) => !payloadIds.includes(col._id.toString()));

  if (columnsToDelete.length) {
    const columnIds = columnsToDelete.map((col) => col._id);
    await Task.updateMany(
      { column: { $in: columnIds } },
      { $set: { column: null } }
    );
    await Column.deleteMany({ _id: { $in: columnIds } });
  }

  project.columns = updatedColumns.map((col) => col._id);
  await project.save();

  return getProjectById(projectId);
};

export const deleteProject = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    return false;
  }

  const columnIds = project.columns;
  await Task.deleteMany({ project: id });
  await Column.deleteMany({ project: id });
  await project.deleteOne();

  return true;
};
