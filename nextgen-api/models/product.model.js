const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/avataaars/svg",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    installation: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    videoUrl: {
      type: String,
    },
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "technologies",
      },
    ],
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      ref: "categories",
    },
    subCategory: {
      type: String,
      ref: "categories",
    },
    reviews: [reviewSchema],
    
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate average rating before saving
productSchema.pre("save", function (next) {
  if (this.reviews?.length > 0) {
    this.averageRating =
      this.reviews.reduce((acc, review) => acc + review.rating, 0) /
      this.reviews.length;
  }
  next();
});

// Method to increment downloads
productSchema.methods.incrementDownloads = async function () {
  this.downloads += 1;
  return this.save();
};

// Method to increment views
productSchema.methods.incrementViews = async function () {
  this.views += 1;
  return this.save();
};

const Product = mongoose.model("products", productSchema);
module.exports = Product;
