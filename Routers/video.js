const Video = require('../Schemas/video');
var router = require('express').Router();
var auth = require('../Middleware/auth');
const Comment = require('../Schemas/comment');
const User = require('../Schemas/user');


router.post('/video/upload',auth,async(req,res)=>{
    try{
        // console.log(req.body)
        const v =await Video.findOne({video:req.body.video});
        if(v) throw new Error('Video already exists');
        const vid = new Video({name:req.body.name,owner:req.user._id,video:req.body.video,poster:req.body.poster,comments:0,
            description:req.body.desc?req.body.desc:''});
        vid.save()
        res.status(200).send(vid);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:err})
    }
})

router.post('/video/like',auth,async(req,res)=>{
    const vid =await Video.findOne({_id:req.body.id});
    try{    
        if(vid.dislikes.includes(req.user._id)){
            var ind = vid.dislikes.indexOf(req.user._id);
            if(ind>-1){
                vid.dislikes.splice(ind,1)
            }
            vid.likes.push(req.user._id);    
        }
        else{
            if(vid.likes.includes(req.user._id)){
                var ind = vid.likes.indexOf(req.user._id);
                if(ind>-1){
                    vid.likes.splice(ind,1)
                }
            }
            else{
                vid.likes.push(req.user._id);
            }
        }
        vid.save()
        res.status(200).send(vid);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:err})
    }
})

router.post('/video/dislike',auth,async(req,res)=>{
    const vid =await Video.findOne({_id:req.body.id});
    try{    
        if(vid.likes.includes(req.user._id)){
            var ind = vid.likes.indexOf(req.user._id);
            if(ind>-1){
                vid.likes.splice(ind,1)
            }
            vid.dislikes.push(req.user._id);    
        }
        else{
            if(vid.dislikes.includes(req.user._id)){
                var ind = vid.dislikes.indexOf(req.user._id);
                if(ind>-1){
                    vid.dislikes.splice(ind,1)
                }
            }
            else{
                vid.dislikes.push(req.user._id);
            }
        }
        vid.save()
        res.status(200).send(vid);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:err})
    }
})

router.post('/video/comment',auth,async(req,res)=>{
    try{
        const vid =await Video.findOne({_id:req.body.id});
        if(!vid)
            throw new Error('No such video...');
        vid.comments += 1;
        const comm = new Comment({by:req.user._id,videoId:req.body.id,text:req.body.text})
        comm.save()
        vid.save()
        res.status(200).send(comm)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.post('/comment/like',auth,async(req,res)=>{
    const vid =await Comment.findOne({_id:req.body.id});
    try{    
        if(vid.dislikes.includes(req.user._id)){
            var ind = vid.dislikes.indexOf(req.user._id);
            if(ind>-1){
                vid.dislikes.splice(ind,1)
            }
            vid.likes.push(req.user._id);    
        }
        else{
            if(vid.likes.includes(req.user._id)){
                var ind = vid.likes.indexOf(req.user._id);
                if(ind>-1){
                    vid.likes.splice(ind,1)
                }
            }
            else{
                vid.likes.push(req.user._id);
            }
        }
        vid.save()
        res.status(200).send(vid);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:err})
    }
})

router.post('/comment/dislike',auth,async(req,res)=>{
    const vid =await Comment.findOne({_id:req.body.id});
    try{    
        if(vid.likes.includes(req.user._id)){
            var ind = vid.likes.indexOf(req.user._id);
            if(ind>-1){
                vid.likes.splice(ind,1)
            }
            vid.dislikes.push(req.user._id);    
        }
        else{
            if(vid.dislikes.includes(req.user._id)){
                var ind = vid.dislikes.indexOf(req.user._id);
                if(ind>-1){
                    vid.dislikes.splice(ind,1)
                }
            }
            else{
                vid.dislikes.push(req.user._id);
            }
        }
        vid.save()
        res.status(200).send(vid);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:err})
    }
})

router.post('/video/get',auth,async(req,res)=>{
    try{
        const vid =await Video.findOne({_id:req.body.id});
        const comm =await Comment.find({videoId:req.body.id});
        var comme = [];
        for(var i = 0;i< comm.length;i++){
            var user = await User.findOne({_id:comm[i].by})
            comme.push({comment:comm[i],user})
        }
        var isLiked=vid.likes.includes(req.user._id),isDisliked=vid.likes.includes(req.user._id);
        console.log(vid,comme)
        res.status(200).send({video:vid,isLiked,isDisliked,comments:comme})
    }
    catch(err){
        console.log(err);
        res.status(400).send({error:err})
    }
})

router.post('/video/delete',auth,async(req,res)=>{
    try{
        await Video.findOneAndDelete(req.body.id)
        await Comment.deleteMany({videoId:req.body.id})
        res.status(200).send({status:'success'})
    }
    catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
})

router.post('/comment/delete',auth,async(req,res)=>{
    try{
        await Comment.deleteOne({_id:req.body.id})
        res.status(200).send({status:'success'})
    }
    catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
})

router.get('/video/me',auth,async(req,res)=>{
    try{
        const vid = await Video.find({owner:req.user._id})
        res.status(200).send({video:vid})
    }
    catch(err){
        console.log(err);
        res.status(400).send({error:err});
    }
})

router.get('/video/all',async(req,res)=>{
    try{
        const vid = await Video.find()
        const vide = [];
        for(var i = 0 ;i<vid.length;i++){
            user = await User.findOne({_id:vid[i].owner})
            vide.push({video:vid[i],user})
        }
        res.status(200).send({video:vide})
    }
    catch(err){
        console.log(err);
        res.status(400).send({error:err});
    }
})
module.exports = router;