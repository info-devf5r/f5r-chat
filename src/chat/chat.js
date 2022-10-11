import "./chat.scss";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import { process } from "../store/action/index";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import ImageModeration from "./image-moderation";
import Voice from './voice'
import Paper from '@mui/material/Paper'

function Chat({ username, roomname, socket, sessionID }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(process(encrypt, msg, cipher));
  };

  // emit the joinRoom message when this component is loaded (taking username and roomname form path)
  useEffect(() => {
    socket.emit("joinRoom", { username, roomname });
  }, []);

  useEffect(() => {
    socket.on("message", (data) => {
      //decypt
      let temp = messages;
      if (data.payload.text) {
        const ans = to_Decrypt(data.payload.text, data.username);
        dispatchProcess(false, ans, data.payload.text);
        console.log(ans);
        temp.push({
          userId: data.userId,
          username: data.username,
          text: ans,
        });
      } else if (data.payload.image) {
        temp.push({
          userId: data.userId,
          username: data.username,
          image: data.payload.image,
        });
      } else if (data.payload.audio) {
        const blob = new Blob([data.payload.audio], { type: "audio/mp3" });
        temp.push({
          userId: data.userId,
          username: data.username,
          audio: window.URL.createObjectURL(blob)
        })
      }
      setMessages([...temp]);
    });
  }, [socket]);

  const sendData = () => {
    if (text !== "") {
      //encrypt here
      const ans = to_Encrypt(text);
      socket.emit("chat", { text: ans });
      setText("");
    }
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Paper elevation={3} className="chat">
      <div className="user-name">
        <h2>
          {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
        </h2>
      </div>
      <div className="chat-message">
        {messages.map((i, index) => {
          if (i.username === username) {
            return (
              <div key={index} className="message">
                {i.text ? <p>{i.text}</p> : null}
                {i.image ? <p><img width={150} src={i.image}></img></p> : null}
                {i.audio ? <p><audio controls src={i.audio}></audio></p> : null}
                <span>{i.username}</span>
              </div>
            );
          } else {
            return (
              <div className="message mess-right">
                {i.text ? <p>{i.text}</p> : null}
                {i.image ? <p><img width={150} src={i.image}></img></p> : null}
                {i.audio ? <p><audio controls src={i.audio}></audio></p> : null}
                <span>{i.username}</span>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="send">

        <input
          placeholder="enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendData();
            }
          }}
        />
        <Voice sessionID={sessionID} />
        <ImageModeration socket={socket} />
        <button onClick={sendData}>Send</button>
      </div>
    </Paper>
  );
}
export default Chat;
