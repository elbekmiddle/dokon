import dbConnect from "../../../lib/mongodb";
import Cart from "../../../model/cart";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // 🔹 MongoDBga ulanish

  try {
    if (req.method === "GET") {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email kerak" });
      }

      const cart = await Cart.findOne({ userEmail: email });
      return res.status(200).json(cart ? cart.items : []);
    }

    if (req.method === "POST") {
      const { email, productId, name, price, imageUrl } = req.body;

      if (!email || !productId) {
        return res.status(400).json({ error: "Ma'lumot yetarli emas" });
      }

      let cart = await Cart.findOne({ userEmail: email });

      if (!cart) {
        cart = new Cart({ userEmail: email, items: [] });
      }

      const existingItem: CartItem | undefined = cart.items.find((item: CartItem) => item.productId.toString() === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, name, price, imageUrl, quantity: 1 });
      }

      await cart.save();
      return res.status(200).json({ message: "Savat yangilandi" });
    }

    if (req.method === "DELETE") {
      const { email, productId } = req.body;

      if (!email || !productId) {
        return res.status(400).json({ error: "Ma'lumot yetarli emas" });
      }

      let cart = await Cart.findOne({ userEmail: email });

      if (cart) {
        cart.items = cart.items.filter((item: CartItem) => item.productId.toString() !== productId);
        await cart.save();
      }

      return res.status(200).json({ message: "Mahsulot o`chirildi" });
    }

    return res.status(405).json({ error: "Noto`g`ri metod" });
  } catch (error) {
    console.error("API xatosi:", error);
    return res.status(500).json({ error: "Server xatosi" });
  }
}
