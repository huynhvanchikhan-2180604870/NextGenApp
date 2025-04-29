import { AnimatePresence, motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { WithContext as ReactTags } from "react-tag-input";
import {
  createProduct,
  updateProduct,
} from "../store/features/products/productSlice";

const ProductForm = ({ isOpen, onClose, product, categories }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    shortDescription: "",
    description: "",
    installation: "",
    videoUrl: "",
    category: "",
    subCategory: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const [imagesPreviews, setImagesPreviews] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        shortDescription: product.shortDescription,
        description: product.description,
        installation: product.installation,
        videoUrl: product.videoUrl || "",
        category: product.category,
        subCategory: product.subCategory || "",
      });
      setTechnologies(
        product.technologies.map((tech) => ({
          id: tech._id,
          text: tech.name,
        }))
      );
      setCoverPreview(`${import.meta.env.VITE_API_URL}${product.coverImage}`);
      setImagesPreviews(
        product.images.map((img) => `${import.meta.env.VITE_API_URL}${img}`)
      );
    }
  }, [product]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formDataToSend = new FormData();

    // Required fields validation
    if (!formData.name || !formData.price || !formData.category) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
      });
      return;
    }

    // If creating new product, require cover image
    if (!product && !coverImage) {
      enqueueSnackbar("Cover image is required", { variant: "error" });
      return;
    }

    // Add basic fields
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        // Only append if value exists
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add technologies as JSON string
    const techArray = technologies.map((tech) => tech.text);
    formDataToSend.append("technologies", JSON.stringify(techArray));

    // Add files only if they exist
    if (coverImage) {
      formDataToSend.append("coverImage", coverImage);
    }

    if (images.length > 0) {
      images.forEach((img) => {
        formDataToSend.append("images", img);
      });
    }

    // Debug logs
    console.log("Submitting form data:");
    console.log("Form fields:", Object.fromEntries(formDataToSend.entries()));
    console.log("Cover image:", coverImage);
    console.log("Additional images:", images);
    console.log("Technologies:", techArray);

    // Send request with proper error handling
    if (product) {
      const result = await dispatch(
        updateProduct({
          id: product._id,
          formData: formDataToSend,
        })
      ).unwrap();

      if (result.success) {
        enqueueSnackbar("Product updated successfully!", {
          variant: "success",
        });
        onClose();
      } else {
        throw new Error(result.message || "Failed to update product");
      }
    } else {
      const result = await dispatch(createProduct(formDataToSend)).unwrap();

      if (result.success) {
        enqueueSnackbar("Product created successfully!", {
          variant: "success",
        });
        onClose();
      } else {
        throw new Error(result.message || "Failed to create product");
      }
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    enqueueSnackbar(
      error.message || "Failed to save product! Please try again.",
      { variant: "error" }
    );
  }
};
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagesPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTechnology = (tag) => {
    setTechnologies([...technologies, tag]);
  };

  const handleDeleteTechnology = (i) => {
    setTechnologies(technologies.filter((tag, index) => index !== i));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {product ? "Edit Product" : "Create Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (VND)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                  required
                />
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      subCategory: "",
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subCategory: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find((cat) => cat._id === formData.category)
                    ?.children.map((subCat) => (
                      <option key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>
              <ReactTags
                tags={technologies}
                handleDelete={handleDeleteTechnology}
                handleAddition={handleAddTechnology}
                delimiters={[188, 13]} // comma and enter
                placeholder="Add technologies..."
                classNames={{
                  tags: "flex flex-wrap gap-2",
                  tagInput:
                    "px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349] w-full",
                  tag: "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1",
                  remove: "text-blue-600 hover:text-blue-800 cursor-pointer",
                }}
              />
            </div>

            {/* Description Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                  rows="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Installation Guide
                </label>
                <textarea
                  value={formData.installation}
                  onChange={(e) =>
                    setFormData({ ...formData, installation: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="cover-image"
                  />
                  <label
                    htmlFor="cover-image"
                    className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <FaCloudUploadAlt className="w-5 h-5" />
                    Choose Cover Image
                  </label>
                  {coverPreview && (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage(null);
                          setCoverPreview("");
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                    id="product-images"
                  />
                  <label
                    htmlFor="product-images"
                    className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <FaCloudUploadAlt className="w-5 h-5" />
                    Add Images
                  </label>
                </div>
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#516349] focus:border-[#516349]"
                placeholder="YouTube embed URL"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#516349] text-white rounded-lg hover:bg-[#516349]/90"
              >
                {product ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductForm;
