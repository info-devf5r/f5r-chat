const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
// const DetectRTC = require("detectrtc")

app.use('/', express.static('public'))

let roomId
var clients = []
var count = 0;
var selectedUser
var dataToSend
var username
let user
let socketId
var room_userlist = new Map([])
var mic_deaf = new Map([])

// all the conected sockets
io.on('connection', function(socket){

  socket.on('create-room' , room => {
    let answer = true
    if(room_userlist.has(room)){
      answer = false
    }
   
    io.to(socket.id).emit('create-room-answer' ,answer)
  })
  console.log(`socket id : ${socket.id}`)

  socket.on('join-room' , room => {

    if (room_userlist.has(room)){
      if (room_userlist.get(room).length == 7){ // room is up for 7 users 
        io.to(socket.id).emit('full-room')
        return
      }
    }

    let answer = false
    if(room_userlist.has(room)){
      answer = true
    }
    io.to(socket.id).emit('join-room-answer' ,answer)
  })

  socket.on('join',function( name , room) {

    username = name
    roomId = room
    socketId = socket.id

    initMap(roomId , false)

    console.log(`${username} connected to server  . roomID : ${roomId}`)
    socket.join(roomId)

    var startTime = Date.now()

    io.to(roomId).emit("user-joined", startTime, socket.id , dataToSend)
    io.to(roomId).emit("participantsList")
  });

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message);
  });

  socket.on('voiceInfos' ,(toId, obj) => {
    mic_deaf.set(toId , obj)
  })

  socket.on('get-voice-activity', (toId) =>{
    io.to(socket.id).emit('set-voice-activity',mic_deaf.get(toId))
  })

	socket.on('disconnect', function() {
    var startTime2 = Date.now()
		io.sockets.emit("user-left", socket.id , startTime2);
	})

  socket.on('manually-disconnect', function() {
    var startTime3 = Date.now()
		io.sockets.emit("user-left", socket.id , startTime3);
	})

  socket.on('destroy-room', function() {
		room_userlist = new Map([]) // refactor users map when room destroys
    console.log('room destroyed')
    socket = ''
	})

  //when a user disconnects delete him from map : room_userlist 
  socket.on('delete', function(id) {
		selectedUser = id
    initMap(roomId , true) // refactor users map when a user disconnects
    console.log("refactor" ,id, dataToSend)
    io.sockets.emit("refactor",id ,dataToSend)
	})

});


function initMap(ROOMid , remove){
 
  if (remove){ //if user disconnects manually 
    console.log(`length = ${room_userlist.get(ROOMid).length}`)
    if (room_userlist.get(ROOMid).length>0){
      
      let count = 0
      room_userlist.get(ROOMid).forEach(function(map){
        if (map.has(selectedUser)){
          room_userlist.get(ROOMid).splice (count,1);
          console.log(`user with id ${selectedUser} deleted`)
          return false
        }
        count ++
      })
      console.log(room_userlist)
    }

    var temp = new Array();
    room_userlist.get(ROOMid).forEach(function(map){
      temp.push(Array.from(map)) // add maps for this room to temp array in order to send it to client 
    })

    dataToSend = temp
    return
  }

  room_userlist = initUsersList(ROOMid)

  var temp = new Array();
  room_userlist.get(ROOMid).forEach(function(map){
    temp.push(Array.from(map)) // add maps for this room to temp array in order to send it to client 
  })

  dataToSend = temp
  console.log(dataToSend)
}

function initUsersList(ROOMid){
  user = new Map()
  user.set(socketId , username) // store user's attrs to map
  
  if (room_userlist.has(ROOMid)){
    room_userlist.get(ROOMid).push(user) //if room exists add new user 
  }
  else{
    var array = [user]
    room_userlist.set(ROOMid , array)//if not , add new room and array of map's obj
  }

  return room_userlist;
}

// start the server
const port = process.env.PORT || 3000
server.listen(port,"localhost", () => {
  console.log(`Express signaling server listening on port ${port} and ip localhost`)
})