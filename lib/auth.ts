// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb-adapter";
import connectDB from "./mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/model/user";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        try {
          const user = await User.findOne({ email: credentials?.email });
          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials?.password || "", 
            user.password
          );

          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user"
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.admin = token.role === "admin";
      }
      return session;
    }
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};