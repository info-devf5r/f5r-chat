var express = require('express');
var socket = require('socket.io');
var PeerServer = require('peer').PeerServer;
var path = require('path')
var bcrypt = require('bcryptjs')
const User = require('./Schemas/user');
const Chat = require('./Schemas/chat');
var Room = require('./Schemas/room')

//App
var userRouter = require('./Routers/user');
var roomRouter = require('./Routers/room');
var chatRouter = require('./Routers/chat');
var vidRouter = require('./Routers/video');

const cors = require('cors');

var mongoose= require('mongoose');
mongoose.connect("mongodb+srv://VIRAT:17prt24st@cluster0.m144i.mongodb.net/Video_App?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true });

var app = express();
app.options('*', cors());
app.use(express.json());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
const port = process.env.PORT || 4000;
var server = app.listen(port,function(){
    console.log("listening to 4000");
});

app.use(express.static(path.join(__dirname, 'build')));

app.use(userRouter);
app.use(roomRouter);
app.use(chatRouter);
app.use(vidRouter);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
function getColor(){
    return 'rgb('+getRandomInt(10,240)+','+getRandomInt(10,240)+','+getRandomInt(10,240)+')';
}
const io = socket(server);
const addChat = async(id,roomID,msg)=>{
    try{
        const user = await User.findOne({_id:id})
        if(!user)
            throw new Error('U r not authorized..');
        const room = await Room.findOne({id:roomID})
        if(!room)
            throw new Error('No such rooms..');
        var chat = new Chat({ownedBy:id,roomId:roomID,message:msg,owner:user.username});
        await chat.save()
        console.log('add chat ...',chat);
    }
    catch(err){
        console.log(err);
    }
}
io.on('connection',function(socket){
    socket.on('video-selected',function({item,roomID,startedBy}){
        socket.broadcast.to(roomID).emit('video-selected',{...item,startedBy});
    })
    socket.on('any-video-selected',function(roomID){
        var k = Array.from(io.sockets.adapter.rooms.get(roomID))
        if(k[0]!=socket.id)
            io.to(k[0]).emit('any-video-selected',socket.id)
    })
    socket.on('yes-video-selected',function ({vidUrl,to}) {
        io.to(to).emit('yes-video-selected',vidUrl)
    })
    socket.on("join room", async({roomID,type,id,mode}) => {
        socket.join(roomID)
        socket.roomId = roomID;
        socket.userId = id;
        console.log('join room running',socket.id,io.sockets.adapter.rooms.get(roomID))
        var k = Array.from(io.sockets.adapter.rooms.get(roomID))
        k = k.filter(p => p!=socket.id);
        socket.broadcast.to(roomID).emit('duplicate check',{id})

        if(type == 'help'){
            console.log(socket.id)
            socket.broadcast.to(roomID).emit('all users', {users:[socket.id],mode});
        }
        else
            io.to(socket.id).emit("all users",k);
        
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID,user:payload.user,vid:payload.vid });
    });
    socket.on('help',payload=>{
        console.log('on help :',payload.callerID)
        io.to(payload.id).emit('all users', {users:[payload.callerID]});
    })
    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id,user:payload.user });
    });

    socket.on("join room file", async({roomID,type}) => {
        socket.join(roomID)
        socket.roomId = roomID;
        console.log('join room file running',socket.id)
        var k = Array.from(io.sockets.adapter.rooms.get(roomID))
        k = k.filter(p => p!=socket.id);
        if(type == 'help')
            socket.broadcast.to(roomID).emit('all users file', [socket.id]);
        else{
            console.log('summa running...');
            io.to(socket.id).emit("all users file",k);
        }
    });

    socket.on("sending signal file", payload => {
        io.to(payload.userToSignal).emit('user joined file', { signal: payload.signal, callerID: payload.callerID,user:payload.user,vid:payload.vid });
    });
    socket.on("returning signal file", payload => {
        io.to(payload.callerID).emit('receiving returned signal file', { signal: payload.signal, id: socket.id,user:payload.user });
    });
    socket.on('video end file',roomID => {
        socket.broadcast.to(roomID).emit('video end file')
    })
    socket.on('disconnect', async() => {
        console.log('disconnect...',socket.roomId,socket.userId);
        if(socket.userId){
            const user = await User.findOne({_id:socket.userId})
            user.currentRoom = '';
            user.save()
        }
        socket.broadcast.to(socket.roomId).emit("user left",socket.id)
    });

    socket.on('request',function({roomID}){
        if(io.sockets.adapter.rooms.get(roomID).size>1)
            io.to(io.sockets.adapter.rooms.get(roomID).values().next().value).emit('req');
         
    });
    socket.on('request-file',function({id}){
        io.to(id).emit('req')
    })
    socket.on('vid',function(data){
        console.log('vid running...',io.sockets.adapter.rooms.get(data.roomID));
        socket.broadcast.to(data.roomID).emit('begin',data);
    });
    socket.on('update-player',function(data){
        socket.broadcast.to(data.roomID).emit('update-player',data);
    })
    socket.on('play',function(data){
        socket.broadcast.to(data.roomID).emit('play',{});
    });
    socket.on('pause',function(data){
        // console.log("pause node running...");
        socket.broadcast.to(data.roomID).emit('pause',{});
    })
    socket.on('skip',function(data){
        socket.broadcast.to(data.roomID).emit('skip',data)
    })
    socket.on('rf',function(data){
        socket.broadcast.to(data.roomID).emit('rf',data)
    })
    socket.on('end',function(data){
        socket.broadcast.to(data.roomID).emit('end',{});
    })
    socket.on('plbck',function(data){
        socket.broadcast.to(data.roomID).emit('plbck',data);
    })
    socket.on('send-chat', async(data)=>{
        // console.log(data)
        await addChat(data.id,data.roomID,data.msg);
        socket.broadcast.to(data.roomID).emit('rec-chat',{...data,color:getColor()});
    })
})


