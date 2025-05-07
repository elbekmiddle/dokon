import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env");
}

declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

const connectDB = async (p0: string) => {
  if (cached.conn) {
    console.log("🔄 Using existing MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "dokoncha",
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    };

    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected.");
      return mongoose;
    }).catch((err) => {
      console.error("❌ MongoDB Connection Error:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
