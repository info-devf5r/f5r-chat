const express = require("express");
const app = express();
const socket = require("socket.io");
const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");

app.use(express());

const port = 8000;

var server = app.listen(
  port,
  console.log(
    `Server is running on the port no: ${(port)} `
  )
);

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

//initializing the socket io connection 
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ username, roomname }) => {
    //* create user
    const p_user = join_User(socket.id, username, roomname);
    console.log(socket.id, "=id");
    socket.join(p_user.room);

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      payload: { text: `Welcome ${p_user.username}` },
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      payload: { text: `${p_user.username} has joined the chat` },
    });
  });

  //user sending message
  socket.on("chat", (payload) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);
    try {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        payload
      });
    }
    catch (ex) {
      console.error(ex)
    }
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        payload: { text: `${p_user.username} has left the chat` },
      });
    }
  });
});
