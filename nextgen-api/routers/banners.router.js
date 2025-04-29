const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadBanner,
  getBanners,
  deleteBanner,
} = require("../controllers/banner.controller");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/banners");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Routes
router.post("/upload", upload.single("image"), uploadBanner);
router.get("/", getBanners);
router.delete("/:id", deleteBanner);

module.exports = router;
