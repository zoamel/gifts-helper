import { FriendsList } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { FollowListUser } from '@/models/followers'

import { authOptions } from '../auth/[...nextauth]'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401)
  }

  if (req.method === 'POST') {
    const { userId, status } = req.body

    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      res.status(400).send('Invalid status')
    }

    const authUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    })

    const updatedFriend = await prisma.friendsList.update({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: authUser?.id as string,
        },
      },
      data: {
        status,
      },
    })

    await prisma.friendsList.upsert({
      where: {
        followerId_followingId: {
          followerId: authUser?.id as string,
          followingId: userId,
        },
      },
      create: {
        followerId: authUser?.id as string,
        followingId: userId,
        status: 'ACCEPTED',
      },
      update: {
        status: 'ACCEPTED',
      },
    })

    res.send(updatedFriend)
  }

  if (req.method === 'GET') {
    const pendingFriendsList = await prisma.friendsList.findMany({
      where: {
        following: {
          email: session?.user?.email as string,
        },
        status: 'PENDING',
      },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    const pendingUsers = pendingFriendsList.reduce((acc, curr) => {
      const follower = curr.follower as FollowListUser

      return [
        ...acc,
        {
          ...follower,
        },
      ]
    }, [] as FollowListUser[])

    res.send(pendingUsers)
  }
}
