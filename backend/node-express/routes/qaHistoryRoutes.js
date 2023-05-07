const express = require("express");
const router = express.Router();
const qaHistoryController = require("../controllers/qaHistoryController");

router.post("/create", qaHistoryController.createQaHistory);
router.get("/user/:userId", qaHistoryController.getQaHistoryByUserId);
router.get("/chat/:chatId", qaHistoryController.getQaHistoryByChatId);
router.get("/embeddings/:chat_id", qaHistoryController.getEmbeddingsByChatId);
router.put("/update/:id", qaHistoryController.updateQaHistory);
router.delete("/delete/:id", qaHistoryController.deleteQaHistory);

module.exports = router;
