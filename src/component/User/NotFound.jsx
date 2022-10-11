import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const NotFound = ({ message }) => {
  return (
    <Flex mt={5}>
      <Text>{message}</Text>
    </Flex>
  );
};

export default NotFound;
