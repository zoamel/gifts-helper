import { httpClient } from '@/lib/httpClient'
import { WishlistItem } from '@/models/wishlist'

export const WishlistService = {
  async getWishlistItems() {
    return await httpClient.get('/api/wishlist').json<WishlistItem[]>()
  },
  async addNewWishlistItem(payload: WishlistItem) {
    return httpClient
      .post('/api/wishlist/add-item', {
        json: payload,
      })
      .json<WishlistItem>()
  },
  async updateItem(payload: WishlistItem) {
    const { id, ...item } = payload

    return httpClient
      .put(`/api/items/${id}`, {
        json: item,
      })
      .json<WishlistItem>()
  },
  async deleteWishlistItem(id: string) {
    return httpClient.delete(`/api/items/${id}`).json()
  },
}
