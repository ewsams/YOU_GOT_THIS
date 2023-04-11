const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  imageUrl: { type: String, default: null },
  bio: String,
  location: String,
});

module.exports = mongoose.model("Profile", ProfileSchema);
