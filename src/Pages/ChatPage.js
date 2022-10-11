/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import SideDrawer from "../component/chats/SideDrawer";
import Chats from "../component/chats/Chats";
import ChatsBox from "../component/chats/ChatsBox";
import { Flex, Box } from "@chakra-ui/layout";

const ChatPage = () => {
  return (
    <Box bg="blue.100" w="100%">
      <SideDrawer />
      <Flex w="100%" justifyContent="space-between" p="10px" h="91.5vh">
        <Chats />
        <ChatsBox />
      </Flex>
    </Box>
  );
};

export default ChatPage;
