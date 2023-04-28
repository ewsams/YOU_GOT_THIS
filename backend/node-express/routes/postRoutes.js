const express = require("express");
const router = express.Router();
const blogPostController = require("../controllers/blogPostController");

const { upload } = blogPostController;

router.post("/", upload, blogPostController.createBlogPost);

router.get("/", blogPostController.getBlogPosts);

router.get("/:id", blogPostController.getBlogPostById);

router.put("/:id", upload, blogPostController.updateBlogPost);

router.delete("/:id", blogPostController.deleteBlogPost);

module.exports = router;
