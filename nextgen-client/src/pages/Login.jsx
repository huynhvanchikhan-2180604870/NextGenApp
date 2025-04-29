import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaLock,
  FaSignInAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { signin } from "../store/features/auth/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [focusedInput, setFocusedInput] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(signin(formData)).unwrap();
      enqueueSnackbar("Đăng nhập thành công!", {
        variant: "success",
      });

      navigate("/home");
    } catch (error) {
      enqueueSnackbar(error || "Đăng nhập thất bại!", { variant: "error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl mt-[100px]"
    >
      <motion.h2
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold text-center text-[#516349] mb-8"
      >
        Đăng nhập
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <motion.input
            type="email"
            className="peer w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
            value={formData.email}
            onFocus={() => setFocusedInput({ ...focusedInput, email: true })}
            onBlur={(e) =>
              !e.target.value &&
              setFocusedInput({ ...focusedInput, email: false })
            }
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <motion.span
            initial={false}
            animate={{
              top: focusedInput.email || formData.email ? 0 : "50%",
              scale: focusedInput.email || formData.email ? 0.8 : 1,
              color:
                focusedInput.email || formData.email ? "#516349" : "#6B7280",
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
          >
            Email
          </motion.span>
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <motion.input
            type={showPassword ? "text" : "password"}
            className="peer w-full pl-10 pr-10 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300"
            value={formData.password}
            onFocus={() => setFocusedInput({ ...focusedInput, password: true })}
            onBlur={(e) =>
              !e.target.value &&
              setFocusedInput({ ...focusedInput, password: false })
            }
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <motion.span
            initial={false}
            animate={{
              top: focusedInput.password || formData.password ? 0 : "50%",
              scale: focusedInput.password || formData.password ? 0.8 : 1,
              color:
                focusedInput.password || formData.password
                  ? "#516349"
                  : "#6B7280",
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-10 px-1 bg-white transform -translate-y-1/2 pointer-events-none origin-left"
          >
            Mật khẩu
          </motion.span>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#516349] transition-colors"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-[#516349] text-[#516349]"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
            />
            <span className="text-sm text-gray-600 group-hover:text-[#516349] transition-colors">
              Ghi nhớ đăng nhập
            </span>
          </label>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-[#516349] hover:text-[#516349]/80 transition-colors"
            href="/forgot-password"
          >
            Quên mật khẩu?
          </motion.a>
        </div>

        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgb(81 99 73 / 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="relative w-[200px] mx-auto py-3 px-4 bg-[#516349] text-white rounded-lg overflow-hidden group transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaSignInAlt className="text-xl group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative font-medium tracking-wide">Đăng nhập</span>
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

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            {
              icon: <FaGoogle />,
              color: "text-white",
              bg: "bg-[#DB4437]",
              hover: "hover:bg-[#c53929]",
            },
            {
              icon: <FaFacebook />,
              color: "text-white",
              bg: "bg-[#4267B2]",
              hover: "hover:bg-[#365899]",
            },
            {
              icon: <FaGithub />,
              color: "text-white",
              bg: "bg-[#333]",
              hover: "hover:bg-[#242424]",
            },
          ].map((social, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex justify-center items-center py-3 px-4 rounded-lg ${social.bg} ${social.hover} transition-all duration-300 shadow-md`}
            >
              <span className={`text-xl ${social.color}`}>{social.icon}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
