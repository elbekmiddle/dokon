import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  orders: [String],
  role: { type: String, enum: ["user", "admin"], default: "admin" },
  cart: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const User = models?.User || model("User", UserSchema);

export default User;
