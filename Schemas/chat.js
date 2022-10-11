var mongoose= require('mongoose');

const chatSchema = new mongoose.Schema({
    ownedBy:{
        type:mongoose.Schema.Types.ObjectId
    },
    owner:{
        type:String,
        required:true
    },
    roomId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const chat = mongoose.model('Chat',chatSchema)
module.exports = chat