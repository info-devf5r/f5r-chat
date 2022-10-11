import React from "react";
import { Container, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = ({ children }) => {
  return (
    <>
      <Flex direction="column" w="100%">
        <Flex boxShadow="lg" w="100%">
          <Flex
            as="nav"
            p="2rem"
            w="100%"
            maxWidth="1200px"
            justifyContent="flex-start"
            margin="0 auto"
          >
            <Link to="/">
              <Heading cursor="pointer">Chat App</Heading>
            </Link>
          </Flex>
        </Flex>
        <Container maxW="1200px">{children}</Container>
      </Flex>
    </>
  );
};

export default Header;
