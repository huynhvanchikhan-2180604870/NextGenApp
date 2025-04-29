const Banner = require("../models/banner.model");
const path = require("path");
const fs = require("fs");

exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const imagePath = `/uploads/banners/${req.file.filename}`;

    const newBanner = new Banner({
      image: imagePath,
      title: req.body.title || "Banner",
      order: req.body.order || 0,
    });

    await newBanner.save();

    return res.status(201).json({
      success: true,
      message: "Banner uploaded successfully",
      data: newBanner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// And update the deleteBanner to handle the new path format:
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Remove the leading slash and get actual file path
    const relativePath = banner.image.replace(/^\//, "");
    const imagePath = path.join(__dirname, "..", relativePath);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Banner.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// exports.deleteBanner = async (req, res) => {
//   try {
//     const banner = await Banner.findById(req.params.id);

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         message: "Banner not found",
//       });
//     }

//     // Delete image file
//     const imagePath = path.join(__dirname, "../uploads/banners", banner.image);
//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath);
//     }

//     await Banner.findByIdAndDelete(req.params.id);

//     return res.status(200).json({
//       success: true,
//       message: "Banner deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
