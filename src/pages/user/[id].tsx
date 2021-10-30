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
  BreadcrumbSeparator,
  Divider,
} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import NextLink from 'next/link'

import giftImage from '../../../public/images/giftbox.png'
import { MainLayout, ListContainer, ListItem } from '../../components/ui'
import { User } from '../../models/users'
import prisma from '../../lib/prisma'
import { LinkIcon } from '@heroicons/react/outline'

type Props = {
  user: User
}

const User = ({ user }: Props) => {
  const { t } = useTranslation(['common'])

  if (!user) {
    return (
      <MainLayout>
        <Text color="red" size="lg">
          No User Found
        </Text>
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
            <BreadcrumbLink>{user.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <HStack alignItems="center">
        <Avatar name={user.name} src={user.image} />
        <Heading>{user.name}</Heading>
      </HStack>

      <Box mt={8}>
        <ListContainer>
          {user.wishlists[0]?.items.map((item) => (
            <ListItem key={item.id}>
              <VStack alignItems="flex-start">
                <HStack alignItems="center" spacing={2}>
                  <Image src={giftImage} width={20} height={20} alt="present" />
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
                      aria-label={t('wishlist:urlButtonLabel')}
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
    </MainLayout>
  )
}

export async function getStaticPaths() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  })

  const paths = users.map((user) => ({
    params: { id: user.id },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const userId = params?.id

  let foundUser = null

  if (userId) {
    foundUser = await prisma.user.findUnique({
      where: {
        id: userId as string,
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
      user: foundUser,
      ...(await serverSideTranslations(locale ?? 'pl', [
        'common',
        'forms',
        'users-search',
      ])),
    },
  }
}

export default User
