const socketio = require('socket.io');
const express = require("express")
const cors = require("cors")
const path = require('path')
const app = express()
const port = process.env.PORT || 3005
console.log('port', process.env.PORT)

app.use(express.json())
app.use(cors())
server = app.listen(port,function(){
    console.log("Listening on port " + port)
})
io = socketio(server);
io.on('connection', (socket) => { 
    // console.log('New connection')
    socket.on('joinRoom',(room)=>{
        socket.join(room)
        // socket.emit('message', "welcome hello")
        // socket.broadcast.to(room).emit('message',"new user connected")
    })

    
    //Listen
    socket.on('chatMessage',data =>{
        const out = {message, author,room} =  data
        io.to(out.room).emit('message', out)
        // console.log(data)
    })
    // socket.on('disconnect', ()=>{
    //     io.emit('message','user left the room')
    // })
})
app.use(express.static(path.join(__dirname, 'client/build')))
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'))
})
   


 

