import {
  Badge,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  useColorMode,
} from "@chakra-ui/react"

const Appearance = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          Appearance
        </Heading>
        <RadioGroup onChange={toggleColorMode} value={colorMode}>
          <Stack>            
            <Radio disabled value="light" colorScheme="teal">
              Light mode
            </Radio>
            <Radio value="dark" colorScheme="teal">
              Dark mode
            </Radio>
          </Stack>
        </RadioGroup>
      </Container>
    </>
  )
}
export default Appearance
