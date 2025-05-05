// src/pages/ProductForm.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaSearch,
  FaSort,
  FaTrash,
  FaFilter,
} from "react-icons/fa";
import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

import ProductDetailModal from "../components/widgets/ui/ProductDetailModal";

const ProductForm = ({ products, onEdit, onDelete, onBatchDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 10;

  // Memoized sorting
  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return products;
    return [...products].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      const order = sortConfig.direction === "asc" ? 1 : -1;
      if (aVal > bVal) return order;
      if (aVal < bVal) return -order;
      return 0;
    });
  }, [products, sortConfig]);

  // Memoized filtering
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory
        ? p.category === filterCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [sortedProducts, searchTerm, filterCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 mt-[60px]">
      {/* Mobile: toggle filters */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setShowFilters((open) => !open)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
        >
          <FaFilter />
          <span>Lọc & Tìm kiếm</span>
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } md:flex flex-wrap items-center justify-end gap-4 bg-white p-4 rounded-lg shadow-sm transition-all`}
      >
        <div className="relative w-full md:w-1/3 ">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:border-[#516349] outline-none transition"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="py-2 px-4 border rounded-lg focus:border-[#516349] outline-none"
        >
          <option value="">Tất cả danh mục</option>
          <option value="tech">Công nghệ</option>
          <option value="lifestyle">Đời sống</option>
        </select>
        {selectedIds.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBatchDelete(selectedIds)}
            className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Xóa đã chọn ({selectedIds.length})
          </motion.button>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === currentProducts.length &&
                    currentProducts.length > 0
                  }
                  onChange={() => {
                    const ids = currentProducts.map((p) => p._id);
                    setSelectedIds((prev) =>
                      prev.length === ids.length ? [] : ids
                    );
                  }}
                />
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center gap-2">
                  <span>Sản phẩm</span>
                  <FaSort
                    className={`transition ${
                      sortConfig.key === "name"
                        ? "text-[#516349]"
                        : "text-gray-400"
                    }`}
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("price")}
              >
                <div className="flex items-center gap-2">
                  <span>Giá</span>
                  <FaSort
                    className={`transition ${
                      sortConfig.key === "price"
                        ? "text-[#516349]"
                        : "text-gray-400"
                    }`}
                  />
                </div>
              </th>
              <th className="px-6 py-3">Thống kê</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {currentProducts.map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product._id)}
                      onChange={() => toggleSelect(product._id)}
                    />
                  </td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      loading="lazy"
                      src={`http://localhost:3000${product.coverImage}`}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div
                      className="max-w-xs truncate hover:overflow-visible relative"
                      title={product.name}
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <div>
                      Lượt tải:{" "}
                      <span className="font-semibold">{product.downloads}</span>
                    </div>
                    <div>
                      Lượt xem:{" "}
                      <span className="font-semibold">{product.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {/* Xem chi tiết */}
                      <motion.button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDetailModalOpen(true);
                        }}
                        title="Xem chi tiết"
                        className="bg-blue-50 text-blue-600 p-2 rounded-full shadow-sm hover:bg-blue-100 transition-colors"
                        initial={{ y: 0 }}
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9, y: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </motion.button>

                      {/* Chỉnh sửa */}
                      <motion.button
                        onClick={() => onEdit(product)}
                        title="Chỉnh sửa"
                        className="bg-indigo-50 text-indigo-600 p-2 rounded-full shadow-sm hover:bg-indigo-100 transition-colors"
                        initial={{ y: 0 }}
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9, y: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <HiOutlinePencilAlt className="w-5 h-5" />
                      </motion.button>

                      {/* Xóa */}
                      <motion.button
                        onClick={() => onDelete(product._id)}
                        title="Xóa"
                        className="bg-red-50 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-100 transition-colors"
                        initial={{ y: 0 }}
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9, y: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center items-center gap-2 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1 ? "bg-[#516349] text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg"
          >
            Tiếp
          </button>
        </motion.div>
      )}

      {/* Detail modal */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default ProductForm;
