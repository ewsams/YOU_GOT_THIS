const express = require("express");
const router = express.Router();

const {
  createQaHistory,
  updateQaHistory,
  deleteQaHistory,
  getQaHistoryByUserId,
  getQaHistoryById,
  getEmbeddingsByQaHistoryId,
  getQaHistoriesByUserIdAndType,
  updateQaHistoryTitle
} = require("../controllers/qaHistoryController");

router.post("/", createQaHistory);
router.put("/:id", updateQaHistory);
router.put("/:id/title", updateQaHistoryTitle);
router.delete("/:id", deleteQaHistory);
router.get("/user/:userId", getQaHistoryByUserId);
router.get("/:id", getQaHistoryById);
router.get("/embeddings/:id", getEmbeddingsByQaHistoryId);
router.get("/user/:userId/type", getQaHistoriesByUserIdAndType);

module.exports = router;
