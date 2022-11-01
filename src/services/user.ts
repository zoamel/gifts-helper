import { httpClient } from '@/lib/httpClient'
import { User } from '@/models/users'

export const UsersService = {
  async search(query: string) {
    const { data } = await httpClient.get<User[]>(`/api/users?query=${query}`)
    return data
  },
  async getUser(id: string) {
    const { data } = await httpClient.get<User>(`/api/users/${id}`)
    return data
  },
  async followUser(id: string) {
    const { data } = await httpClient.post<User>(`/api/users/${id}/follow`)
    return data
  },
  async unfollowUser(id: string) {
    const { data } = await httpClient.delete<User>(`/api/users/${id}/follow`)
    return data
  },
}
