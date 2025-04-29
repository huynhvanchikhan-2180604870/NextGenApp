import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  sendVerificationCode,
  verifyCode,
} from "../../../store/features/auth/authSlice";

const CodeVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);
  const timerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { loading } = useSelector((state) => state.auth);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [email, navigate]);

  const startTimer = () => {
    setTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = element.value;
      return newCode;
    });

    // Focus next input
    if (element.value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      // Clear current input if it has value
      if (code[index]) {
        setCode((prevCode) => {
          const newCode = [...prevCode];
          newCode[index] = "";
          return newCode;
        });
        return;
      }

      // Focus and clear previous input if current is empty
      if (index > 0) {
        inputs.current[index - 1].focus();
        setCode((prevCode) => {
          const newCode = [...prevCode];
          newCode[index - 1] = "";
          return newCode;
        });
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);
      inputs.current[5].focus();
    } else {
      enqueueSnackbar("Vui lòng dán đúng mã 6 số!", { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      enqueueSnackbar("Vui lòng nhập đủ mã 6 số!", { variant: "error" });
      return;
    }

    try {
      await dispatch(
        verifyCode({
          email,
          providedCode: verificationCode,
        })
      ).unwrap();

      enqueueSnackbar("Xác thực email thành công!", { variant: "success" });
      navigate("/login");
    } catch (error) {
      enqueueSnackbar(error || "Xác thực thất bại!", { variant: "error" });
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    try {
      await dispatch(sendVerificationCode(email)).unwrap();
      enqueueSnackbar("Đã gửi lại mã xác thực!", { variant: "success" });
      startTimer();
    } catch (error) {
      enqueueSnackbar(error || "Gửi mã thất bại!", { variant: "error" });
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
        Xác thực email
      </motion.h2>

      <p className="text-gray-600 text-center mb-6">
        Chúng tôi đã gửi mã xác thực đến email:{" "}
        <span className="font-medium">{email}</span>
      </p>

      <div className="flex justify-center gap-2 mb-8">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            ref={(el) => (inputs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg 
              focus:border-[#516349] focus:outline-none transition-all duration-300"
          />
        ))}
      </div>

      <motion.button
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 15px -3px rgb(81 99 73 / 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className="relative w-[200px] mx-auto py-3 px-4 bg-[#516349] text-white rounded-lg 
          overflow-hidden group transition-all duration-300 flex items-center justify-center 
          gap-2 disabled:opacity-70"
      >
        <FaCheckCircle className="text-xl group-hover:rotate-12 transition-transform duration-300" />
        <span className="relative font-medium tracking-wide">
          {loading ? "Đang xử lý..." : "Xác nhận"}
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

      <div className="mt-6 text-center">
        <button
          onClick={handleResendCode}
          disabled={timer > 0 || loading}
          className={`text-[#516349] transition duration-300 ${
            timer > 0 || loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-[#516349]/80"
          }`}
        >
          {timer > 0 ? `Gửi lại mã sau ${timer}s` : "Gửi lại mã"}
        </button>
      </div>
    </motion.div>
  );
};

export default CodeVerification;
