const express = require("express");
const router = express.Router();
const blogPostController = require("../controllers/blogPostController");


router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    next();
  });

const { upload } = blogPostController;

router.post("/", upload, blogPostController.createBlogPost);

router.get("/", blogPostController.getBlogPosts);

router.get("/:id", blogPostController.getBlogPostById);

router.put("/:id", upload, blogPostController.updateBlogPost);

router.delete("/:id", blogPostController.deleteBlogPost);

module.exports = router;
