/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Container,
  VStack,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Flex,
  Heading,
  TabPanel,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Login from "../component/Auth/Login";
import SignUp from "../component/Auth/SignUp";
import { useGlobalContext } from "../context";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const { user } = useGlobalContext();

  const history = useHistory();

  useEffect(() => {
    if (user) history.push("/chats");
  }, [history]);

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
        <Container w="100%" justifyContent="center" maxW="xl">
          <VStack mt="4rem" h="auto" w="100%" boxShadow="lg">
            <Box color="black" width="100%" p={4} borderRadius="lg">
              <Tabs isFitted size="md" outline="none">
                <TabList mb="1rem">
                  <Tab>Login</Tab>
                  <Tab>Signup</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Login />
                  </TabPanel>
                  <TabPanel>
                    <SignUp />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </VStack>
        </Container>
      </Flex>
    </>
  );
};

export default HomePage;
