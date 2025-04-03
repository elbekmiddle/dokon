import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env");
}

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseConn;
}

let cached = global.mongoose || { conn: null, promise: null };
  
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("🔄 Using existing MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "dokoncha",
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10 sekundga oshirildi
      serverSelectionTimeoutMS: 10000, // Server tanlash uchun vaqt
      socketTimeoutMS: 20000, // Socket timeout
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

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
};

export default connectDB;