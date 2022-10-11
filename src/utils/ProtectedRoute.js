import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useGlobalContext } from "../context";

const ProtectedRoute = ({ children, ...rest }) => {
  const { user } = useGlobalContext();

  return (
    <Route
      {...rest}
      render={() => {
        return user ? children : <Redirect to="/"></Redirect>;
      }}
    ></Route>
  );
};

export default ProtectedRoute;
