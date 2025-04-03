import  User  from '@/model/user';
import  Product  from '@/model/product';
import connectDB from '@/lib/mongodb';

export async function getAdminStats() {
  try {
    await connectDB();
    
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ featured: true });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    
    return {
      users: usersCount,
      products: productsCount,
      featuredProducts,
      outOfStockProducts
    };
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return {
      users: 0,
      products: 0,
      featuredProducts: 0,
      outOfStockProducts: 0
    };
  }
}