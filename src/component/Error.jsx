import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <Wrapper>
      <div>
        <h1>404</h1>
        <h4>page not found</h4>
        <Link to="/chats" className="btn">
          Back Home
        </Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  text-align: center;
  width: "100vw";
  height: "100vh";
  padding-top: 5rem;
  h1 {
    font-size: 9rem;
  }
`;

export default Error;
