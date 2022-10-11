import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack spacing={5} mt={4}>
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
      <Skeleton height="10px" />
    </Stack>
  );
};

export default ChatLoading;
