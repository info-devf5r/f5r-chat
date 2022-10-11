/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from "query-string";
import Header from "../Header";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import axios from "axios";

const VerifyEmail = () => {
  const [error, setError] = useState({ status: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const queryValues = queryString.parse(search);

  const verifyEmailToken = async () => {
    setLoading(true);
    await axios
      .post("/api/auth/verify-email", {
        verificationToken: queryValues.token,
        email: queryValues.email,
      })
      .then((res) => console.log(res.data))
      .catch((err) => setError({ status: true, msg: err.response.data.msg }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    verifyEmailToken();
  }, []);

  if (loading) {
    return (
      <Header>
        <Box mt="1rem">
          <Heading size="lg">Loading...</Heading>
        </Box>
      </Header>
    );
  }

  if (error.status) {
    return (
      <Header>
        <Box px="1rem" mt="4rem">
          <Heading size="lg">{error.msg}</Heading>
        </Box>
      </Header>
    );
  }

  return (
    <Header>
      <Box px="1rem" mt="4rem">
        <Flex direction="column">
          <Heading fontWeight="400" size="lg">
            Account Verified
          </Heading>
          <Link to="/">
            <Button size="sm" mt="1rem" colorScheme="blue">
              Please Login
            </Button>
          </Link>
        </Flex>
      </Box>
    </Header>
  );
};

export default VerifyEmail;
