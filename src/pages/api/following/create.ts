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

  if (req.method === 'POST') {
    const { userToFollowId } = req.body

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!,
      },
    })

    const existingFollowups = await prisma.follows.findMany({
      where: {
        followerId: currentUser?.id,
        followingId: userToFollowId,
      },
    })

    const isExistingFollowup = existingFollowups.length > 0

    if (!isExistingFollowup) {
      const createdFollowup = await prisma.follows.create({
        data: {
          followerId: currentUser?.id!,
          followingId: userToFollowId,
        },
      })

      res.status(200).send(createdFollowup)
    } else {
      res.status(409).send({ error: 'This followup already exist' })
    }
  }
}
