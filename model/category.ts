import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  value: string;
  label: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);