import { useState, useEffect } from 'react'
import {
  Heading,
  Box,
  Text,
  HStack,
  VStack,
  Link,
  IconButton,
  Icon,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Progress,
} from '@chakra-ui/react'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useSession, getSession } from 'next-auth/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { LinkIcon } from '@heroicons/react/outline'
import axios from 'axios'

import giftImage from '../../../public/images/giftbox.png'
import { MainLayout, ListContainer, ListItem } from '../../components/ui'
import { User } from '../../models/users'
import prisma from '../../lib/prisma'

type Props = {
  user: User | null
}

const User = ({ user }: Props) => {
  const router = useRouter()
  const { id } = router.query

  const { t } = useTranslation(['common'])

  if (router.isFallback) {
    return (
      <MainLayout>
        <Progress isIndeterminate colorScheme="teal" size="xs" />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Box mb={6} pb={3} borderBottomWidth="2px" borderBottomStyle="dashed">
        <Breadcrumb fontWeight="medium" fontSize="md">
          <BreadcrumbItem>
            <NextLink href="/users-search" passHref>
              <BreadcrumbLink>{t('otherUsers')}</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{user?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      {user && (
        <>
          <HStack alignItems="center" spacing={3}>
            <Avatar name={user.name} src={user.image} />
            <Heading>{user.name}</Heading>
            <Box flex={1} />
          </HStack>

          <Box mt={8}>
            <ListContainer>
              {user.wishlists[0]?.items.map((item) => (
                <ListItem key={item.id}>
                  <VStack alignItems="flex-start">
                    <HStack alignItems="center" spacing={2}>
                      <Image
                        src={giftImage}
                        width={20}
                        height={20}
                        alt="present"
                      />
                      <Text fontSize="xl">{item.name}</Text>
                    </HStack>

                    {item.description && (
                      <Text fontSize="sm" color="gray.600">
                        {item.description}
                      </Text>
                    )}
                  </VStack>

                  <HStack spacing={4}>
                    {item.url && (
                      <Link href={item.url} isExternal>
                        <IconButton
                          aria-label="link to user"
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          icon={<Icon fontSize={20} as={LinkIcon} />}
                        />
                      </Link>
                    )}
                  </HStack>
                </ListItem>
              ))}
            </ListContainer>
          </Box>
        </>
      )}
    </MainLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({})

  const paths = users.map((user) => ({
    params: { id: user.id },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const userId = context.params?.id as string | null

  let user = null

  if (userId) {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wishlists: {
          select: {
            id: true,
            name: true,
            items: {
              select: {
                id: true,
                name: true,
                description: true,
                url: true,
              },
            },
          },
        },
      },
    })
  }

  return {
    props: {
      user,
      ...(await serverSideTranslations(context.locale ?? 'pl', [
        'common',
        'forms',
        'users-search',
      ])),
    },
    revalidate: 60,
  }
}

export default User
