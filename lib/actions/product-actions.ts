'use server';

import connectDB from '@/lib/mongodb';
import { Product } from '@/lib/mongodb';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export const getProducts = async () => {
  try {
    await connectDB(process.env.MONGODB_URI || '');
    return await Product.find()
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error('Mahsulotlarni olishda xato:', error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    await connectDB(process.env.MONGODB_URI || '');
    return await Product.findById(id)
      .populate('categoryId', 'name')
      .lean();
  } catch (error) {
    console.error('Mahsulotni olishda xato:', error);
    return null;
  }
};

export const addProduct = async (data: {
  title: string;
  description: string;
  price: number;
  categoryId: string;
}, imageFile: File) => {
  try {
    await connectDB(process.env.MONGODB_URI || '');
    
    // Rasmni Cloudinaryga yuklash
    const imageUrl = await uploadImage(imageFile);

    const newProduct = new Product({
      ...data,
      imageUrl,
      status: 'active'
    });

    await newProduct.save();
    return newProduct.toObject();
  } catch (error) {
    console.error('Mahsulot qo\'shishda xato:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string;
}, imageFile?: File) => {
  try {
    await connectDB(process.env.MONGODB_URI || '');
    
    let updateData = { ...data };
    if (imageFile) {
      // Eski rasmni o'chirish
      const oldProduct = await Product.findById(id);
      if (oldProduct?.imageUrl) {
        const publicId = oldProduct.imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) await deleteImage(`dokoncha-products/${publicId}`);
      }
      
      // Yangi rasmni yuklash
      updateData.imageUrl = await uploadImage(imageFile);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    return updatedProduct;
  } catch (error) {
    console.error('Mahsulotni yangilashda xato:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await connectDB();
    
    // Rasmni Cloudinarydan o'chirish
    const product = await Product.findById(id);
    if (product?.imageUrl) {
      const publicId = product.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) await deleteImage(`dokoncha-products/${publicId}`);
    }
    
    await Product.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error('Mahsulotni o\'chirishda xato:', error);
    throw error;
  }
};