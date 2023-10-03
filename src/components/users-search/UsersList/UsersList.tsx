import { Avatar, HStack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { ListContainer, ListItem } from '@/components/ui'
import { User } from '@/models/users'

type Props = {
  users: User[]
}
export const UsersList = ({ users }: Props) => {
  const router = useRouter()

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
