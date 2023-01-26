const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

},{ timestamps: { createdAt: 'created_at',updatedAt:'updated_at' } })


const User = mongoose.model('users',UsersSchema)
User.createIndexes();
module.exports =  User