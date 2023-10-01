import ky from 'ky'

import { WishlistItem } from '@/models/wishlist'

export const WishlistService = {
  async getWishlistItems() {
    return await ky.get('/api/wishlist').json<WishlistItem[]>()
  },
  async addNewWishlistItem(payload: WishlistItem) {
    return ky
      .post('/api/wishlist/add-item', {
        json: payload,
      })
      .json<WishlistItem>()
  },
  async updateItem(payload: WishlistItem) {
    const { id, ...item } = payload

    return ky
      .put(`/api/items/${id}`, {
        json: item,
      })
      .json<WishlistItem>()
  },
  async deleteWishlistItem(id: string) {
    return ky.delete(`/api/items/${id}`).json()
  },
}
