import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import prisma from '@/lib/prisma'

export const getWishlistSelect = {
  id: true,
  name: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      name: true,
      description: true,
      url: true,
      updatedAt: true,
      createdAt: true,
    },
  },
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401)
  }

  if (req.method === 'GET') {
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        owner: { email: session?.user?.email },
      },
      select: getWishlistSelect,
    })

    if (!wishlist) {
      res.status(404)
    } else {
      res.send(wishlist)
    }
  } else if (req.method === 'POST') {
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        owner: { email: session?.user?.email },
      },
    })

    if (wishlist) {
      res.statusMessage = 'This use already have 1 wishlist'
      return res.status(409)
    }

    const { name } = req.body

    const createdWishlist = await prisma.wishlist.create({
      data: {
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: { connect: { email: session?.user?.email! } },
      },
    })

    res.status(201)
    res.send(createdWishlist)
  }

  res.end()
}
