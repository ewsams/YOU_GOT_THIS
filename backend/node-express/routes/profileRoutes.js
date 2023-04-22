const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

const { upload } = profileController;

router.post(
  "/:userId",
  upload.single("profileImage"),
  profileController.createProfile
);

router.get("/:userId", profileController.getProfileByUser);

router.put(
  "/:userId",
  upload.single("profileImage"),
  profileController.updateProfile
);
router.delete("/:userId", profileController.deleteProfile);

module.exports = router;
