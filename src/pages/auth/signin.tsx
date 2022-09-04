import { Fragment } from 'react'

import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { GiftIcon } from '@heroicons/react/24/solid'
import { GetServerSideProps } from 'next'
import { getProviders, signIn } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FcGoogle } from 'react-icons/fc'

import { Card } from '@/components/ui'

type Provider = {
  name: string
  id: string
}

type Props = {
  providers: Provider[]
}

export default function SignIn({ providers }: Props) {
  const { query } = useRouter()
  const callbackUrl = query.callbackUrl as string

  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>{`${t('appName')} | ${t('loginPageTitle')}`}</title>
      </Head>

      <Center height="100vh" background="gray.200">
        <Card minHeight="300px" px={0} py={6}>
          <HStack px={8}>
            <Icon as={GiftIcon} w={9} h={9} color="red.500" />
            <Heading as="h1" size="xl">
              {t('appName')}
            </Heading>
          </HStack>
          <Divider
            mt={2}
            mb={6}
            sx={{
              borderBottomWidth: 1,
              opacity: 1,
              borderColor: 'blackAlpha.500',
            }}
          />
          <HStack justifyContent="center">
            <Box
              width="200px"
              height="200px"
              position="relative"
              mb={6}
              rounded="50%"
              overflow="auto"
            >
              <Image
                src="/images/present_box.png"
                layout="fill"
                alt="present"
              />
            </Box>
          </HStack>
          {/* <form>
          <VStack spacing={4} px={8}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" disabled />
            </FormControl>
            <FormControl>
              <FormLabel>Hasło</FormLabel>
              <Input type="password" disabled />
            </FormControl>

            <Button type="submit">Zaloguj się</Button>
          </VStack>
        </form>
        <Divider
          my={6}
          sx={{
            borderBottomWidth: 1,
            opacity: 1,
            borderColor: 'blackAlpha.500',
          }}
        /> */}
          <VStack>
            {Object.values(providers).map((provider) => (
              <Fragment key={provider.name}>
                {provider.name === 'Google' && (
                  <Button
                    key={provider.name}
                    onClick={() => signIn(provider.id, { callbackUrl })}
                    leftIcon={<FcGoogle />}
                  >
                    <Center>
                      <Text>{t('loginWithGoogle')}</Text>
                    </Center>
                  </Button>
                )}
              </Fragment>
            ))}
          </VStack>
        </Card>
      </Center>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const providers = await getProviders()

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pl', ['common'])),
      providers,
    },
  }
}
