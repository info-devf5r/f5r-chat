/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { useGlobalContext } from "../../context";
import { Spinner, useToast } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { AiOutlineEye } from "react-icons/ai";
import UserBadgeItem from "../User/UserBadgeItem";
import { FormControl, Input } from "@chakra-ui/react";
import UserListItem from "../User/UserListItem";
import axios from "axios";

const UpdateGroupChat = ({
  fetchAgain,
  setFetchAgain,
  chatName,
  fetchMessage,
}) => {
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = useGlobalContext();
  const [groupChatName, setGroupChatName] = useState(chatName);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (search) {
      const fetchData = async () => {
        setLoading(true);
        await axios
          .get(`/api/user?search=${search}`)
          .then((res) => {
            setSearchResult(res.data);
            setLoading(false);
          })
          .catch((error) => {
            toast({
              title: "Error",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          })
          .finally(() => setLoading(false));
      };
      fetchData();
    } else {
      setSearchResult([]);
    }
  }, [search]);

  const handleRemove = async (user1) => {
    //if he is admin or not and user who is loginned doesnt match with user who is removed
    if (
      selectedChat.groupAdmin._id !== user.userId &&
      user1._id !== user.userId
    ) {
      toast({
        title: "Error",
        description: `Only group admin can remove users`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.patch("/api/chat/groupRemove", {
        chatId: selectedChat._id,
        userId: user1._id ? user1._id : user.userId,
      });

      //if user has removed himself, then remove the chat from the state
      if (user1._id === user.userId) {
        setSelectedChat(null);
        onClose();
      } else {
        setSelectedChat(data);
      }

      fetchMessage();
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    //if user is already in the group chat
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "Error",
        description: `User is already in the group chat`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    console.log(selectedChat.groupAdmin._id, user1._id);
    console.log(searchResult);

    //if he is admin or not
    if (selectedChat.groupAdmin._id !== user.userId) {
      toast({
        title: "Error",
        description: `Only group admin can add users`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.patch("/api/chat/groupAdd", {
        chatId: selectedChat._id,
        userId: user1._id,
      });
      setSelectedChat(data);
      setFetchAgain(true);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.patch(`/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      //after updating chats, set the data retunred to be the new chat
      setSelectedChat(data);

      //fetching data again
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        d={{ base: "flex" }}
        icon={<AiOutlineEye />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width={{ base: "90vw" }}>
          <ModalHeader
            fontSize={{ base: "1.2rem", md: "1.5rem" }}
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton h="45px" />
          <ModalBody
            alignItems="center"
            w="100%"
            flexDirection="column"
            d="flex"
          >
            <Box w="100%" d="flex" flexWrap={"wrap"}>
              {selectedChat.users.map((user1) => (
                <UserBadgeItem
                  key={user1._id}
                  user={user1}
                  handleDelete={() => handleRemove(user1)}
                />
              ))}
            </Box>
            <FormControl mb={3} alignItems={"center"} d="flex">
              <Input
                value={groupChatName}
                placeholder="update group name"
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Button
                size="sm"
                variant={"solid"}
                colorScheme={"teal"}
                ml={1}
                isLoading={renameLoading}
                onClick={() => handleRename()}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user1) => (
                <UserListItem
                  key={user1._id}
                  user={user1}
                  handleFunction={() => handleAddUser(user1)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChat;
