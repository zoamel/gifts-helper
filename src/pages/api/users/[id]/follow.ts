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
          create: [{ followerId: authUser?.id as string, status: 'PENDING' }],
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
