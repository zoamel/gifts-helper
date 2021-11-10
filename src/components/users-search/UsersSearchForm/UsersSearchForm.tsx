import {
  FormControl,
  FormLabel,
  Input,
  Button,
  chakra,
  FormErrorMessage,
  HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useForm, SubmitHandler } from 'react-hook-form'

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
      <HStack
        spacing={2}
        alignItems={!!errors.searchPhrase ? 'center' : 'flex-end'}
      >
        <FormControl
          id="new-item-name"
          isInvalid={!!errors.searchPhrase}
          isRequired
        >
          <FormLabel>{t('users-search:searchFieldLabel')}</FormLabel>
          <Input
            autoComplete="autocomplete"
            size="lg"
            borderColor="teal.600"
            focusBorderColor="teal.700"
            placeholder={t('users-search:searchFieldPlaceholder')}
            {...register('searchPhrase', {
              required: t('forms:fieldRequired') as string,
              minLength: {
                value: 2,
                message: t('forms:fieldMinLength', { value: 2 }),
              },
            })}
          />
          <FormErrorMessage>
            {errors.searchPhrase && errors.searchPhrase.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={3}
          colorScheme="teal"
          type="submit"
          size="lg"
          disabled={requestInProgress}
        >
          {t('users-search:search')}
        </Button>
      </HStack>
    </chakra.form>
  )
}
