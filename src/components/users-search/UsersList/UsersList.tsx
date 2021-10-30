import { Text, Progress, Button, Avatar, HStack } from '@chakra-ui/react'
import NextLink from 'next/link'

import { User } from '../../../models/users'
import { ListItem, ListContainer } from '../../ui'
import { useTranslation } from 'next-i18next'

type Props = {
  users: User[]
  requestInProgress: boolean
}
export const UsersList = ({ users, requestInProgress }: Props) => {
  const { t } = useTranslation(['users-search'])

  if (requestInProgress) {
    return <Progress isIndeterminate colorScheme="teal" size="xs" mt={2} />
  }
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
            <Button colorScheme="teal" variant="outline">
              {t('users-search:visitProfile')}
            </Button>
          </NextLink>
        </ListItem>
      ))}
    </ListContainer>
  )
}
