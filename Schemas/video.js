var mongoose= require('mongoose');

const videoSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    video:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    poster:{
        type:String,
    },
    description:{
        type:String,
    },
    comments:{
        type:Number
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,    
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
    }]
},{
    timestamps:true
})


const Video = mongoose.model('Video',videoSchema)
module.exports = Video