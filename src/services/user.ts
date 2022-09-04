import { httpClient } from '@/lib/httpClient'
import { User } from '@/models/users'

export const UsersService = {
  async getUser(id: string) {
    const { data } = await httpClient.get<User>(`/api/users/${id}`)
    return data
  },
}
