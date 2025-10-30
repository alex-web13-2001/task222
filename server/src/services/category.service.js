import Category from "../models/category.model.js";

export const listCategories = () => Category.find().sort({ name: 1 }).lean();

export const createCategory = async (payload) => {
  return Category.create({
    name: payload.name,
    color: payload.color,
    description: payload.description
  });
};

export const updateCategory = async (id, payload) => {
  const category = await Category.findById(id);
  if (!category) {
    return null;
  }

  category.name = payload.name ?? category.name;
  category.color = payload.color ?? category.color;
  category.description = payload.description ?? category.description;
  await category.save();
  return category.toObject();
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    return false;
  }
  await category.deleteOne();
  return true;
};
