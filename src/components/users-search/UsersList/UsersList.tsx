import { Avatar, HStack, Heading, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

import { ListContainer, ListItem } from '@/components/ui'
import { FollowListUser } from '@/models/followers'

type Props = {
  users:
    | {
        accepted: FollowListUser[]
        pending: FollowListUser[]
        rejected: FollowListUser[]
      }
    | FollowListUser[]
}
export const UsersList = ({ users }: Props) => {
  const router = useRouter()
  const t = useTranslations('FriendsList')

  if (Array.isArray(users)) {
    return (
      <ListContainer mt={8}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            justifyContent="space-between"
            alignItems="center"
            cursor="pointer"
            onClick={() => router.push(`/user/${user.id}`)}
          >
            <HStack spacing={2} alignItems="center">
              <Avatar name={user.name} src={user.image} size="md" />
              <Text fontSize="xl">{user.name}</Text>
            </HStack>
          </ListItem>
        ))}
      </ListContainer>
    )
  }

  return (
    <>
      <ListContainer mb={8}>
        {users.accepted.map((user) => (
          <ListItem
            key={user.id}
            justifyContent="space-between"
            alignItems="center"
            cursor="pointer"
            onClick={() => router.push(`/user/${user.id}`)}
          >
            <HStack spacing={2} alignItems="center">
              <Avatar name={user.name} src={user.image} size="md" />
              <Text fontSize="xl">{user.name}</Text>
            </HStack>
          </ListItem>
        ))}
      </ListContainer>

      {users.pending.length > 0 && (
        <>
          <Heading size="md">{t('pending')}</Heading>
          <ListContainer mt={2} mb={8}>
            {users.pending.map((user) => (
              <ListItem
                key={user.id}
                justifyContent="space-between"
                alignItems="center"
                cursor="pointer"
                onClick={() => router.push(`/user/${user.id}`)}
              >
                <HStack spacing={2} alignItems="center">
                  <Avatar name={user.name} src={user.image} size="md" />
                  <Text fontSize="xl">{user.name}</Text>
                </HStack>
              </ListItem>
            ))}
          </ListContainer>
        </>
      )}

      {users.rejected.length > 0 && (
        <>
          <Heading size="md">{t('rejected')}</Heading>
          <ListContainer mt={8}>
            {users.rejected.map((user) => (
              <ListItem
                key={user.id}
                justifyContent="space-between"
                alignItems="center"
                cursor="pointer"
                onClick={() => router.push(`/user/${user.id}`)}
              >
                <HStack spacing={2} alignItems="center">
                  <Avatar name={user.name} src={user.image} size="md" />
                  <Text fontSize="xl">{user.name}</Text>
                </HStack>
              </ListItem>
            ))}
          </ListContainer>
        </>
      )}
    </>
  )
}
