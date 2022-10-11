var mongoose= require('mongoose');

const roomSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId
    },
    members:[{
        member:{
            type:mongoose.Schema.Types.ObjectId
        }
    }],
    blocked:[{
        block:{
            type:mongoose.Schema.Types.ObjectId
        }
    }],
    
},{
    timestamps:true
})

roomSchema.statics.findDuplicates = async (name,createdBy) =>{
    const room = await Room.findOne({name,createdBy})
    if(room)
        throw new Error('Room is Duplicated')
}

const Room = mongoose.model('Room',roomSchema)
module.exports = Room