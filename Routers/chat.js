var router = require('express').Router();
var auth = require('../Middleware/auth');
const User = require('../Schemas/user');
const Chat = require('../Schemas/chat');
var Room = require('../Schemas/room')

router.post('/chat/create',async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.body.id})
        if(!user)
            throw new Error('U r not authorized..');
        const room = await Room.findOne({id:req.body.roomId})
        if(!room)
            throw new Error('No such rooms..');
        var chat = new Chat({ownedBy:req.body.id,roomId:req.body.roomId,message:req.body.txt,owner:user.username});
        await chat.save()
        res.status(200).send(chat)
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

router.post('/chat/delete',async(req,res)=>{
    try{
        await User.findOne({_id:req.body.id})
        await Room.findOne({id:req.body.roomId})
        
        await Chat.findByIdAndDelete({_id:req.body.chatId});
        res.status(200).send({status:'deleted'})
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/chat/get',auth,async(req,res)=>{
    try{
        const room = await Room.findOne({id:req.body.roomId});
        var alr = false;
        if(!room)
            throw new Error('No such rooms..');
        room.members.forEach(t => {
            if(t.member == req.body.id){
                alr = true;
            }
        })
        if(req.body.id == room.createdBy){
            alr = true;
        }
        if(alr){
            var chat = await Chat.find({roomId:req.body.roomId});
            if(chat.length == 0){
                chat = ['no chat'];
            }
            res.status(200).send(chat)   
        }
        else{
            res.status(400).send({error:'Unable to retrieve chat at the moment'})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).send(err);
    }
})



module.exports = router