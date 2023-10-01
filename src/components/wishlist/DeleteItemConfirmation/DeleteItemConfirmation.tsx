import React from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

type Props = {
  isOpened: boolean
  onCancel: () => void
  onConfirm: () => void
}

const DeleteItemConfirmation = React.forwardRef<HTMLButtonElement, Props>(
  ({ isOpened, onCancel, onConfirm }: Props, ref) => {
    const t = useTranslations()

    return (
      <AlertDialog
        isOpen={isOpened}
        // @ts-ignore
        leastDestructiveRef={ref}
        onClose={onCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('Wishlist.deleteConfirmationTitle')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('Wishlist.deleteConfirmationDescription')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" onClick={onConfirm}>
                {t('Common.delete')}
              </Button>
              <Button ref={ref} onClick={onCancel} ml={4}>
                {t('Common.cancelAndClose')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    )
  },
)

DeleteItemConfirmation.displayName = 'DeleteItemConfirmation'

export { DeleteItemConfirmation }
