import { AnimatePresence, motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FaChevronDown,
  FaChevronRight,
  FaCode,
  FaEdit,
  FaImage,
  FaTimes,
  FaTrash,
  FaBox,
  FaDollarSign,
  FaFileAlt,
  FaLink,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { WithContext as ReactTags } from "react-tag-input";
import { fetchCategories } from "../store/features/categories/categorySlice";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../store/features/products/productSlice";

const ProductManager = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [focusedInput, setFocusedInput] = useState({
    name: false,
    price: false,
    shortDescription: false,
    description: false,
    installation: false,
    videoUrl: false,
    technologies: false,
  });

  // Form State
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
  const [technologies, setTechnologies] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const [imagesPreviews, setImagesPreviews] = useState([]);

  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  // Dropzone for cover image
  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
      },
    });

  // Dropzone for product images
  const {
    getRootProps: getImagesRootProps,
    getInputProps: getImagesInputProps,
  } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setImages((prev) => [...prev, ...acceptedFiles]);
      setImagesPreviews((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => URL.createObjectURL(file)),
      ]);
    },
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        shortDescription: editingProduct.shortDescription,
        description: editingProduct.description,
        installation: editingProduct.installation,
        videoUrl: editingProduct.videoUrl || "",
        category: editingProduct.category,
        subCategory: editingProduct.subCategory || "",
      });
      setTechnologies(
        editingProduct.technologies.map((tech) => ({
          id: tech._id,
          text: tech.name,
        }))
      );
      setCoverPreview(
        `${import.meta.env.VITE_API_URL}${editingProduct.coverImage}`
      );
      setImagesPreviews(
        editingProduct.images.map(
          (img) => `${import.meta.env.VITE_API_URL}${img}`
        )
      );
      setSelectedCategory(
        categories.find((cat) => cat._id === editingProduct.category)
      );
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append(
        "technologies",
        JSON.stringify(technologies.map((tech) => tech.text))
      );

      if (coverImage) {
        formDataToSend.append("coverImage", coverImage);
      }

      if (images.length > 0) {
        images.forEach((img) => {
          formDataToSend.append("images", img);
        });
      }

      if (editingProduct) {
        await dispatch(
          updateProduct({
            id: editingProduct._id,
            formData: formDataToSend,
          })
        ).unwrap();
        enqueueSnackbar("Cập nhật sản phẩm thành công!", {
          variant: "success",
        });
      } else {
        await dispatch(createProduct(formDataToSend)).unwrap();
        enqueueSnackbar("Thêm sản phẩm thành công!", { variant: "success" });
      }

      resetForm();
    } catch (error) {
      enqueueSnackbar(error || "Lỗi khi lưu sản phẩm!", { variant: "error" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      shortDescription: "",
      description: "",
      installation: "",
      videoUrl: "",
      category: "",
      subCategory: "",
    });
    setTechnologies([]);
    setCoverImage(null);
    setCoverPreview("");
    setImages([]);
    setImagesPreviews([]);
    setEditingProduct(null);
    setSelectedCategory(null);
    setIsFormVisible(false);
  };

  const getCategoryInfo = (categoryId, subCategoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    if (!category)
      return {
        categoryName: "Không xác định",
        subCategoryName: "Không xác định",
      };

    const subCategory = category.children?.find(
      (sub) => sub._id === subCategoryId
    );
    return {
      categoryName: category.name,
      subCategoryName: subCategory?.name || "Không có",
    };
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        enqueueSnackbar("Xóa sản phẩm thành công!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error || "Lỗi khi xóa sản phẩm!", { variant: "error" });
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="p-8 mt-[100px]">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 mt-[100px]">
      {/* Toggle Form Button */}
      <div className="relative mb-6">
        <motion.button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#516349] text-white px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#516349]/90 transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isFormVisible ? "hide" : "show"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="whitespace-nowrap"
            >
              {isFormVisible ? "Ẩn biểu mẫu" : "Thêm sản phẩm mới"}
            </motion.span>
          </AnimatePresence>
          <motion.div
            animate={{
              rotate: isFormVisible ? 180 : 0,
              scale: isFormVisible ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown />
          </motion.div>
        </motion.button>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto space-y-8"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <motion.input
                      type="text"
                      className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
                      value={formData.name}
                      onFocus={() =>
                        setFocusedInput({ ...focusedInput, name: true })
                      }
                      onBlur={(e) =>
                        !e.target.value &&
                        setFocusedInput({ ...focusedInput, name: false })
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <motion.span
                      initial={false}
                      animate={{
                        top: focusedInput.name || formData.name ? 0 : "50%",
                        scale: focusedInput.name || formData.name ? 0.8 : 1,
                        color:
                          focusedInput.name || formData.name
                            ? "#516349"
                            : "#6B7280",
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
                    >
                      Tên sản phẩm
                    </motion.span>
                  </div>

                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <motion.input
                      type="number"
                      className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
                      value={formData.price}
                      onFocus={() =>
                        setFocusedInput({ ...focusedInput, price: true })
                      }
                      onBlur={(e) =>
                        !e.target.value &&
                        setFocusedInput({ ...focusedInput, price: false })
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                    <motion.span
                      initial={false}
                      animate={{
                        top: focusedInput.price || formData.price ? 0 : "50%",
                        scale: focusedInput.price || formData.price ? 0.8 : 1,
                        color:
                          focusedInput.price || formData.price
                            ? "#516349"
                            : "#6B7280",
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
                    >
                      Giá (VNĐ)
                    </motion.span>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat._id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              category: cat._id,
                              subCategory: "",
                            }));
                            setSelectedCategory(cat);
                          }}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                            formData.category === cat._id
                              ? "border-[#516349] bg-[#516349]/5"
                              : "border-gray-200 hover:border-[#516349]/50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                          {formData.category === cat._id && (
                            <FaChevronRight className="ml-auto text-[#516349]" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {selectedCategory && selectedCategory.children.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Danh mục con
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedCategory.children.map((subCat) => (
                          <motion.button
                            key={subCat._id}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                subCategory: subCat._id,
                              }))
                            }
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                              formData.subCategory === subCat._id
                                ? "border-[#516349] bg-[#516349]/5"
                                : "border-gray-200 hover:border-[#516349]/50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-lg">{subCat.icon}</span>
                            <span className="font-medium">{subCat.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: technologies.length > 0 ? 1 : 0,
                        scale: technologies.length > 0 ? 1 : 0.8,
                      }}
                      className="ml-auto"
                    >
                      {technologies.length > 0 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTechnologies([])}
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <FaTimes className="w-3 h-3" />
                          Xóa tất cả
                        </motion.button>
                      )}
                    </motion.div>
                  </div>
                  <div className="relative">
                    <FaCode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <div
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus-within:border-[#516349] transition-all duration-300"
                      onFocus={() =>
                        setFocusedInput((prev) => ({
                          ...prev,
                          technologies: true,
                        }))
                      }
                      onBlur={() => {
                        if (technologies.length === 0) {
                          setFocusedInput((prev) => ({
                            ...prev,
                            technologies: false,
                          }));
                        }
                      }}
                    >
                      <ReactTags
                        tags={technologies}
                        handleDelete={(i) =>
                          setTechnologies(
                            technologies.filter((_, index) => index !== i)
                          )
                        }
                        handleAddition={(tag) =>
                          setTechnologies([...technologies, tag])
                        }
                        delimiters={[188, 13]}
                        placeholder=""
                        inputProps={{
                          className: "outline-none border-none w-full",
                          onFocus: () =>
                            setFocusedInput((prev) => ({
                              ...prev,
                              technologies: true,
                            })),
                          onBlur: () => {
                            if (technologies.length === 0) {
                              setFocusedInput((prev) => ({
                                ...prev,
                                technologies: false,
                              }));
                            }
                          },
                        }}
                        classNames={{
                          tags: "flex flex-wrap gap-2",
                          tag: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#516349]/10 text-[#516349]",
                          tagInput: "mt-1 w-full",
                          remove:
                            "ml-2 text-[#516349]/60 hover:text-[#516349] cursor-pointer",
                          suggestions:
                            "absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200",
                          suggestionActive:
                            "bg-[#516349]/10 px-3 py-2 cursor-pointer",
                          suggestionDisabled: "opacity-50 px-3 py-2",
                        }}
                        inputFieldPosition="bottom"
                      />
                    </div>
                    <motion.span
                      initial={false}
                      animate={{
                        top:
                          technologies.length > 0 || focusedInput.technologies
                            ? 0
                            : "50%",
                        scale:
                          technologies.length > 0 || focusedInput.technologies
                            ? 0.8
                            : 1,
                        color:
                          technologies.length > 0 || focusedInput.technologies
                            ? "#516349"
                            : "#6B7280",
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute  left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
                    >
                      Thêm công nghệ...
                    </motion.span>
                  </div>
                </div>
                {/* Description Fields */}
                <div className="space-y-6">
                  <div className="relative">
                    <FaFileAlt className="absolute left-3 top-4 text-gray-400 pointer-events-none" />
                    <motion.textarea
                      value={formData.shortDescription}
                      className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
                      rows="2"
                      onFocus={() =>
                        setFocusedInput({
                          ...focusedInput,
                          shortDescription: true,
                        })
                      }
                      onBlur={(e) =>
                        !e.target.value &&
                        setFocusedInput({
                          ...focusedInput,
                          shortDescription: false,
                        })
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDescription: e.target.value,
                        })
                      }
                    />
                    <motion.span
                      initial={false}
                      animate={{
                        top:
                          focusedInput.shortDescription ||
                          formData.shortDescription
                            ? 0
                            : "20px",
                        scale:
                          focusedInput.shortDescription ||
                          formData.shortDescription
                            ? 0.8
                            : 1,
                        color:
                          focusedInput.shortDescription ||
                          formData.shortDescription
                            ? "#516349"
                            : "#6B7280",
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
                    >
                      Mô tả ngắn
                    </motion.span>
                  </div>

                  <div className="relative">
                    <FaFileAlt className="absolute left-3 top-4 text-gray-400 pointer-events-none" />
                    <motion.textarea
                      value={formData.description}
                      className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300 font-mono"
                      rows="4"
                      onFocus={() =>
                        setFocusedInput({ ...focusedInput, description: true })
                      }
                      onBlur={(e) =>
                        !e.target.value &&
                        setFocusedInput({ ...focusedInput, description: false })
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                    <motion.span
                      initial={false}
                      animate={{
                        top:
                          focusedInput.description || formData.description
                            ? 0
                            : "20px",
                        scale:
                          focusedInput.description || formData.description
                            ? 0.8
                            : 1,
                        color:
                          focusedInput.description || formData.description
                            ? "#516349"
                            : "#6B7280",
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
                    >
                      Mô tả chi tiết (HTML)
                    </motion.span>
                  </div>

                  <div className="relative">
                    <FaFileAlt className="absolute left-3 top-4 text-gray-400 pointer-events-none" />
                    <motion.textarea
                      value={formData.installation}
                      className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300 font-mono"
                      rows="4"
                      onFocus={() =>
                        setFocusedInput({ ...focusedInput, installation: true })
                      }
                      onBlur={(e) =>
                        !e.target.value &&
                        setFocusedInput({
                          ...focusedInput,
                          installation: false,
                        })
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          installation: e.target.value,
                        })
                      }
                    />
                    <motion.span
                      initial={false}
                      animate={{
                        top:
                          focusedInput.installation || formData.installation
                            ? 0
                            : "20px",
                        scale:
                          focusedInput.installation || formData.installation
                            ? 0.8
                            : 1,
                        color:
                          focusedInput.installation || formData.installation
                            ? "#516349"
                            : "#6B7280",
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
                    >
                      Hướng dẫn cài đặt (HTML)
                    </motion.span>
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ảnh bìa
                    </label>
                    <div {...getCoverRootProps()} className="cursor-pointer">
                      <input {...getCoverInputProps()} />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#516349] transition-colors">
                        {coverPreview ? (
                          <div className="relative w-full h-48">
                            <img
                              src={coverPreview}
                              alt="Cover preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverImage(null);
                                setCoverPreview("");
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              Kéo thả hoặc nhấp để tải lên ảnh bìa
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Images */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ảnh sản phẩm
                    </label>
                    <div {...getImagesRootProps()} className="cursor-pointer">
                      <input {...getImagesInputProps()} />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#516349] transition-colors">
                        <div className="text-center">
                          <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Kéo thả hoặc nhấp để tải lên ảnh sản phẩm
                          </p>
                        </div>
                      </div>
                    </div>
                    {imagesPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {imagesPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImages(images.filter((_, i) => i !== index));
                                setImagesPreviews(
                                  imagesPreviews.filter((_, i) => i !== index)
                                );
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video URL */}
                <div className="relative">
                  <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <motion.input
                    type="url"
                    className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
                    value={formData.videoUrl}
                    onFocus={() =>
                      setFocusedInput({ ...focusedInput, videoUrl: true })
                    }
                    onBlur={(e) =>
                      !e.target.value &&
                      setFocusedInput({ ...focusedInput, videoUrl: false })
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    placeholder=""
                  />
                  <motion.span
                    initial={false}
                    animate={{
                      top:
                        focusedInput.videoUrl || formData.videoUrl ? 0 : "50%",
                      scale:
                        focusedInput.videoUrl || formData.videoUrl ? 0.8 : 1,
                      color:
                        focusedInput.videoUrl || formData.videoUrl
                          ? "#516349"
                          : "#6B7280",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
                  >
                    URL Video (Không bắt buộc)
                  </motion.span>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-8 py-3 bg-[#516349] text-white rounded-lg hover:bg-[#516349]/90 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công nghệ
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thống kê
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {products.map((product) => {
                  const { categoryName, subCategoryName } = getCategoryInfo(
                    product.category,
                    product.subCategory
                  );

                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover shadow-sm"
                              src={`http://localhost:3000${
                                product.coverImage
                              }`}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#516349]/10 text-[#516349]">
                            {categoryName}
                          </span>
                          {subCategoryName !== "None" && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
                                {subCategoryName}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.technologies.map((tech) => (
                            <span
                              key={tech._id}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {product.downloads}
                            </span>
                            lượt tải
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium">{product.views}</span>
                            lượt xem
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormVisible(true);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            <FaEdit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <FaTrash className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
