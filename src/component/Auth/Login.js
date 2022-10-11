import React, { useState } from "react";
import {
  Flex,
  VStack,
  Text,
  Input,
  Button,
  FormLabel,
  FormControl,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { useGlobalContext } from "../../context";
import AlertComponent from "../AlertComponent";
import GoogleLogin from "react-google-login";
import axios from "axios";

const Login = () => {
  const history = useHistory();

  const { setMessage, setcloseAlert, closeAlert, serverMessage, saveUser } =
    useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);

  const [forms, setForms] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForms({ ...forms, [name]: value });
  };

  const responseSuccessGoogle = async (data) => {
    try {
      const response = await axios.post(`/api/auth/google-login`, {
        tokenId: data?.tokenId,
      });
      saveUser(response.data.data);
      setMessage("success", "Redirecting...");
      setTimeout(() => {
        history.push("/chats");
      }, 2000);
    } catch (error) {
      setMessage("error", error.response.data.msg);
    }
  };

  const responseErrorGoogle = (response) => {
    console.log(response);
  };

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    setIsLoading(true);

    if (forms.email === "" || forms.password === "") {
      setMessage("error", "Please fill all the fields");
      setcloseAlert(true);
      setIsLoading(false);
      return;
    }

    const formsData = {
      email: forms.email,
      password: forms.password,
    };

    await axios
      .post("/api/auth/login", formsData)
      .then((res) => {
        setMessage("success", "Redirecting...");
        setForms({
          email: "",
          password: "",
        });
        saveUser(res.data.data);
        setTimeout(() => {
          history.push("/chats");
        }, 2000);
      })
      .catch((err) => {
        setMessage("error", err.response.data.msg);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {closeAlert && (
        <AlertComponent
          setcloseAlert={setcloseAlert}
          message={serverMessage.message}
          status={serverMessage.status}
        />
      )}
      <VStack spacing="20px">
        <FormControl id="email">
          <FormLabel>Username</FormLabel>
          <Input
            name="email"
            placeholder="email"
            value={forms.email}
            type="email"
            onChange={(e) => handleChange(e)}
          />
        </FormControl>
        <FormControl id="Password">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              placeholder="Enter  password"
              type={show ? "text" : "password"}
              value={forms.password}
              onChange={(e) => handleChange(e)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          mt={4}
          isLoading={isLoading}
          loadingText="Please wait..."
          style={{ marginTop: 15 }}
          onClick={handleSubmit}
        >
          Login
        </Button>
        <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <button
              className="loginBtn loginBtn--google"
              onClick={renderProps.onClick}
            >
              Login with Google
            </button>
          )}
        />

        <Flex py="10px" alignItems="center" justifyContent="center">
          <Text>forgot your password?</Text>
          <Link
            style={{
              marginLeft: ".5rem",
              color: "blue",
              textDecoration: "underline",
            }}
            to="/forgot-password"
          >
            Reset Password
          </Link>
        </Flex>
      </VStack>
    </>
  );
};

export default Login;
