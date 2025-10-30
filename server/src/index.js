import "dotenv/config";

import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 5000;

export const startServer = async () => {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    const app = createApp();

    return app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}
