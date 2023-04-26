const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const allowedOrigins = [
  "http://you-got-this-front-end.s3-website-us-east-1.amazonaws.com", 
  "http://localhost:4200"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};



const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));


mongoose
  .connect(
    "mongodb+srv://Cluster14487:211233Edward@cluster14487.drbjptr.mongodb.net/you_got_this_ai_users?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(err));

app.use("/api/auth/", authRoutes);
app.use("/api/profile/", profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));



