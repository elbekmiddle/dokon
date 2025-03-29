import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk foydalanuvchi ID
  name: String,
  email: { type: String, required: true, unique: true },
  imageUrl: String, // Clerk'dan keladigan avatar rasmi
  createdAt: { type: Date, default: Date.now },
  orders: [String], // Buyurtmalar ID ro‘yxati
  role: { type: String, enum: ["user", "admin"], default: "user" },
  cart: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const User = models.User || model("User", UserSchema);
export default User;
