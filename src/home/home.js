import React, { useState } from "react";
import { get } from 'lodash'
import "./home.scss";
import Paper from '@mui/material/Paper'
import { Link } from "react-router-dom";

function Homepage(props) {
  const [roomname, setroomname] = useState("");

  return (
    <Paper elevation={3} className="homepage">
      <h1>MooChat - {get(props, `user.attributes.given_name`)}</h1>
      <input
        placeholder="Create/Join Room"
        value={roomname}
        onChange={(e) => setroomname(e.target.value)}
      ></input>
      <Link to={`/chat/${roomname}/${get(props, `user.attributes.given_name`)}`}>
        <button>Join</button>
      </Link>
    </Paper>
  );
}

export default Homepage;
