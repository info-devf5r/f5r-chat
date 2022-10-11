import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { DrawerCloseButton, Spinner, useToast } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  Input,
} from "@chakra-ui/react";

import { useHistory } from "react-router-dom";

import { Tooltip } from "@chakra-ui/tooltip";
import React, { useState } from "react";
import { AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { useGlobalContext } from "../../context";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "./ChatLoading";
import UserListItem from "../User/UserListItem";
import NotFound from "../User/NotFound";
import { getSender } from "../../utils/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import axios from "axios";

const SideDrawer = () => {
  const {
    user,
    removeUser,
    chats,
    setSelectedChat,
    setchats,
    notifications,
    setnotifications,
    width,
  } = useGlobalContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toast = useToast();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [seachResult, setSeachResult] = useState(null);

  const logoutHandler = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast({
        title: "success.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      removeUser();
      history.push("/");
    } catch (error) {
      toast({
        title: "Error.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSearch = async (e) => {
    if (!search) {
      toast({
        title: "Please enter a search term",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`/api/user?search=${search}`);
      console.log(data);
      setLoading(false);
      setSeachResult(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      //creating chat with the selected user
      setLoadingChat(true);
      const { data } = await axios.post(`/api/chat`, { userId });

      //if a new chat is created, add it to the chats array

      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="2px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            ref={btnRef}
            onClick={onOpen}
            leftIcon={<AiOutlineSearch size="1.2rem" />}
            variant="ghost"
          >
            <Text d={{ base: "none", md: "flex" }}>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl">Chat App</Text>
        <Flex as="article">
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.scale}
              />
              <AiFillBell size="1.2rem" />
            </MenuButton>
            {/* notifications */}
            <MenuList p={2}>
              {!notifications.length && "No new Messages"}
              {notifications.length > 0 &&
                notifications.map((n) => (
                  <MenuItem
                    onClick={() => {
                      console.log(notifications);
                      setSelectedChat(n.chat);
                      setnotifications(
                        notifications.filter(
                          (not) => not.sender._id !== n.sender._id
                        )
                      );
                    }}
                    key={n._id}
                  >
                    {n.chat?.isGroupChat
                      ? `New Message in ${n.chat.chatName}`
                      : `New Message from ${getSender(user, n.chat?.users)}`}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} p={1}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Drawer
        isOpen={isOpen}
        size={width < 350 ? "full" : "xs"}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Text>Search</Text>
            <DrawerCloseButton d="flex" h="45px" alignItems={"center"} />
          </DrawerHeader>

          <DrawerBody>
            <Flex pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Flex>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                {seachResult && seachResult.length > 0 ? (
                  <>
                    {seachResult.map((user) => {
                      return (
                        <UserListItem
                          key={user._id}
                          user={user}
                          loadingChat={loadingChat}
                          handleFunction={() => accessChat(user._id)}
                        />
                      );
                    })}
                    {/* Display loader when one of the user has been clicked to start a chat */}
                    {loadingChat && <Spinner ml="auto" d="flex" />}
                  </>
                ) : (
                  <>
                    {seachResult !== null && (
                      <NotFound message={"Unfortunately, user doesn't exist"} />
                    )}
                  </>
                )}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
