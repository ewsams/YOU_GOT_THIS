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
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const qaHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  qa: [qaSchema],
  embeddingsUrl: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["pdf", "audio"],
    required: true,
    },
   },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model("QaHistory", qaHistorySchema);
