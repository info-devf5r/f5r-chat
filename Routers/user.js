const express = require('express')
var User = require('../Schemas/user')
var router = require('express').Router();
var auth = require('../Middleware/auth');

router.post('/users', async (req,res) =>{
    // console.log(req.body);
    try{
        await User.findDuplicates(req.body.email)

        if(!req.body.password)
        throw new Error('Password required')

        const user = new User(req.body)
        
         await user.save()
         const token = await user.generateAuthToken()
         res.status(201).send({user,token})
    }catch(error){
        res.status(400).send({error : error.message})
    }
})

router.post('/users/login',async (req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)

    
        await user.save()
    
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/users/logout',async (req,res) =>{
    try{  
        const user = await User.findOne({_id:req.body.id})
        user.tokens = user.tokens.filter((token) =>{
            return token.token != req.body.token
        })
        user.currentRoom = '';
        await user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

router.post('/users/logoutall',async (req,res) =>{
    try{  
        const user = await User.findOne({_id:req.body.id})
        user.tokens = user.tokens.filter(token=> {return false;})
        user.currentRoom = '';
        await user.save()
        res.send(user)
    }catch(error){
        res.status(500).send()
    }
})


router.get('/users/me',auth,async(req,res) => {
    try{
        res.send({user:req.user});
    }
    catch(error){
        res.status(500).send(error);
    }
})

module.exports = router;
