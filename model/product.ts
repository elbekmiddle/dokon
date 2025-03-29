import mongoose, { Schema, Document, model } from "mongoose";

// Mahsulot interfeysi
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  imageUrlv1: string;
  imageUrlv2: string;
  imageUrlv3: string;
  imageUrlv4: string;
  createdAt: Date;
}

// MongoDB modeli
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true } // Avtomatik createdAt va updatedAt qo`shiladi
);

// Modelni eksport qilish
export default mongoose.models.Product || model<IProduct>("Product", ProductSchema);
