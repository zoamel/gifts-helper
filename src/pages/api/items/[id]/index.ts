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

  if (req.method === 'PATCH') {
    const { id } = req.query

    const itemId = typeof id === 'string' ? id : id?.[0]

    const foundItem = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        wishlist: {
          select: {
            owner: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    })

    if (!foundItem) {
      res.statusMessage = 'Item not found'
      return res.status(404)
    }

    if (foundItem?.wishlist.owner.email === session?.user?.email) {
      const response = await prisma.item.update({
        where: {
          id: itemId,
        },
        data: req.body,
      })

      res.send(response)
    } else {
      res.statusMessage = `Authenticated user is not owner of this item`
      return res.status(403)
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query

    const itemId = typeof id === 'string' ? id : id?.[0]

    const deletedItem = await prisma.item.delete({ where: { id: itemId } })

    if (deletedItem) {
      res.status(200).send(deletedItem)
    } else {
      res.status(204)
    }
  }
}
