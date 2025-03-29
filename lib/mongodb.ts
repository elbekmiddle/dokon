import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;  // Endi MONGODB_URI dan o'qiladi

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  if (!MONGO_URI) {
    throw new Error("MONGO_URI aniqlanmadi! Iltimos, .env faylni tekshiring.");
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB muvaffaqiyatli ulandi");
  } catch (error) {
    console.error("❌ MongoDB ulanishida xato:", error);
    process.exit(1);
  }
};

export default dbConnect;
