import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { CloseButton } from "@chakra-ui/close-button";
import { Box } from "@chakra-ui/layout";
import React from "react";

const FirstCapital = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const AlertComponent = ({ setcloseAlert, status, message }) => {
  return (
    <Alert mb="1rem" status={status}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{FirstCapital(status)}!</AlertTitle>
        <AlertDescription display="block">{message}</AlertDescription>
      </Box>
      <CloseButton
        onClick={() => setcloseAlert(false)}
        position="absolute"
        right="8px"
        top="8px"
      />
    </Alert>
  );
};

export default AlertComponent;
