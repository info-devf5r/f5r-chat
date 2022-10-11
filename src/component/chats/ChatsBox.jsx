import { Box } from "@chakra-ui/react";
import React from "react";
import { useGlobalContext } from "../../context";
import SingleChat from "./SingleChat";

const ChatsBox = () => {
  const { selectedChat, fetchAgain, setFetchAgain } = useGlobalContext();
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      w={{ base: "100%", md: "65%" }}
      flexDirection={"column"}
      alignItems={"center"}
      borderRadius={"lg"}
      borderWidth={"1px"}
      bg="white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatsBox;
