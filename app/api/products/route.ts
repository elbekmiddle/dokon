// app/api/products/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/model/product"; // GET endpointdagi import strukturasiga moslashtirildi
// import { Product as IProduct } from "../../../types";

export async function GET() {
  try {
    await dbConnect(process.env.MONGODB_URI!);
    const products = await Product.find({})
      .lean()
      .populate("categoryId")
      .exec();
      
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("🚨 GET /api/products xatosi:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server xatosi",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect(process.env.MONGODB_URI!);
    const body: IProduct = await req.json();

    // Validatsiya
    if (!body.title || !body.categoryId || !body.imageUrl) {
      return NextResponse.json(
        { success: false, message: "Majburiy maydonlar to'ldirilmagan" },
        { status: 400 }
      );
    }

    // Yangi mahsulot yaratish
    const newProduct = new Product(body);
    await newProduct.save();

    // Yangi yaratilgan mahsulotni populate qilish
    const populatedProduct = await Product.findById(newProduct._id)
      .populate("categoryId")
      .lean()
      .exec();

    return NextResponse.json(
      { success: true, data: populatedProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("🚨 POST /api/products xatosi:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ma'lumotlar bazasi xatosi",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}