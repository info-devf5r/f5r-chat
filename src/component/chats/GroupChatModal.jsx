/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import UserListItem from "../User/UserListItem";
import { useGlobalContext } from "../../context";
import UserBadgeItem from "../User/UserBadgeItem";
import axios from "axios";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isChatAdding, setIsChatAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [pic, setPic] = useState("");
  const { setchats, chats } = useGlobalContext();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "Warning",
        description: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToBeRemove) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToBeRemove._id)
    );
  };

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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Warning",
        description: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsChatAdding(true);

    //creating group chat
    try {
      const formData = new FormData();
      formData.append("name", groupChatName);
      formData.append("users", JSON.stringify(selectedUsers.map((u) => u._id)));
      formData.append("pic", pic);

      const { data } = await axios.post("/api/chat/group", formData);
      //adding our chats to the very top of our chats
      setchats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsChatAdding(false);
    }
  };

  return (
    <>
      <span onClick={onOpen}> {children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w={{ base: "95vw" }}>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton h={"45px"} />
          <ModalBody d="flex" alignItems={"center"} flexDirection={"column"}>
            <FormControl>
              <Input
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="chat name"
              />
            </FormControl>
            <FormControl>
              <Input
                mb={3}
                placeholder="group photo"
                accept="image/*"
                type="file"
                onChange={(e) => setPic(e.target.files[0])}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </FormControl>
            {/* selectedUser */}
            <Wrap w="100%" spacing={"10px"}>
              <WrapItem>
                {selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleDelete={() => handleDelete(user)}
                  />
                ))}
              </WrapItem>
            </Wrap>
            {/* seareched user */}
            {loading ? (
              <Spinner />
            ) : (
              searchResult &&
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isChatAdding}
              colorScheme="blue"
              loadingText="creating..."
              onClick={handleSubmit}
            >
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
