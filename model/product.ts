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
  colors: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Ranglarni tekshirish uchun validatsiya funktsiyasi
const validateColors = (colors: string[]) => {
  const allowedColors = ["yashil", "oq", "sariq", "qizil"];
  if (colors.length !== 4) return false;
  return colors.every(color => allowedColors.includes(color));
};

// MongoDB modeli
const ProductSchema = new Schema<IProduct>(
  {
    name: { 
      type: String, 
      required: [true, "Mahsulot nomi talab qilinadi"],
      trim: true,
      maxlength: [100, "Mahsulot nomi 100 ta belgidan oshmasligi kerak"]
    },
    description: { 
      type: String, 
      required: [true, "Mahsulot tavsifi talab qilinadi"],
      trim: true,
      maxlength: [1000, "Tavsif 1000 ta belgidan oshmasligi kerak"]
    },
    price: { 
      type: Number, 
      required: [true, "Narx talab qilinadi"],
      min: [0, "Narx manfiy bo'lishi mumkin emas"]
    },
    category: { 
      type: String, 
      required: [true, "Kategoriya talab qilinadi"],
      enum: {
        values: ["elektronika", "kiyim", "oziq-ovqat", "uy-ro'zg'or"],
        message: "Noto'g'ri kategoriya"
      }
    },
    stock: { 
      type: Number, 
      required: [true, "Soni talab qilinadi"],
      min: [0, "Soni manfiy bo'lishi mumkin emas"],
      default: 0
    },
    imageUrl: { 
      type: String, 
      required: [true, "Asosiy rasm talab qilinadi"],
      validate: {
        validator: (value: string) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value);
        },
        message: "Noto'g'ri rasm formati"
      }
    },
    imageUrlv1: { 
      type: String, 
      required: [true, "1-variant rasmi talab qilinadi"],
      validate: {
        validator: (value: string) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value);
        },
        message: "Noto'g'ri rasm formati"
      }
    },
    imageUrlv2: { 
      type: String, 
      required: [true, "2-variant rasmi talab qilinadi"],
      validate: {
        validator: (value: string) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value);
        },
        message: "Noto'g'ri rasm formati"
      }
    },
    imageUrlv3: { 
      type: String, 
      required: [true, "3-variant rasmi talab qilinadi"],
      validate: {
        validator: (value: string) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value);
        },
        message: "Noto'g'ri rasm formati"
      }
    },
    imageUrlv4: { 
      type: String, 
      required: [true, "4-variant rasmi talab qilinadi"],
      validate: {
        validator: (value: string) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value);
        },
        message: "Noto'g'ri rasm formati"
      }
    },
    colors: {
      type: [String],
      required: [true, "Ranglar talab qilinadi"],
      validate: {
        validator: validateColors,
        message: "Faqat 4 ta rang (yashil, oq, sariq, qizil) bo'lishi kerak"
      }
    }
  },
  { 
    timestamps: true, // createdAt va updatedAt avtomatik qo'shiladi
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Modelni eksport qilish
export default mongoose.models.Product || model<IProduct>("Product", ProductSchema);