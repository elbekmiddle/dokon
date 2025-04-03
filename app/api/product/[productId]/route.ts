import { NextRequest, NextResponse } from "next/server";
import connectToDB from "../../../../lib/mongodb";
import Product from "../../../../model/product";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { productId?: string } }) {
  await connectToDB();

  const productId = params.productId;

  if (!productId) {
    return NextResponse.json({ error: "Mahsulot ID berilmagan" }, { status: 400 });
  }

  // MongoDB ObjectId formatini tekshirish
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Noto`g`ri mahsulot ID formati" }, { status: 400 });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Mahsulotni olishda xatolik:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
