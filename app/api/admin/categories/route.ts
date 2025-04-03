import  connectToDatabase  from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Category from '@/model/category';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, categories },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }
    
    const existingCategory = await Category.findOne({ value: name.toLowerCase() });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'This category already exists' },
        { status: 400 }
      );
    }
    
    const newCategory = await Category.create({
      value: name.toLowerCase(),
      label: name
    });
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Category added',
        category: newCategory
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        value: name.toLowerCase(),
        label: name
      },
      { new: true }
    );
    
    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Category updated',
        category: updatedCategory
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
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
    
    const deletedCategory = await Category.findByIdAndDelete(params.id);
    
    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Category deleted'
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}