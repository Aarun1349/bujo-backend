const mongoose = require("mongoose");
const moment = require('moment')
const HabbitSchema = new mongoose.Schema(
  {
    habbit_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status:{
      type:String,
      default:'added'
    },
    reminder:{
      type:Boolean,
      default:true
    },
    time:{
        type:String,
        default:moment().format('h:mm')
      },
    schedule_date:{
      type:Date,
      default:moment().format('YYYY-MM-DD')
    },
    start_date:{
        type:Date,
        require:true,
        default:moment().format('YYYY-MM-DD')
      },
      end_date:{
        type:Date,
        //default: after 21 days of start date
      },
    days:{
      type:Array,
      default:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
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

module.exports = mongoose.model("habbits", HabbitSchema);
