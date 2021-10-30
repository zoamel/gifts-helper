import { Text, Progress } from '@chakra-ui/react'

import { User } from '../../../models/users'
import { ListItem, ListContainer } from '../../ui'

type Props = {
  users: User[]
  requestInProgress: boolean
}
export const UsersList = ({ users, requestInProgress }: Props) => {
  if (requestInProgress) {
    return <Progress isIndeterminate colorScheme="teal" size="xs" mt={2} />
  }
  return (
    <ListContainer mt={8}>
      {users.map((user) => (
        <ListItem key={user.id}>
          <Text>{user.name}</Text>
        </ListItem>
      ))}
    </ListContainer>
  )
}
