import Chat from "./chat/chat";
import Home from "./home/home";
import { isEmpty } from 'lodash'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import * as Config from './config';

const socket = io(Config.SOCKET_SERVER);
function Appmain(props) {
  return (
    <React.Fragment>
      <Chat
        username={props.match.params.username}
        roomname={props.match.params.roomname}
        socket={socket}
        sessionID={props.sessionID}
      />
    </React.Fragment>
  );
}



function App() {
  const [authState, setAuthState] = useState();
  const [authData, setAuthData] = useState({});
  const [sessionID, setSessionID] = useState();

  useEffect(() => {
    const lsSessionID = localStorage.getItem("sessionID");
    if (lsSessionID) {
      setSessionID(lsSessionID);
    }

    socket.on("session", ({ sessionID, userID }) => {
      setSessionID(sessionID);
      localStorage.setItem("sessionID", sessionID);
    });

    onAuthUIStateChange((nextAuthState, authData) => {
      if (authData && authData.attributes && nextAuthState === AuthState.SignedIn) {
        socket.auth = Object.assign({}, socket.auth, {
          username: authData.attributes.given_name,
          userId: authData.username
        });
        socket.connect();

        setAuthState(nextAuthState);
        setAuthData(authData);
      }
    });
  }, []);

  useEffect(() => {
    if (sessionID && authState === AuthState.SignedIn) {
      socket.disconnect();
      socket.auth = { sessionID: sessionID, username: socket.auth.given_name, userId: socket.auth.username };
      socket.connect();
    }
  }, [sessionID, authState]);

  const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '10px',
    // you can also just use 'scale'
    transition: transitions.SCALE
  }

  return authState === AuthState.SignedIn && !isEmpty(authData) ? (
    <div className="App">
      <Router>
        <AlertProvider template={AlertTemplate} {...options}>
          <div className="App">
            <Switch>
              <Route path="/" exact>
                <Home user={authData} />
              </Route>
              <Route path="/chat/:roomname/:username"
                render={(props) => {
                  return <Appmain {...props} user={authData} sessionID={sessionID} />
                }} />
            </Switch>
          </div>
        </AlertProvider>
      </Router>
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" },
          { type: "family_name", label: "Last Name *", required: true },
          { type: "given_name", label: "First Name *", required: true },
        ]}
      />
    </AmplifyAuthenticator>
  );
}

export default App;
