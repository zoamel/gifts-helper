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
    const pendingFollowed = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            status: 'PENDING',
            follower: {
              email: session?.user?.email as string,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    const acceptedFollowed = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            status: 'ACCEPTED',
            follower: {
              email: session?.user?.email as string,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    const rejectedFollowed = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            status: 'REJECTED',
            follower: {
              email: session?.user?.email as string,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    res.send({
      pending: pendingFollowed,
      accepted: acceptedFollowed,
      rejected: rejectedFollowed,
    })
  }
}
