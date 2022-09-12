import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import prisma from '../../../lib/prisma'

export default NextAuth({
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
  callbacks: {
    async signIn({ user }) {
      const userWishlists = await prisma.wishlist.count({
        where: {
          ownerId: user.id,
        },
      })

      if (userWishlists === 0) {
        await prisma.wishlist.create({
          data: {
            ownerId: user.id,
          },
        })
      }

      return true
    },
  },
})
