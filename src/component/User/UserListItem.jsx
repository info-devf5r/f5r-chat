import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Flex
      cursor="pointer"
      bg="#E8E8E8"
      w="100%"
      color="black"
      borderRadius="lg"
      px={{ base: 2, md: 3 }}
      py={2}
      alignItems={"center"}
      mb={2}
      mt={4}
      _hover={{ background: "#38b2ac", color: "white" }}
      onClick={handleFunction}
    >
      <Avatar mr={2} size="sm" name={user.name} src={user.pic} />
      <Flex flexDirection={"column"}>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Flex>
    </Flex>
  );
};

export default UserListItem;
