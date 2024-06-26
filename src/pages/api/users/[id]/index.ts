import { Wishlist } from '@prisma/client'
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

  if (req.method === 'GET') {
    const { id } = req.query

    const userId = typeof id === 'string' ? id : id?.[0]

    const authUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    })

    if (authUser?.id === userId) {
      return res.send({
        isAuthUser: true,
      })
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
      include: {
        followers: {
          select: {
            follower: {
              select: {
                email: true,
              },
            },
            status: true,
          },
        },
        wishlist: {
          select: {
            id: true,
            visibility: true,
            items: {
              orderBy: {
                createdAt: 'asc',
              },
              select: {
                id: true,
                name: true,
                description: true,
                url: true,
                shoppingLists: {
                  select: {
                    shoppingList: {
                      select: {
                        owner: {
                          select: {
                            email: true,
                          },
                        },
                      },
                    },
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!foundUser) {
      return res.status(404).send({ error: 'User Not Found' })
    }

    const { followers, ...user } = foundUser

    const isFollowedByAuthUser = followers.some((follower) => {
      return follower.follower.email === session?.user?.email
    })

    const followingStatus = followers.find((follower) => {
      return follower.follower.email === session?.user?.email
    })?.status

    let response = {
      id: user.id,
      name: user.name,
      image: user.image,
      wishlist: user.wishlist,
      isFollowedByAuthUser,
      followingStatus,
    }

    if (
      user.wishlist?.visibility === 'PRIVATE' &&
      followingStatus !== 'ACCEPTED'
    ) {
      response.wishlist = {
        id: user.wishlist.id,
        visibility: user.wishlist.visibility,
        items: [],
      }
    }

    if (response.wishlist) {
      response.wishlist.items = response.wishlist.items.map((item) => {
        let additionalInfo = {
          isBoughtByAuthUser: false,
          isBought: false,
        }

        if (
          item.shoppingLists.some(
            (item) =>
              item.shoppingList.owner.email === session?.user?.email &&
              item.status === 'BOUGHT',
          )
        ) {
          additionalInfo.isBoughtByAuthUser = true
        } else if (
          item.shoppingLists.some((item) => item.status === 'BOUGHT')
        ) {
          additionalInfo.isBought = true
        }

        // @ts-ignore
        delete item.shoppingLists

        return {
          ...item,
          ...additionalInfo,
        }
      })
    }

    res.send(response)
  }
}
