import  connectDB  from '@/lib/mongodb'
import Product from '@/model/product'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB(process.env.MONGODB_URI || "")
  const count = await Product.countDocuments()
  return NextResponse.json({ count })
}