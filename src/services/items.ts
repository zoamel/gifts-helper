import { httpClient } from '@/lib/httpClient'
import { ShoppingListItemStatus } from '@/models/wishlist'

export const ItemsService = {
  async changeItemStatus(itemId: string, status: ShoppingListItemStatus) {
    const response = await httpClient.patch(
      `/api/items/${itemId}/change-status`,
      {
        json: {
          status,
        },
      },
    )

    return response
  },

  async removeItemFromShoppingList(itemId: string) {
    const response = await httpClient.delete(
      `/api/items/${itemId}/change-status`,
    )

    return response
  },
}
