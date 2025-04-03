import bcrypt from "bcryptjs";
import User from "@/model/user";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yangi foydalanuvchini yaratish
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Saqlanayotgan parolni hashladik
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response("Error creating user", { status: 500 });
  }
}
