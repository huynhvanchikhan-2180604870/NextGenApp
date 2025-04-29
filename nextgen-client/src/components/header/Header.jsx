import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCreditCard,
  FaHeart,
  FaHistory,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "../../store/features/auth/authSlice";

const navLinks = [
  // { name: "Trang Chủ", to: "/home" },
  // { name: "Sản phẩm", to: "/product" },
  // { name: "Liên hệ", to: "/contacts" },
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const profileRef = useRef(null);

  const userMenu = [
    {
      name: "Thông tin cá nhân",
      to: "/profile",
      icon: (
        <FaUser className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:text-[#516349]" />
      ),
    },
    {
      name: `Số dư: ${user?.wallet?.toLocaleString() || 0}đ`,
      to: "/wallet",
      icon: (
        <FaWallet className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:text-[#516349]" />
      ),
    },
    {
      name: "Nạp tiền",
      to: "/deposit",
      icon: (
        <FaCreditCard className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:text-[#516349]" />
      ),
    },
    {
      name: "Lịch sử mua hàng",
      to: "/orders",
      icon: (
        <FaHistory className="w-4 h-4 transition-transform group-hover:rotate-180 group-hover:text-[#516349]" />
      ),
    },
    {
      name: "Sản phẩm yêu thích",
      to: "/favorites",
      icon: (
        <FaHeart className="w-4 h-4 transition-transform group-hover:scale-125 group-hover:text-[#516349]" />
      ),
    },
    {
      name: "Đăng xuất",
      to: "#",
      onClick: async () => {
        await dispatch(signout());
      },
      icon: (
        <FaSignOutAlt className="w-4 h-4 transition-transform group-hover:-translate-x-1 group-hover:text-[#516349]" />
      ),
    },
  ];

  const handleClickOutside = (e) => {
    const clickedDesktopOutside =
      desktopSearchRef.current && !desktopSearchRef.current.contains(e.target);
    const clickedMobileOutside =
      mobileSearchRef.current && !mobileSearchRef.current.contains(e.target);

    if (
      isSearchOpen &&
      !searchValue &&
      clickedDesktopOutside &&
      clickedMobileOutside
    ) {
      setIsSearchOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, searchValue]);

  const handleSearch = () => {
    const q = searchValue.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const openAndFocus = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      document.querySelector("input.search-input")?.focus();
    }, 200);
  };

  return (
    <header className="fixed z-20 w-full top-0 left-0 bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="font-extrabold text-2xl tracking-[0.11em]">
          NextGen
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden md:flex gap-7 items-center flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-base font-medium transition hover:text-[#516349] text-gray-700"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search (desktop) */}
          <div className="relative" ref={desktopSearchRef}>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={
                isSearchOpen
                  ? { width: 256, opacity: 1 }
                  : { width: 0, opacity: 0 }
              }
              transition={{ duration: 0.2 }}
              className="relative flex items-center overflow-hidden bg-white border border-gray-200 rounded-lg"
            >
              <input
                type="text"
                className="search-input flex-1 px-3 py-1 focus:outline-none"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="p-2"
                disabled={!searchValue.trim()}
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </motion.div>
            {!isSearchOpen && (
              <button
                onClick={openAndFocus}
                className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700 absolute right-0 top-1/2 -translate-y-1/2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Profile / Auth (desktop) */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((o) => !o)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src={
                    user?.profilePicture ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">{user?.fullname}</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-200 z-20"
                  >
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200" />
                    <div className="py-2">
                      {userMenu.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          onClick={(e) => {
                            if (item.onClick) {
                              e.preventDefault();
                              item.onClick();
                            }
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition text-gray-700 group"
                        >
                          <span className="text-gray-500">{item.icon}</span>
                          <span className="hover:text-[#516349]">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition text-[#516349]"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-[#516349] text-white hover:bg-[#516349]/90 transition"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          {/* Search (mobile) */}
          <div className="relative" ref={mobileSearchRef}>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={
                isSearchOpen
                  ? { width: 160, opacity: 1 }
                  : { width: 0, opacity: 0 }
              }
              transition={{ duration: 0.2 }}
              className="relative flex items-center overflow-hidden bg-white border border-gray-200 rounded-lg"
            >
              <input
                type="text"
                className="search-input flex-1 px-3 py-1 text-sm focus:outline-none"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="p-2"
                disabled={!searchValue.trim()}
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </motion.div>
            {!isSearchOpen && (
              <button
                onClick={openAndFocus}
                className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
          >
            <div className="w-6 flex flex-col items-end gap-1.5">
              <span
                className={`h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                }`}
              />
              <span
                className={`h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? "w-6 opacity-0" : "w-5"
                }`}
              />
              <span
                className={`h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-4"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[72px] bg-white z-50"
          >
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex flex-col px-6 py-4 max-h-[calc(100vh-72px)] overflow-y-auto"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="py-3 text-lg text-gray-700 hover:text-[#516349] transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-3 py-3">
                    <img
                      src={
                        user?.profilePicture ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {user?.fullname}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {userMenu.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 text-lg text-gray-700 hover:text-[#516349] transition"
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link
                    to="/login"
                    className="py-3 text-lg text-center text-gray-700 hover:bg-gray-100 transition rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="py-3 text-lg text-center bg-[#516349] text-white hover:bg-[#516349]/90 transition rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
