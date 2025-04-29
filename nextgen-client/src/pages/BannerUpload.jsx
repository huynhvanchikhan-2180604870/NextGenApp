import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";
import { uploadBanner } from "../store/features/banners/bannersSlice";

const BannerUpload = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.banners);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    title: "",
    order: 0,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar("Kích thước ảnh không được vượt quá 5MB!", {
          variant: "error",
        });
        return;
      }
      if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
        enqueueSnackbar("Chỉ chấp nhận file ảnh JPG, JPEG hoặc PNG!", {
          variant: "error",
        });
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      enqueueSnackbar("Vui lòng chọn ảnh banner!", { variant: "error" });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("image", selectedImage);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("order", formData.order);

    try {
      await dispatch(uploadBanner(formDataToSend)).unwrap();
      enqueueSnackbar("Tải lên banner thành công!", { variant: "success" });
      // Reset form
      setFormData({ title: "", order: 0 });
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      enqueueSnackbar(error || "Tải lên thất bại!", { variant: "error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full mx-auto p-8 bg-white rounded-2xl shadow-xl mt-[100px]"
    >
      <motion.h2
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold text-center text-[#516349] mb-8"
      >
        Tải lên Banner
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="hidden"
            id="banner-image"
          />
          <label
            htmlFor="banner-image"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
              ${
                previewUrl
                  ? "border-[#516349]"
                  : "border-gray-300 hover:border-[#516349]"
              }
              transition-all duration-300`}
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mb-4" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click để tải ảnh lên</span>{" "}
                  hoặc kéo thả vào đây
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG hoặc JPEG (Tối đa 5MB)
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Title Input */}
        <div className="relative">
          <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
            placeholder="Tiêu đề banner"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>

        {/* Order Input */}
        <div className="relative">
          <input
            type="number"
            className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
            placeholder="Thứ tự hiển thị"
            value={formData.order}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order: parseInt(e.target.value) || 0,
              }))
            }
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgb(81 99 73 / 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="relative w-full py-3 px-4 bg-[#516349] text-white rounded-lg 
            overflow-hidden group transition-all duration-300 flex items-center 
            justify-center gap-2 disabled:opacity-70"
        >
          <FaCloudUploadAlt className="text-xl group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative font-medium tracking-wide">
            {loading ? "Đang tải lên..." : "Tải lên"}
          </span>
          <motion.div
            initial={false}
            animate={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 40,
              damping: 15,
            }}
            className="absolute inset-0 bg-white/20 skew-x-12 group-hover:-translate-x-full transition-transform duration-700"
          />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default BannerUpload;
