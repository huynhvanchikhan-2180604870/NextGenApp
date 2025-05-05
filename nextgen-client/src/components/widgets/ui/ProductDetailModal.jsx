// src/components/widgets/ui/ProductDetailModal.jsx
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";

const ProductDetailModal = ({ isOpen, onClose, product, onEdit, onDelete }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  if (!product) return null;

  const images = [product.coverImage, ...(product.images || [])];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* backdrop with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-1 bg-transparent bg-opacity-20 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all">
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Image Carousel */}
                  <div className="flex flex-col space-y-4 pt-5">
                    <motion.img
                      key={images[activeImageIndex]}
                      src={`http://localhost:3000${images[activeImageIndex]}`}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="flex gap-2 overflow-x-auto ">
                      {images.map((img, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${
                            activeImageIndex === idx
                              ? "ring-2 ring-[#516349]"
                              : "border-gray-200"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            loading="lazy"
                            src={`http://localhost:3000${img}`}
                            alt={`thumb-${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 pt-5">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">{product.shortDescription}</p>
                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <dt className="text-sm text-gray-500">Giá</dt>
                        <dd className="text-xl font-semibold text-[#516349]">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Công nghệ</dt>
                        <dd className="flex flex-wrap gap-2">
                          {product.technologies.map((t) => (
                            <span
                              key={t._id}
                              className="px-3 py-1 rounded-full bg-[#516349]/10 text-[#516349] text-sm"
                            >
                              {t.name}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Thống kê</dt>
                        <dd className="flex gap-6 text-gray-700 text-sm">
                          <div>
                            Lượt tải:{" "}
                            <span className="font-medium">
                              {product.downloads}
                            </span>
                          </div>
                          <div>
                            Lượt xem:{" "}
                            <span className="font-medium">{product.views}</span>
                          </div>
                        </dd>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onEdit(product);
                          onClose();
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                      >
                        <FaEdit />
                        Chỉnh sửa
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
                            onDelete(product._id);
                            onClose();
                          }
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      >
                        <FaTrash />
                        Xóa
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductDetailModal;
