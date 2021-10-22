import {
  ClipboardListIcon,
  SearchIcon,
  ViewListIcon,
} from '@heroicons/react/outline'

export const MENU_ITEMS = [
  {
    href: '/wishlist',
    label: 'My Wishlist',
    icon: ClipboardListIcon,
  },
  {
    href: '/shopping-list',
    label: 'My Shopping List',
    icon: ViewListIcon,
  },
  {
    href: '/users-search',
    label: 'Other Users',
    icon: SearchIcon,
  },
]
