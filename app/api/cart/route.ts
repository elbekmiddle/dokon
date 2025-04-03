import { NextResponse } from 'next/server';
import User from '@/model/user';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  selectedColors?: string[];
  _id?: mongoose.Types.ObjectId;
}

// Helper function for error responses
const errorResponse = (message: string, status: number) => {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
};

// GET - Retrieve user's cart
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return errorResponse("Email talab qilinadi", 400);
  }

  try {
    await connectDB();
    
    const user = await User.findOne({ email })
      .populate({
        path: 'cart.productId',
        select: 'name price imageUrl'
      })
      .select('cart');

    if (!user) {
      return errorResponse("Foydalanuvchi topilmadi", 404);
    }

    // Format the response data
    const formattedCart = user.cart.map((item: any) => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      imageUrl: item.productId.imageUrl,
      quantity: item.quantity,
      selectedColors: item.selectedColors || []
    }));

    return NextResponse.json({ 
      success: true,
      cart: formattedCart 
    });
  } catch (error) {
    console.error('GET /api/cart error:', error);
    return errorResponse("Server xatosi", 500);
  }
}

// POST - Add item to cart or increment quantity
export async function POST(request: Request) {
  try {
    const { email, productId, quantity = 1, selectedColors } = await request.json();

    // Input validation
    if (!email || !productId) {
      return errorResponse("Email va mahsulot ID si talab qilinadi", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("Noto'g'ri mahsulot ID formati", 400);
    }

    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse("Foydalanuvchi topilmadi", 404);
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      (item: CartItem) => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      user.cart[existingItemIndex].quantity += Number(quantity);
      if (selectedColors) {
        user.cart[existingItemIndex].selectedColors = selectedColors;
      }
    } else {
      // Add new item
      user.cart.push({ 
        productId: new mongoose.Types.ObjectId(productId),
        quantity: Number(quantity),
        selectedColors: selectedColors || []
      });
    }

    await user.save();
    
    return NextResponse.json({ 
      success: true,
      message: "Savat yangilandi"
    });
  } catch (error) {
    console.error('POST /api/cart error:', error);
    return errorResponse("Server xatosi", 500);
  }
}

// PUT - Update item quantity
export async function PUT(request: Request) {
  try {
    const { email, productId, quantity } = await request.json();

    // Input validation
    if (!email || !productId || quantity === undefined) {
      return errorResponse("Barcha maydonlar talab qilinadi", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("Noto'g'ri mahsulot ID formati", 400);
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity)) {
      return errorResponse("Noto'g'ri miqdor formati", 400);
    }

    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse("Foydalanuvchi topilmadi", 404);
    }

    const itemIndex = user.cart.findIndex(
      (item: CartItem) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return errorResponse("Mahsulot savatda topilmadi", 404);
    }

    if (parsedQuantity < 1) {
      // Remove item if quantity is less than 1
      user.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      user.cart[itemIndex].quantity = parsedQuantity;
    }

    await user.save();
    
    return NextResponse.json({ 
      success: true,
      message: "Miqdor yangilandi"
    });
  } catch (error) {
    console.error('PUT /api/cart error:', error);
    return errorResponse("Server xatosi", 500);
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: Request) {
  try {
    const { email, productId } = await request.json();

    // Input validation
    if (!email || !productId) {
      return errorResponse("Email va mahsulot ID si talab qilinadi", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("Noto'g'ri mahsulot ID formati", 400);
    }

    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse("Foydalanuvchi topilmadi", 404);
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      (item: CartItem) => item.productId.toString() !== productId
    );

    if (user.cart.length === initialLength) {
      return errorResponse("Mahsulot savatda topilmadi", 404);
    }

    await user.save();
    
    return NextResponse.json({ 
      success: true,
      message: "Mahsulot o'chirildi"
    });
  } catch (error) {
    console.error('DELETE /api/cart error:', error);
    return errorResponse("Server xatosi", 500);
  }
}