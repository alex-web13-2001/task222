import Tag from "../models/tag.model.js";

export const listTags = () => Tag.find().sort({ name: 1 }).lean();

export const createTag = async (payload) => {
  return Tag.create({
    name: payload.name,
    description: payload.description
  });
};

export const updateTag = async (id, payload) => {
  const tag = await Tag.findById(id);
  if (!tag) {
    return null;
  }

  tag.name = payload.name ?? tag.name;
  tag.description = payload.description ?? tag.description;
  await tag.save();
  return tag.toObject();
};

export const deleteTag = async (id) => {
  const tag = await Tag.findById(id);
  if (!tag) {
    return false;
  }
  await tag.deleteOne();
  return true;
};
