const mongoose = require('mongoose')

const NotesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:'General'
    },
    date:{
        type:Date,
        default:Date.now
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

},{ timestamps: { createdAt: 'created_at',updatedAt:'updated_at' } })

module.exports =  mongoose.model('notes',NotesSchema)