import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import prisma from '@/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401)
  }

  if (req.method === 'GET') {
    const wishListItems = await prisma.item.findMany({
      where: {
        wishlist: {
          owner: {
            email: session?.user?.email,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
      },
    })

    res.send(wishListItems)
  }

  res.end()
}
