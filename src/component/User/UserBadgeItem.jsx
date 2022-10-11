import { Box } from "@chakra-ui/react";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const UserBadgeItem = ({ user, handleDelete }) => {
  return (
    <Box
      py={1}
      px={2}
      borderRadius={"lg"}
      m={1}
      mb={2}
      d="flex"
      h="100%"
      alignItems={"center"}
      variant="solid"
      fontSize={12}
      color={"white"}
      bg="purple"
      onClick={handleDelete}
    >
      {user.name}
      <AiOutlineClose
        style={{ marginleft: "15px", color: "white", fontSize: ".8rem" }}
      />
    </Box>
  );
};

export default UserBadgeItem;
