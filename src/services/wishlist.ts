import axios from 'axios'

import { WishlistItem } from '@/models/wishlist'

export const WishlistService = {
  async getWishlistItems() {
    const { data } = await axios.get<WishlistItem[]>('/api/wishlist')
    return data
  },
}
