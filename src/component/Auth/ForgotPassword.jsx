import React from "react";
import {
  Container,
  Text,
  Button,
  FormLabel,
  FormControl,
  Box,
  Flex,
  VStack,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AlertComponent from "../AlertComponent";
import { useGlobalContext } from "../../context";
import axios from "axios";

const ForgotPassword = () => {
  const { setMessage, setcloseAlert, closeAlert, serverMessage } =
    useGlobalContext();
  const [isLoading, setIsloading] = React.useState(false);

  const [email, setEmail] = React.useState("");

  const getPasswordLink = async () => {
    setIsloading(true);
    if (!email) {
      setMessage("error", "Please enter your email");
      setIsloading(false);
      setcloseAlert(true);
      return;
    }

    await axios
      .post("/api/auth/forgot-password", { email })
      .then((res) => {
        setMessage("success", res.data.msg);
        setEmail("");
      })
      .catch((err) => {
        setMessage("error", err.response.data.msg);
      })
      .finally(() => setIsloading(false));
  };

  return (
    <>
      <Flex w="100%" flexDirection="column">
        <Flex boxShadow="lg" w="100%">
          <Flex
            as="nav"
            p="2rem"
            w="100%"
            maxWidth="1200px"
            justifyContent="flex-start"
            margin="0 auto"
          >
            <Link to="/">
              <Heading cursor="pointer">Chat App</Heading>
            </Link>
          </Flex>
        </Flex>
        <Container w="100%" mt="4rem" maxW="xl">
          {closeAlert && (
            <AlertComponent
              setcloseAlert={setcloseAlert}
              message={serverMessage.message}
              status={serverMessage.status}
            />
          )}

          <VStack w="100%" p={5} boxShadow="lg">
            <Heading mb="2rem" fontWeight="400" size="lg">
              Forgot Password
            </Heading>
            <Box w="100%">
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </FormControl>
              <Button
                mt="2rem"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
                loadingText="please wait..."
                size="sm"
                onClick={() => getPasswordLink()}
              >
                Get Reset Password Link
              </Button>
            </Box>
            <Flex py="10px" alignItems="center" justifyContent="center">
              <Text>Already have an account?</Text>
              <Link
                style={{
                  marginLeft: ".5rem",
                  color: "blue",
                  textDecoration: "underline",
                }}
                to="/"
              >
                Login
              </Link>
            </Flex>
          </VStack>
        </Container>
      </Flex>
    </>
  );
};

export default ForgotPassword;
