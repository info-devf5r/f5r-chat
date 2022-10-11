/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import parse from "html-react-parser";
import { GrFormAdd } from "react-icons/gr";
import NotFound from "../User/NotFound";
import {
  showLastMessage,
  getSender,
  getSenderPic,
} from "../../utils/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import axios from "axios";

const Chats = () => {
  const toasts = useToast();
  const { selectedChat, fetchAgain, user, setSelectedChat, chats, setchats } =
    useGlobalContext();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat");
      setchats(data);
    } catch (error) {
      toasts({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={2}
      bg="white"
      w={{ base: "100%", md: "34%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Flex
        pb={3}
        px={3}
        fontSize={{ base: ".9rem", md: "1rem" }}
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
        as="section"
      >
        My Chats
        <GroupChatModal>
          <Button
            size="sm"
            fontWeight={"500"}
            rightIcon={<GrFormAdd />}
            fontSize={{ base: ".9rem", md: "10px", lg: "1rem" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>
      <Flex
        h="100%"
        w="100%"
        p={2}
        bg="#f8f8f8"
        borderRadius={"lg"}
        overflowY={"hidden"}
        flexDirection={"column"}
      >
        <>
          {chats && chats?.length > 0 ? (
            <Stack overflowY={"auto"}>
              {chats?.map((chat, index) => {
                return (
                  <Box
                    d="flex"
                    alignItems={"center"}
                    onClick={() => setSelectedChat(chat)}
                    cursor={"pointer"}
                    bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={2}
                    py={2}
                    borderRadius={"lg"}
                    key={chat._id}
                  >
                    <Avatar
                      src={
                        !chat?.isGroupChat
                          ? getSenderPic(loggedUser, chat?.users)
                          : chat.pic
                      }
                      size="sm"
                      mr="4"
                    />
                    <VStack alignItems={"start"} spacing={"1px"}>
                      <Text>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat?.chatName}
                      </Text>
                      <Text fontSize={"xs"}>
                        {chat.isGroupChat
                          ? parse(showLastMessage(chat, user))
                          : chat?.latestMessage?.content}
                      </Text>
                    </VStack>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <>
              <NotFound
                message={
                  "Your chats is empty, utilize the above search button to start messaging..."
                }
              />
            </>
          )}
        </>
      </Flex>
    </Box>
  );
};

export default Chats;
