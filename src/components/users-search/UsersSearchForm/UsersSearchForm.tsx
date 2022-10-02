import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  chakra,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  onSearch: (phrase: string) => void
  requestInProgress: boolean
}

type FormInputs = {
  searchPhrase: string
}

export const UsersSearchForm = ({ onSearch, requestInProgress }: Props) => {
  const { t } = useTranslation(['users-search', 'forms', 'common'])

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
          <FormLabel>{t('users-search:searchFieldLabel')}</FormLabel>
          <Input
            autoComplete="autocomplete"
            size="lg"
            borderColor="cyan.600"
            focusBorderColor="cyan.700"
            placeholder={t('users-search:searchFieldPlaceholder')}
            {...register('searchPhrase', {
              required: t('forms:fieldRequired') as string,
              minLength: {
                value: 3,
                message: t('forms:fieldMinLength', { value: 3 }),
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
          {t('users-search:search')}
        </Button>
      </HStack>

      {errors.searchPhrase && errors.searchPhrase.message && (
        <Text color="red">{errors.searchPhrase.message}</Text>
      )}
    </chakra.form>
  )
}
