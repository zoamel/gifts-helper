import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { WishlistItem } from '@/models/wishlist'

import { authOptions } from '../auth/[...nextauth]'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const item = req.body as WishlistItem

  const session = await getServerSession(req, res, authOptions)

  if (session) {
    const wishlist = await prisma.wishlist.findFirstOrThrow({
      where: {
        owner: {
          email: session.user?.email,
        },
      },
    })

    const createdItem = await prisma.item.create({
      data: {
        name: item.name,
        url: item.url,
        description: item.url,
        createdAt: new Date(),
        updatedAt: new Date(),
        wishlistId: wishlist.id,
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
      },
    })

    await prisma.wishlist.update({
      where: {
        id: wishlist.id,
      },
      data: {
        updatedAt: new Date(),
      },
    })

    res.send(createdItem)
  } else {
    // Not Signed in
    res.status(401)
  }

  res.end()
}
