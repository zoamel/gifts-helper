import { Box, BoxProps } from '@chakra-ui/react'

export const Card = (props: BoxProps) => (
  <Box
    bg="white"
    py="8"
    px={{ base: '4', md: '10' }}
    shadow="lg"
    rounded={{ sm: 'lg' }}
    borderColor="gray.100"
    borderWidth="1px"
    {...props}
  />
)
