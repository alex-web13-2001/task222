import User from "../models/user.model.js";

export const listUsers = () => User.find().select("-password").lean();

export const createUser = async (payload) => {
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password
  });
  const { password, ...rest } = user.toObject();
  return rest;
};

export const updateUser = async (id, payload) => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }

  user.name = payload.name ?? user.name;
  user.email = payload.email ?? user.email;
  if (payload.password) {
    user.password = payload.password;
  }

  await user.save();
  const { password, ...rest } = user.toObject();
  return rest;
};

export const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return false;
  }
  await user.deleteOne();
  return true;
};
