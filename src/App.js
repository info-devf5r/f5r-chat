import { Route, Switch } from "react-router-dom";
import "./App.css";
import ForgotPassword from "./component/Auth/ForgotPassword";
import ResetPassword from "./component/Auth/ResetPassword";
import VerifyEmail from "./component/Auth/VerifyEmail";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import ProtectedRoute from "./utils/ProtectedRoute";
import {
  Box,
  SkeletonText,
  Text,
  SkeletonCircle,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useGlobalContext } from "./context";
import Header from "./component/Header";
import Error from "./component/Error";
import { useState } from "react";
import VideoCall from "./component/chats/VideoCall";

function App() {
  const { fetchLoading } = useGlobalContext();
  const [isOnline] = useState(window.navigator.onLine);

  if (!isOnline) {
    return (
      <Flex
        w="100vw"
        px={2}
        alignItems={"center"}
        h="100vh"
        justifyContent={"center"}
        flexDir={"column"}
        textAlign={"center"}
      >
        <Text>Unfortunately, we are unable to connect to our server</Text>
        <Text>Check that your connected to the internet!</Text>
        <Button
          onClick={() => window.location.reload()}
          mt={5}
          colorScheme={"blue"}
        >
          Reload
        </Button>
      </Flex>
    );
  }

  if (fetchLoading) {
    return (
      <Header>
        <Box
          maxW="500px"
          mt="4rem"
          w="100%"
          padding="6"
          boxShadow="lg"
          bg="white"
          mx="auto"
        >
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </Box>
      </Header>
    );
  }

  return (
    <div className="App">
      {/* <ScrollToTop /> */}
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <ProtectedRoute path="/chats" exact>
          <ChatPage />
        </ProtectedRoute>
        <ProtectedRoute path="/video" exact>
          <VideoCall />
        </ProtectedRoute>
        <Route path="/user/verify-email" exact>
          <VerifyEmail />
        </Route>
        <Route exact path="/user/reset-password">
          <ResetPassword />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
