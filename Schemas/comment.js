var mongoose= require('mongoose');

const commentSchema = new mongoose.Schema({
    videoId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    by:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    text:{
        type:String,
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


const Comment = mongoose.model('comment',commentSchema)
module.exports = Comment