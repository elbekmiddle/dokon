import NextAuth, { Session, User as NextAuthUser, CustomUser } from "next-auth";

declare module "next-auth" {
  interface CustomUser extends NextAuthUser {
    admin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    } & CustomUser;
  }
}
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

import User from "@/model/user";
import connectDB from "@/lib/mongodb";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 kun
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          await connectDB(process.env.MONGODB_URI || "");

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email va parol majburiy");
          }

          const user = await User.findOne({ email: credentials.email })
            .select("+password")
            .lean() as unknown as { _id: string; email: string; name?: string; password?: string; admin?: boolean };

          if (!user || !user.password) {
            throw new Error("Noto`g`ri ma`lumotlar");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Noto`g`ri ma`lumotlar");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || "",
            admin: !!user.admin, // ✅ to'g'rilandi
            role: user.admin ? "admin" : "user", // Add missing property
            isAdmin: !!user.admin, // Add missing property
          } as unknown as NextAuthUser; // Ensure it matches the expected User type
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Autentifikatsiya muvaffaqiyatsiz");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = !!(user as CustomUser).admin; // Ensures admin is treated as a boolean
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      session.user = {
        id: token.userId as string,
        email: token.email as string,
        name: token.name as string || "",
        isAdmin: !!token.isAdmin, // ✅ to'g'rilandi
        role: token.isAdmin ? "admin" : "user", // Add role property
      };
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("[NextAuth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth][warn]", code);
    },
    debug(code, metadata) {
      console.debug("[NextAuth][debug]", code, metadata);
    },
  },
});

export { handler as GET, handler as POST };
