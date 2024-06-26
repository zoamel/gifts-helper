import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  theme: {
    colorScheme: 'light',
    logo: '/images/logo.svg',
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async createUser(message) {
      if (message.user) {
        await prisma.wishlist.create({
          data: {
            ownerId: message.user.id,
          },
        })
      }
    },
  },
}

export default NextAuth(authOptions)
