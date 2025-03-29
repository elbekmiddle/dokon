import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/model/product";  // Import yo'lingiz to'g'riligiga ishonch hosil qiling

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).lean();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("🚨 API xatosi:", error);
    return NextResponse.json(
      { message: "Server xatosi", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
