import { httpClient } from '@/lib/httpClient'
import { User } from '@/models/users'

export const UsersService = {
  async search(query: string) {
    return await httpClient.get(`/api/users?query=${query}`).json<User[]>()
  },
  async getUser(id: string) {
    return await httpClient.get(`/api/users/${id}`).json<User>()
  },
  async followUser(id: string) {
    return await httpClient.post(`/api/users/${id}/follow`).json<User>()
  },
  async unfollowUser(id: string) {
    return await httpClient.delete(`/api/users/${id}/follow`).json<User>()
  },
  async getUsersFollowedByMe() {
    return await httpClient.get(`/api/users/following`).json<User[]>()
  },
}
