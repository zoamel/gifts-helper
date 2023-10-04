import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'

import { authOptions } from '../auth/[...nextauth]'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

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
        createdAt: 'asc',
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
