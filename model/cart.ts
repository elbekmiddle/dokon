import { Schema, model, models } from "mongoose";

const CartSchema = new Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      price: Number,
      imageUrl: String,
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = models.Cart || model("Cart", CartSchema);
export default Cart;
