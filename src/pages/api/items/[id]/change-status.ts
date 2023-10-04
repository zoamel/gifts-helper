import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'

import { authOptions } from '../../auth/[...nextauth]'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401)
  }

  const { id } = req.query
  const { status } = req.body

  const itemId = typeof id === 'string' ? id : id?.[0]

  const authUser = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  })

  if (req.method === 'PATCH' || req.method === 'POST') {
    const userShoppingList = await prisma.shoppingList.findUnique({
      where: {
        ownerId: authUser!.id,
      },
    })

    let shoppingListId: string

    if (!userShoppingList) {
      const newShoppingList = await prisma.shoppingList.create({
        data: {
          ownerId: authUser!.id,
        },
      })

      shoppingListId = newShoppingList.id
    } else {
      shoppingListId = userShoppingList.id
    }

    const response = await prisma.shoppingListItems.upsert({
      where: {
        shoppingListId_itemId: {
          shoppingListId,
          itemId: itemId!,
        },
      },
      create: {
        itemId: itemId!,
        shoppingListId,
        status: status! as 'RESERVED' | 'BOUGHT',
      },
      update: {
        status: status! as 'RESERVED' | 'BOUGHT',
      },
    })

    res.json(response)
  } else if (req.method === 'DELETE') {
    const userShoppingList = await prisma.shoppingList.findUnique({
      where: {
        ownerId: authUser!.id,
      },
    })

    await prisma.shoppingListItems.delete({
      where: {
        shoppingListId_itemId: {
          shoppingListId: userShoppingList!.id,
          itemId: itemId!,
        },
      },
    })

    res.send({ message: 'Item removed from shopping list' })
  }
}
