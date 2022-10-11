var mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value))
            throw new Error('Not email')
        }
    },
    password:{
        type:String,
        required:false,
        minlength:8,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password'))
            throw new Error('Password cannot contain "Password"')
        }
    },
    currentRoom:{
        type:String
    },
    tokens:[{
        token:{
            type : String,
            required:true
        }
    }]
},{
    timestamps:true
})

userSchema.methods.toJSON = function (){
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user.id.toString()},'abc')

    user.tokens = user.tokens.concat({token})
    user.save()  
    return token
}

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user)
        throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
        throw new Error('Unable to login - pass')

    return user
}

userSchema.statics.findDuplicates = async (email) =>{
    const user = await User.findOne({email})

    if(user)
    throw new Error('Email is Duplicate')
}

userSchema.pre('save',async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User