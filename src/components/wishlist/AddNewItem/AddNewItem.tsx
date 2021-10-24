import {
  FormControl,
  FormLabel,
  Input,
  Button,
  chakra,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useForm, SubmitHandler } from 'react-hook-form'

import { WishlistItem } from '../../../models/wishlist'
import { Card } from '../../ui'

type Props = {
  onAddNewItem: (item: WishlistItem) => void
}

type FormInputs = {
  itemName: string
}

export const AddNewItem = ({ onAddNewItem }: Props) => {
  const { t } = useTranslation(['wishlist', 'forms'])

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const payload: WishlistItem = {
      name: data.itemName,
    }

    onAddNewItem(payload)
  }

  return (
    <Card mt={4}>
      <chakra.form onSubmit={handleSubmit(onSubmit)} width="full" noValidate>
        <FormControl
          id="new-item-name"
          isInvalid={!!errors.itemName}
          isRequired
        >
          <FormLabel>{t('wishlist:newItemLabel')}</FormLabel>
          <Input
            size="lg"
            placeholder={t('wishlist:newItemPlaceholder')}
            {...register('itemName', {
              required: t('forms:fieldRequired') as string,
            })}
          />
          <FormErrorMessage>
            {errors.itemName && errors.itemName.message}
          </FormErrorMessage>
        </FormControl>
        <Button mt={3} colorScheme="teal" type="submit">
          {t('forms:newItemSubmit')}
        </Button>
      </chakra.form>
    </Card>
  )
}
