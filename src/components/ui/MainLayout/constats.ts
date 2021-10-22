import {
  ClipboardListIcon,
  SearchIcon,
  ViewListIcon,
} from '@heroicons/react/outline'

export const MENU_ITEMS = [
  {
    href: '/wishlist',
    label: 'wishlist',
    icon: ClipboardListIcon,
  },
  {
    href: '/shopping-list',
    label: 'shoppingList',
    icon: ViewListIcon,
  },
  {
    href: '/users-search',
    label: 'otherUsers',
    icon: SearchIcon,
  },
]
