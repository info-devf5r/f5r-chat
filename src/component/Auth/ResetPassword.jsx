import React from "react";
import {
  Button,
  FormLabel,
  FormControl,
  Box,
  VStack,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import AlertComponent from "../AlertComponent";
import { useGlobalContext } from "../../context";
import Header from "../Header";
import queryString from "query-string";
import axios from "axios";

const ResetPassword = () => {
  const { search } = useLocation();
  const params = queryString.parse(search);
  const { setMessage, setcloseAlert, closeAlert, serverMessage } =
    useGlobalContext();
  const [isLoading, setIsloading] = React.useState(false);

  const [password, setPassword] = React.useState("");

  const getPasswordLink = async () => {
    setIsloading(true);
    if (!password) {
      setMessage("error", "Please enter your new password");
      setIsloading(false);
      setcloseAlert(true);
      return;
    }

    await axios
      .post("/api/auth/reset-password", {
        password,
        passwordToken: params.token,
        email: params.email,
      })
      .then((res) => {
        setMessage("success", res.data.msg);
        setPassword("");
      })
      .catch((err) => {
        setMessage("error", err.response.data.msg);
      })
      .finally(() => setIsloading(false));
  };
  return (
    <Header>
      <VStack mt="2rem" maxW="500px" mx="auto" w="100%" p={5} boxShadow="lg">
        {closeAlert && (
          <Box w="100%" mb="2rem">
            <AlertComponent
              setcloseAlert={setcloseAlert}
              message={serverMessage.message}
              status={serverMessage.status}
            />
          </Box>
        )}
        <Heading mb="2rem" fontWeight="400" size="lg">
          Reset Password
        </Heading>
        <Box w="100%">
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
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
            Reset Password
          </Button>
        </Box>
      </VStack>
    </Header>
  );
};

export default ResetPassword;
