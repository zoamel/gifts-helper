import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import prisma from '@/lib/prisma'
import { WishlistItem } from '@/models/wishlist'

import { getWishlistSelect } from './index'

type AddItemPayload = {
  item: WishlistItem
  wishlistId: string
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { item, wishlistId } = req.body as AddItemPayload

  const session = await getSession({ req })

  if (session) {
    await prisma.item.create({
      data: {
        name: item.name,
        url: item.url,
        description: item.url,
        createdAt: new Date(),
        updatedAt: new Date(),
        wishlistId,
      },
    })

    const updatedWishlist = await prisma.wishlist.update({
      where: {
        id: wishlistId,
      },
      data: {
        updatedAt: new Date(),
      },
      select: getWishlistSelect,
    })

    res.send(updatedWishlist)
  } else {
    // Not Signed in
    res.status(401)
  }

  res.end()
}
