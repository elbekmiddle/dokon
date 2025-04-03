import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/model/user';
import Product from '@/model/product';

export async function GET() {
  try {
    await connectDB();
    
    // Get admin stats
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    
    // You can add more stats as needed, for example:
    const featuredProducts = await Product.countDocuments({ featured: true });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    
    return NextResponse.json({
      success: true,
      stats: {
        users: usersCount,
        products: productsCount,
        featuredProducts,
        outOfStockProducts,
        // Add more stats here
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch admin stats",
        details: error instanceof Error ? error.message : null
      },
      { status: 500 }
    );
  }
}