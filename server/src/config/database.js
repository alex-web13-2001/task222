import mongoose from "mongoose";

export const connectDatabase = async (uri) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
};

export default mongoose;
