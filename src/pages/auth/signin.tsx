import { Fragment } from 'react'

import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Hide,
  Icon,
  Input,
  Show,
  Stack,
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
import { AiOutlineGoogle } from 'react-icons/ai'
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
    <Box height="100vh">
      <Head>
        <title>{`${t('appName')} | ${t('loginPageTitle')}`}</title>
      </Head>

      <Stack height="100%" direction={{ base: 'column', md: 'row' }}>
        <Show above="md">
          <Center height="100%" width="50%">
            <AspectRatio
              width="100%"
              maxWidth="800px"
              ratio={4 / 3}
              position="relative"
            >
              <Image
                src="/images/login_image.svg"
                layout="fill"
                alt="gift"
                priority
              />
            </AspectRatio>
          </Center>
        </Show>

        <VStack
          width={{ base: '100%', md: '50%' }}
          height="100%"
          backgroundColor="blackAlpha.50"
          justifyContent={{ base: 'flex-start', md: 'center' }}
        >
          <Hide above="md">
            <Image
              src="/images/login_image.svg"
              width="200px"
              height="200px"
              alt="gift"
              priority
            />
          </Hide>
          <Heading as="h1" size="lg">
            {t('appName')}
          </Heading>
          <Text pt={3}>{t('loginGreetings')}</Text>

          <VStack pt={8}>
            {Object.values(providers).map((provider) => (
              <Fragment key={provider.name}>
                {provider.name === 'Google' && (
                  <Button
                    size="lg"
                    variant="outline"
                    colorScheme="red"
                    key={provider.name}
                    onClick={() => signIn(provider.id, { callbackUrl })}
                    leftIcon={<Icon as={AiOutlineGoogle} />}
                  >
                    <Center>
                      <Text>{t('loginWithGoogle')}</Text>
                    </Center>
                  </Button>
                )}
              </Fragment>
            ))}
          </VStack>
        </VStack>
      </Stack>
    </Box>
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
