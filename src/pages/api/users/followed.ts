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
