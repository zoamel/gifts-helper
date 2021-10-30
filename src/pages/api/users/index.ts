import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401)
  }

  const { q } = req.query

  const searchQuery = typeof q === 'string' ? q : q[0]

  const foundUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchQuery,
          },
        },
        {
          email: {
            contains: searchQuery,
          },
        },
      ],
    },
  })

  res.send(foundUsers)
}
