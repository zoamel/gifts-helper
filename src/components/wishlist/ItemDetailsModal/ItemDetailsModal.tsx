import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  chakra,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'

import { WishlistItem } from '../../../models/wishlist'

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
  const { t } = useTranslation(['common', 'wishlist'])

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: item?.name ?? '',
      description: item?.description ?? '',
      url: item?.url ?? '',
    },
  })

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
        <ModalHeader>{t('wishlist:itemEditModalTitle')}</ModalHeader>
        <ModalCloseButton />

        <chakra.form onSubmit={handleSubmit(onSubmit)} width="full" noValidate>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="item-name" isInvalid={!!errors.name} isRequired>
                <FormLabel>{t('itemName')}</FormLabel>
                <Input
                  borderColor="teal.600"
                  focusBorderColor="teal.700"
                  placeholder={t('wishlist:newItemPlaceholder')}
                  {...register('name', {
                    required: t('forms:fieldRequired') as string,
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl id="item-url">
                <FormLabel>{t('itemURL')}</FormLabel>
                <Input
                  borderColor="teal.600"
                  focusBorderColor="teal.700"
                  placeholder={t('wishlist:itemURLPlaceholder')}
                  {...register('url')}
                />
              </FormControl>

              <FormControl id="item-description">
                <FormLabel>{t('itemDescription')}</FormLabel>
                <Textarea
                  borderColor="teal.600"
                  focusBorderColor="teal.700"
                  placeholder={t('wishlist:itemDescriptionPlaceholder')}
                  {...register('description')}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              type="submit"
              mr={3}
              isLoading={saveInProgress}
            >
              {t('save')}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={saveInProgress}>
              {t('cancelAndClose')}
            </Button>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  )
}
