import React from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type Props = {
  isOpened: boolean
  onCancel: () => void
  onConfirm: () => void
}

const DeleteItemConfirmation = React.forwardRef<HTMLButtonElement, Props>(
  ({ isOpened, onCancel, onConfirm }: Props, ref) => {
    const { t } = useTranslation(['common', 'wishlist'])

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
              {t('wishlist:deleteConfirmationTitle')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('wishlist:deleteConfirmationDescription')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" onClick={onConfirm}>
                {t('delete')}
              </Button>
              <Button ref={ref} onClick={onCancel} ml={4}>
                {t('cancelAndClose')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    )
  }
)

DeleteItemConfirmation.displayName = 'DeleteItemConfirmation'

export { DeleteItemConfirmation }
