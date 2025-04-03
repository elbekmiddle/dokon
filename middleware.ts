import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Admin yo'llarini himoya qilish
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.admin === true;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ['/admin/:path*', '/profile'],
};