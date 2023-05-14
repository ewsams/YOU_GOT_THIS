const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  imageUrl: { type: String, default: null },
  bio: { type: String, required: false},
  company: { type: String, required: false},
  email: { type: String, required: false},
},  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model("Profile", ProfileSchema);
