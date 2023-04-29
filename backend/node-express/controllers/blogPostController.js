require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
const BlogPost = require("../models/BlogPost");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
}).array("images", 6);

const uploadFilesToS3 = async (files) => {
  const uploadedFileUrls = [];

  for (const file of files) {
    const key = Date.now().toString() + "-" + file.originalname;
    const uploadParams = {
      Bucket: process.env.AWS_S3_POST_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    const upload = new Upload({ client: s3, params: uploadParams });

    const response = await upload.done();
    uploadedFileUrls.push(response.Location);
  }

  return uploadedFileUrls;
};

const createBlogPost = async (req, res) => {
  try {
    const images = await uploadFilesToS3(req.files);
    const blogPost = await BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      images,
    });
    res.status(201).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      res.status(404).json({ message: "Blog post not found" });
    } else {
      res.status(200).json(blogPost);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const images = req.files.map((file) => file.location);

    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, author, images },
      { new: true, runValidators: true }
    );

    if (!updatedBlogPost) {
      res.status(404).json({ message: "Blog post not found" });
    } else {
      res.status(200).json(updatedBlogPost);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);

    if (!blogPost) {
      res.status(404).json({ message: "Blog post not found" });
    } else {
      res.status(204).json({ message: "Blog post deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upload,
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
