const mongoose=require('mongoose')
const userModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        requried:true,
        min:6,
        max:12
    },
    role:{
        type:String,
        enum:['user', 'admin'],
        default:"user"
    }
})

module.exports=mongoose.model('User', userModel)