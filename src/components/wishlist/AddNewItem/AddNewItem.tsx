import {
  FormControl,
  FormLabel,
  Input,
  Button,
  chakra,
  FormErrorMessage,
  Flex,
  HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useForm, SubmitHandler } from 'react-hook-form'

import { WishlistItem } from '../../../models/wishlist'
import { Card } from '../../ui'

type Props = {
  onAddNewItem: (item: WishlistItem) => void
  requestInProgress: boolean
}

type FormInputs = {
  itemName: string
}

export const AddNewItem = ({ onAddNewItem, requestInProgress }: Props) => {
  const { t } = useTranslation(['wishlist', 'forms'])

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const payload: WishlistItem = {
      name: data.itemName,
    }

    onAddNewItem(payload)
    reset()
  }

  return (
    <chakra.form
      onSubmit={handleSubmit(onSubmit)}
      width="full"
      noValidate
      pb={6}
    >
      <HStack
        spacing={2}
        alignItems={!!errors.itemName ? 'center' : 'flex-end'}
      >
        <FormControl
          id="new-item-name"
          isInvalid={!!errors.itemName}
          isRequired
        >
          <FormLabel>{t('wishlist:newItemLabel')}</FormLabel>
          <Input
            size="lg"
            borderColor="teal.600"
            focusBorderColor="teal.700"
            placeholder={t('wishlist:newItemPlaceholder')}
            {...register('itemName', {
              required: t('forms:fieldRequired') as string,
            })}
          />
          <FormErrorMessage>
            {errors.itemName && errors.itemName.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={3}
          colorScheme="teal"
          type="submit"
          size="lg"
          disabled={requestInProgress}
        >
          {t('forms:newItemSubmit')}
        </Button>
      </HStack>
    </chakra.form>
  )
}
