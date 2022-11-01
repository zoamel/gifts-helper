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
  const userId = typeof id === 'string' ? id : id?.[0]

  const authUser = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  })

  if (req.method === 'POST') {
    const alreadyFollowing = await prisma.user.count({
      where: {
        followers: {
          some: {
            follower: {
              id: authUser?.id,
            },
          },
        },
      },
    })

    if (alreadyFollowing) {
      res.status(409).send({ error: 'Already following' })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        followers: {
          create: [{ followerId: authUser?.id as string, status: 'ACCEPTED' }],
        },
      },
    })

    res.send(updatedUser)
  } else if (req.method === 'DELETE') {
    await prisma.friendsList.delete({
      where: {
        followerId_followingId: {
          followerId: authUser?.id as string,
          followingId: userId as string,
        },
      },
    })

    res.send({ message: 'Unfollowed' })
  }
}
