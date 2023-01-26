const mongoose = require("mongoose");

const FutureLogsSchema = new mongoose.Schema(
  {
    log_type: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
      default: new Date().getFullYear()
    },
    duration: {
      type: Array,
      default: [],
    },
    tasks: {
      type: Array,
      default: false,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("futurelogs", FutureLogsSchema);
