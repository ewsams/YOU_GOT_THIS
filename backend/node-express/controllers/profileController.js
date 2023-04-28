require("dotenv").config();
const multer = require("multer");
const path = require("path");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const Profile = require("../models/Profile");
const s3 = new S3Client({ region: `${process.env.AWS_REGION}` });
const User = require("../models/User");

// Configure the AWS SDK
const s3Client = new S3Client({
  region: `${process.env.AWS_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Please upload an image file"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFileFilter });

const uploadToS3 = async (file) => {
  const params = {
    Bucket: `${process.env.AWS_S3_PROFILE_BUCKET_NAME}`,
    Key: `profile-images/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.send(new PutObjectCommand(params), (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(
          `https://${process.env.AWS_S3_PROFILE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
        );
      }
    });
  });
};

const deleteFromS3 = async (imageUrl) => {
  const s3Params = {
    Bucket: `${process.env.AWS_S3_PROFILE_BUCKET_NAME}`,
    Key: imageUrl.split("/").slice(-2).join("/"),
  };

  const deleteCommand = new DeleteObjectCommand(s3Params);
  await s3Client.send(deleteCommand);
};

exports.createProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, bio, location } = req.body;
    const imageUrl = req.file ? await uploadToS3(req.file) : null;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the profile already exists
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    // Create a new profile
    profile = new Profile({
      user: userId,
      name,
      imageUrl,
      bio,
      location,
    });

    // Save the new profile to the database
    await profile.save();

    res.status(201).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, bio, location } = req.body;
    const imageUrl = req.file ? await uploadToS3(req.file) : null;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          name: name || profile.name,
          imageUrl: imageUrl || profile.imageUrl,
          bio: bio || profile.bio,
          location: location || profile.location,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.upload = upload;

exports.deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Delete the image from S3
    await deleteFromS3(profile.imageUrl);

    // Delete the profile from the database
    await Profile.findOneAndDelete({ user: userId });

    res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfileByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
