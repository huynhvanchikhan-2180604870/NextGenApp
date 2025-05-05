const Product = require("../models/product.model");
const Technology = require("../models/technology.model");
const path = require("path");
const fs = require("fs");
const { console } = require("inspector");

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      shortDescription,
      description,
      installation,
      videoUrl,
      technologies,
      category,
      subCategory,
    } = req.body;
    console.log("Create product Data: ", req.body);
    // Validate required fields
    if (!name || !price || !shortDescription || !description || !installation) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Process uploaded files
    if (!req.files || !req.files.coverImage || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: "Cover image and product images are required",
      });
    }

    // Process technologies array
    const techArray = JSON.parse(technologies);
    const techIds = await Promise.all(
      techArray.map(async (techName) => {
        let tech = await Technology.findOne({ name: techName });
        if (!tech) {
          tech = await Technology.create({
            name: techName,
            icon: "⚙️", // Default icon
          });
        }
        return tech._id;
      })
    );

    const newProduct = new Product({
      name,
      price: Number(price),
      shortDescription,
      description,
      installation,
      coverImage: `/uploads/products/${req.files.coverImage[0].filename}`,
      images: req.files.images.map(
        (file) => `/uploads/products/${file.filename}`
      ),
      videoUrl,
      technologies: techIds,
      category,
      subCategory,
      //   author: req.user._id, // Assuming you have authentication middleware
    });

    await newProduct.save();
    await newProduct.populate("technologies", "name icon");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      const files = [
        ...(req.files.images || []),
        ...(req.files.coverImage || []),
      ];
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const { category, search, technology, sort = "-createdAt" } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }
    if (technology) {
      const tech = await Technology.findOne({
        name: { $regex: technology, $options: "i" },
      });
      if (tech) query.technologies = tech._id;
    }

    const products = await Product.find(query)
      .populate("technologies", "name icon")
      .sort(sort);

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "technologies",
      "name icon"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment views
    await product.incrementViews();

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      shortDescription,
      description,
      installation,
      videoUrl,
      technologies,
      category,
      subCategory,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Process new images if uploaded
    let coverImage = product.coverImage;
    let images = product.images;

    if (req.files) {
      if (req.files.coverImage) {
        // Delete old cover image
        const oldCoverPath = path.join(__dirname, "..", product.coverImage);
        if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);

        coverImage = `/uploads/products/${req.files.coverImage[0].filename}`;
      }

      if (req.files.images) {
        // Delete old images
        product.images.forEach((img) => {
          const oldPath = path.join(__dirname, "..", img);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        });

        images = req.files.images.map(
          (file) => `/uploads/products/${file.filename}`
        );
      }
    }

    // Process technologies if provided
    let techIds = product.technologies;
    if (technologies) {
      const techArray = JSON.parse(technologies);
      techIds = await Promise.all(
        techArray.map(async (techName) => {
          let tech = await Technology.findOne({ name: techName });
          if (!tech) {
            tech = await Technology.create({
              name: techName,
              icon: "⚙️",
            });
          }
          return tech._id;
        })
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: price ? Number(price) : product.price,
        shortDescription,
        description,
        installation,
        coverImage,
        images,
        videoUrl,
        technologies: techIds,
        category,
        subCategory,
      },
      { new: true }
    ).populate("technologies", "name icon");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    // Clean up any newly uploaded files if there's an error
    if (req.files) {
      const files = [
        ...(req.files.images || []),
        ...(req.files.coverImage || []),
      ];
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete associated images
    const imagePaths = [product.coverImage, ...product.images];
    imagePaths.forEach((img) => {
      const fullPath = path.join(__dirname, "..", img);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = {
      name: req.user.fullname, // Assuming you have user info from auth middleware
      rating: Number(rating),
      comment,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.user._id}`,
    };

    product.reviews.push(review);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Increment downloads
exports.incrementDownloads = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.incrementDownloads();

    return res.status(200).json({
      success: true,
      message: "Downloads incremented successfully",
      downloads: product.downloads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
