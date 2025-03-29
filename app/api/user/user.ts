import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/model/user";

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
