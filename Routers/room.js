
var Room = require('../Schemas/room')
var router = require('express').Router();
var auth = require('../Middleware/auth');
const User = require('../Schemas/user');

router.post('/room/add',async(req,res)=>{
    try{
        var alr = true;
        const room =await Room.findOne({id:req.body.roomId});
        if(!room)
            throw new Error('No such rooms..');
        const user =await User.findOne({_id:req.body.id});
        if(user.currentRoom == req.body.roomId){
            res.status(200).send({status:'NA',message:'You are already in the room',user});
        }
        else{
            user.currentRoom = req.body.roomId;
            await user.save()
            if(room.createdBy == req.body.id){
                alr = false;
                res.status(200).send({status:'room created by you',room});
            }
            else
                await room.members.forEach(t => {
                    if(t.member == req.body.id){
                        res.status(200).send({status:'already a member',room,user});
                        alr = false;
                        return;
                    }
                })
            if(alr){
                room.members = room.members.concat({member:req.body.id});
                await room.save()
                res.status(200).send({status:'success',room})
            }
        }
    }
    catch(error){
        console.log('error ;;;',error);
        res.status(400).send(error);
    }
})

router.get('/room/me',auth,async(req,res)=>{
    try{
        const rooms =await Room.find({createdBy:req.user._id})
        const rooms1 =await Room.find({"members.member":req.user._id})
        res.status(200).send({created:rooms,member:rooms1})
    }
    catch(err){
        console.log(err)
        res.status(500).send({error:err})
    }
})

router.post('/room/create',auth,async(req,res)=>{
    try{
        await Room.findDuplicates(req.body.name,req.user._id)
        req.user.currentRoom = req.body.roomId;
        req.user.save()
        const room = new Room({id:req.body.roomId,name:req.body.name,createdBy:req.user._id})
        await room.save()
        res.status(200).send({status:'success',room});
    }
    catch(error){
        console.log('running ... ,room duplicated');
        res.status(500).send({message:'room duplicated'});
    }
})

router.post('/room/members',async(req,res)=>{
    try{
        const room =await Room.findOne({id:req.body.roomId});
        var members = []
        for(var i = 0;i<room.members.length;i++){
            if(room.members[i].member == req.body.id){continue;}
            members.push(await User.findOne({_id:room.members[i].member}));
        }
        if(req.body.id != room.createdBy)
            members.push(await User.findOne({_id:room.createdBy}));
        res.status(200).send(members);
    }
    catch(error){
        res.status(400).send(error);
    }
})



module.exports = router;
