// lib/auth.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import  connectToDatabase  from './mongodb';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    } & CustomUser;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: 'user' | 'admin';
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    role: 'user' | 'admin';
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const mongoose = await connectToDatabase(process.env.MONGODB_URI || '');
          
          const user = await mongoose.connection.collection('users').findOne({ 
            email: credentials.email.toLowerCase().trim()
          });

          if (!user) {
            throw new Error('User not found');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          const isAdmin = user.email === process.env.ADMIN_EMAIL || user.role === 'admin';

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: isAdmin ? 'admin' : 'user',
            isAdmin
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name || '',
        role: token.role,
        isAdmin: token.isAdmin
      };
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

export default NextAuth(authOptions);
export const { auth, signIn, signOut } = NextAuth(authOptions);