const mongoose = require("mongoose");
const moment = require('moment')
const BulletsSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      default: "Task",
    },
    bullet_text: {
      type: String,
      required: true,
    },  
    status:{
      type:String,
      default:'added'
    },
    reminder:{
      type:Boolean,
      default:false
    },
    schedule_date:{
      type:Date,
      default:moment().format('YYYY-MM-DD')
    },
    important:{
      type:Boolean,
      default:false
    },
    progress:{
      type:Number,
      default:0
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("bullets", BulletsSchema);
