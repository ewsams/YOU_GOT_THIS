const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const qaHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  qa: [qaSchema],
  embeddingsUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("QaHistory", qaHistorySchema);
