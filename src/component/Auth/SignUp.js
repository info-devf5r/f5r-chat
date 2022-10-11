import React, { useState } from "react";
import {
  VStack,
  Input,
  Button,
  FormLabel,
  FormControl,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import AlertComponent from "../AlertComponent";
import { useGlobalContext } from "../../context";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";
import axios from "axios";

const SignUp = () => {
  const { setMessage, saveUser, setcloseAlert, closeAlert, serverMessage } =
    useGlobalContext();
  const history = useHistory();

  const [forms, setForms] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setForms({ ...forms, [name]: value });
  };

  const handleClick = () => setShow(!show);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (
      !forms.name ||
      !forms.email ||
      !forms.password ||
      !forms.confirmPassword
    ) {
      setMessage("error", "Please fill all the fields");
      setcloseAlert(true);
      setIsLoading(false);
      return;
    }

    if (forms.password !== forms.confirmPassword) {
      setMessage("error", "Password and confirm password does not match");
      setcloseAlert(true);
      setIsLoading(false);
      return;
    }

    const formsData = new FormData();
    formsData.append("name", forms.name);
    formsData.append("email", forms.email);
    formsData.append("password", forms.password);
    formsData.append("pic", forms.pic);

    await axios
      .post("/api/auth/register", formsData)
      .then((res) => {
        setMessage("success", res.data.msg);
        setForms({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          pic: null,
        });
      })
      .catch((err) => {
        setMessage("error", err.response.data.msg);
      })
      .finally(() => setIsLoading(false));
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
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            placeholder="Enter your name"
            value={forms.name}
            onChange={(e) => handleChange(e)}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            placeholder="Enter your email"
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
        <FormControl id="ConfirmPassword">
          <FormLabel>ConfirmPassword</FormLabel>
          <InputGroup>
            <Input
              name="confirmPassword"
              placeholder="Confirm password"
              type={show ? "text" : "password"}
              value={forms.confirmPassword}
              onChange={(e) => handleChange(e)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Profile Picture</FormLabel>
          <Input
            type="file"
            name="pic"
            p={1.5}
            accept="image/*"
            onChange={(e) => handleChange(e)}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          mt={4}
          loadingText="Please wait..."
          isLoading={isLoading}
          style={{ marginTop: 15 }}
          onClick={handleSubmit}
        >
          Sign up
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
      </VStack>
    </>
  );
};

export default SignUp;
