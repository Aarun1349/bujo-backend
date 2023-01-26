const mongoose = require("mongoose");

const CollectionsSchema = new mongoose.Schema(
  {
    collection_name:{
      type:String,
      required:true
    },
    collection_items: {
      type: Array,
      default: [],
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("collections", CollectionsSchema);
