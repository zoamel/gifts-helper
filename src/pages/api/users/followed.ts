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
    const foundUsers = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            follower: {
              email: session?.user?.email as string,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    res.send(foundUsers)
  }
}
