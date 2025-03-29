import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dokoncha";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ MongoDB allaqachon bog`langan");
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: "dokoncha",
    });

    console.log("✅ MongoDB muvaffaqiyatli bog`landi");
  } catch (error) {
    console.error("❌ MongoDB ulanish xatosi:", error);
    process.exit(1);
  }
};
