import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session?.user) {
    res.status(401)
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!,
      },
      select: {
        following: {
          select: {
            following: {
              select: {
                id: true,
                image: true,
                name: true,
              },
            },
          },
        },
      },
    })

    res.send(user?.following)
  }
}
