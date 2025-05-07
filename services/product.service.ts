import Product, { IProduct } from '@/model/product';
import  connectToDatabase  from '@/lib/mongodb';

export const ProductService = {
  async getAllProducts(): Promise<IProduct[]> {
    await connectToDatabase('yourDatabaseConnectionString');
    return Product.find().populate('categoryId').sort({ createdAt: -1 }).exec();
  },

  async getProductById(id: string): Promise<IProduct | null> {
    await connectToDatabase('yourDatabaseConnectionString');
    return Product.findById(id).populate('categoryId').exec();
  },

  async createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
    await connectToDatabase('yourDatabaseConnectionString');
    const product = new Product(productData);
    return product.save();
  },

  async updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    await connectToDatabase('yourDatabaseConnectionString');
    return Product.findByIdAndUpdate(
      id, 
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).populate('categoryId').exec();
  },

  async deleteProduct(id: string): Promise<IProduct | null> {
    await connectToDatabase('yourDatabaseConnectionString');
    return Product.findByIdAndDelete(id).exec();
  }
};