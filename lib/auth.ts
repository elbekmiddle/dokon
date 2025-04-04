// lib/auth.js
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/model/user';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email va parol talab qilinadi');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Bunday foydalanuvchi topilmadi');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Noto`g`ri parol');
        }

        return { id: user._id.toString(), email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role
      };
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/auth/login', // Custom login page
  }
};

import { NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
