import { Avatar, Button, HStack, Progress, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'

import { ListContainer, ListItem } from '@/components/ui'
import { User } from '@/models/users'

type Props = {
  users: User[]
}
export const UsersList = ({ users }: Props) => {
  const { t } = useTranslation(['users-search'])

  return (
    <ListContainer mt={8}>
      {users.map((user) => (
        <ListItem
          key={user.id}
          cursor="pointer"
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack spacing={2} alignItems="center">
            <Avatar name={user.name} src={user.image} size="md" />
            <Text fontSize="xl">{user.name}</Text>
          </HStack>

          <NextLink href={`/user/${encodeURIComponent(user.id)}`} passHref>
            <Button colorScheme="cyan" variant="outline">
              {t('users-search:visitProfile')}
            </Button>
          </NextLink>
        </ListItem>
      ))}
    </ListContainer>
  )
}
