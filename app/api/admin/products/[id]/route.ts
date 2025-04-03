// app/api/admin/products/[id]/route.ts
import  connectToDatabase  from '@/lib/mongodb';
import Product from '@/model/product';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const updateData = await request.json();
    
    // Validate required fields
    if (!updateData.name || !updateData.price || !updateData.category) {
      return NextResponse.json(
        { success: false, message: 'Majburiy maydonlar to\'ldirilmagan' },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Mahsulot muvaffaqiyatli yangilandi',
        product: updatedProduct 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Server xatosi: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Mahsulot muvaffaqiyatli o\'chirildi'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Server xatosi: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}