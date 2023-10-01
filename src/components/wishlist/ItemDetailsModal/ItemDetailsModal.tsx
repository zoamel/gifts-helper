import { useEffect } from 'react'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  chakra,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { SubmitHandler, useForm } from 'react-hook-form'

import { WishlistItem } from '@/models/wishlist'

type Props = {
  item: WishlistItem | null
  isOpened: boolean
  saveInProgress: boolean
  onClose: () => void
  onSave: (item: WishlistItem) => void
}

type FormInputs = Omit<WishlistItem, 'id'>

export const ItemDetailsModal = ({
  item,
  isOpened,
  saveInProgress,
  onClose,
  onSave,
}: Props) => {
  const t = useTranslations()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormInputs>()

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description,
        url: item.url,
      })
    }
  }, [item, reset])

  const onSubmit: SubmitHandler<FormInputs> = (values) => {
    const payload: WishlistItem = {
      id: item?.id,
      ...values,
    }

    onSave(payload)
  }

  return (
    <Modal isOpen={isOpened} onClose={onClose} size="xl">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{t('Wishlist.itemEditModalTitle')}</ModalHeader>
        <ModalCloseButton />

        <chakra.form onSubmit={handleSubmit(onSubmit)} width="full" noValidate>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="item-name" isInvalid={!!errors.name} isRequired>
                <FormLabel>{t('Common.itemName')}</FormLabel>
                <Input
                  borderColor="cyan.600"
                  focusBorderColor="cyan.700"
                  placeholder={t('Wishlist.newItemPlaceholder')}
                  {...register('name', {
                    required: t('Forms.fieldRequired') as string,
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl id="item-url">
                <FormLabel>{t('Common.itemURL')}</FormLabel>
                <Input
                  borderColor="cyan.600"
                  focusBorderColor="cyan.700"
                  placeholder={t('Wishlist.itemURLPlaceholder')}
                  {...register('url')}
                />
              </FormControl>

              <FormControl id="item-description">
                <FormLabel>{t('Common.itemDescription')}</FormLabel>
                <Textarea
                  borderColor="cyan.600"
                  focusBorderColor="cyan.700"
                  placeholder={t('Wishlist.itemDescriptionPlaceholder')}
                  {...register('description')}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="pink"
              type="submit"
              mr={3}
              isLoading={saveInProgress}
            >
              {t('Common.save')}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={saveInProgress}>
              {t('Common.cancelAndClose')}
            </Button>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  )
}
