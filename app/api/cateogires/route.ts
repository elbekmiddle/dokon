// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; // MongoDB yoki boshqa direkt DB ulanish

const CategorySchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export async function GET() {
  try {
    const categories = await db.collection('categories').find().sort({ createdAt: -1 }).toArray();
    const categories = await Category.find().sort({ createdAt: -1 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Kategoriyalarni olishda xato' },
    const newCategory = await Category.create({
      name,
      slug,
    });
export async function POST(request: Request) {
  try {
    const { name, slug } = await request.json();
    const newCategory = await db.collection('categories').insertOne({
      name,
      slug,
      createdAt: new Date(),
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Kategoriya qo\'shishda xato' },
      { status: 500 }
    );
  }
}