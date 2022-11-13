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

    if (!userShoppingList) {
      await prisma.shoppingList.create({
        data: {
          ownerId: authUser!.id,
        },
      })
    }

    const response = await prisma.shoppingListItems.upsert({
      where: {
        shoppingListId_itemId: {
          shoppingListId: userShoppingList!.id,
          itemId: itemId!,
        },
      },
      create: {
        itemId: itemId!,
        shoppingListId: userShoppingList!.id,
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
