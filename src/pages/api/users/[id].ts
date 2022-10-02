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
    const { id } = req.query

    const userId = typeof id === 'string' ? id : id?.[0]

    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
      include: {
        wishlist: {
          select: {
            id: true,
            items: {
              orderBy: {
                createdAt: 'asc',
              },
              select: {
                id: true,
                name: true,
                description: true,
                url: true,
              },
            },
          },
        },
      },
    })

    if (!foundUser) {
      return res.status(404).send({ error: 'User Not Found' })
    }

    res.send(foundUser)
  }
}
