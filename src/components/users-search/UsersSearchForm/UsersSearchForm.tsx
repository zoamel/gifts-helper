import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  chakra,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  onSearch: (phrase: string) => void
  requestInProgress: boolean
}

type FormInputs = {
  searchPhrase: string
}

export const UsersSearchForm = ({ onSearch, requestInProgress }: Props) => {
  const t = useTranslations()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = (values) => {
    onSearch(values.searchPhrase)
    reset()
  }

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)} width="full" noValidate>
      <HStack spacing={2} alignItems={'flex-end'}>
        <FormControl id="new-item-name" isRequired>
          <FormLabel>{t('UsersSearch.searchFieldLabel')}</FormLabel>
          <Input
            autoComplete="autocomplete"
            size="lg"
            borderColor="cyan.600"
            focusBorderColor="cyan.700"
            placeholder={t('UsersSearch.searchFieldPlaceholder')}
            {...register('searchPhrase', {
              required: t('Forms.fieldRequired') as string,
              minLength: {
                value: 3,
                message: t('Forms.fieldMinLength', { value: 3 }),
              },
            })}
          />
        </FormControl>
        <Button
          mt={3}
          colorScheme="pink"
          type="submit"
          size="lg"
          disabled={requestInProgress}
        >
          {t('UsersSearch.search')}
        </Button>
      </HStack>

      {errors.searchPhrase && errors.searchPhrase.message && (
        <Text color="red">{errors.searchPhrase.message}</Text>
      )}
    </chakra.form>
  )
}
