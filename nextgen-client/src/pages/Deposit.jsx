import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCopy, FaQrcode } from "react-icons/fa";

const depositAmounts = [
  { id: "50k", amount: 50000, label: "50.000đ" },
  { id: "100k", amount: 100000, label: "100.000đ" },
  { id: "200k", amount: 200000, label: "200.000đ" },
  { id: "500k", amount: 500000, label: "500.000đ" },
  { id: "1000k", amount: 1000000, label: "1.000.000đ" },
];

const mockTransactions = [
  {
    id: "TX001",
    amount: 500000,
    status: "success",
    date: "2024-04-27T10:30:00",
    transactionId: "OCB123456789",
  },
  {
    id: "TX002",
    amount: 200000,
    status: "pending",
    date: "2024-04-27T09:15:00",
    transactionId: "OCB987654321",
  },
];

const MIN_AMOUNT = 50000;
const MAX_AMOUNT = 1000000000000; // 1.000.000.000.000đ

const Deposit = () => {
  const [selectedAmount, setSelectedAmount] = useState(MIN_AMOUNT);
  const [customAmount, setCustomAmount] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [copied, setCopied] = useState({
    account: false,
    amount: false,
    code: false,
  });

  const bankInfo = {
    accountNumber: "0961800341",
    accountName: "HUYNH VAN CHI KHAN",
    bankName: "OCB",
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount("");
  };

  useEffect(() => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTransactionCode(`NG${random}`);
  }, []);

  const amountValue = parseInt(customAmount);
  const isBelowMin = customAmount !== "" && amountValue < MIN_AMOUNT;
  const isAboveMax = customAmount !== "" && amountValue > MAX_AMOUNT;

  const finalAmount =
    customAmount !== "" && (isBelowMin || isAboveMax)
      ? selectedAmount || MIN_AMOUNT
      : amountValue || selectedAmount || MIN_AMOUNT;

  const getVietQRUrl = () => {
    const base = "https://api.vietqr.io/image/OCB-0961800341";
    const params = new URLSearchParams({
      accountName: bankInfo.accountName,
      amount: finalAmount,
      addInfo: transactionCode,
    });
    return `${base}-compact2.jpg?${params.toString()}`;
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-[100px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column - Amount Selection & Bank Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Chọn số tiền nạp
            </h2>

            {/* Amount Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {depositAmounts.map((option) => (
                <label
                  key={option.id}
                  className="relative flex items-center group"
                >
                  <input
                    type="radio"
                    name="amount"
                    className="peer sr-only"
                    checked={selectedAmount === option.amount}
                    onChange={() => {
                      setSelectedAmount(option.amount);
                      setCustomAmount("");
                    }}
                  />
                  <div className="w-full p-4 rounded-lg border-2 transition-all duration-300 peer-checked:border-[#516349] peer-checked:bg-[#516349]/5 border-gray-200 hover:border-[#516349]/50 cursor-pointer">
                    <span className="font-medium text-gray-900 peer-checked:text-[#516349]">
                      {option.label}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 peer-checked:border-[#516349] peer-checked:bg-[#516349] border-gray-300 transition-all duration-300">
                    <svg
                      className="w-full h-full text-white p-[2px] opacity-0 peer-checked:opacity-100"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                      />
                    </svg>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hoặc nhập số tiền khác (Từ 50.000đ đến 1.000.000.000.000đ)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  min="0"
                  max={MAX_AMOUNT}
                  step="1000"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#516349] focus:outline-none transition-all duration-300 hover:border-[#516349]/50 bg-white appearance-none placeholder:text-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Nhập số tiền..."
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  VNĐ
                </span>
                <div className="absolute left-0 bottom-0 w-full h-[2px] bg-[#516349] scale-x-0 transition-transform duration-300 origin-left peer-focus:scale-x-100" />
              </div>
              {customAmount !== "" && (isBelowMin || isAboveMax) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {isBelowMin
                    ? "Vui lòng nạp số tiền trên 50.000đ"
                    : "Số tiền tối đa là 1.000.000.000.000đ"}
                </motion.p>
              )}
            </div>

            {/* Bank Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">
                Thông tin chuyển khoản
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Số tài khoản",
                    value: bankInfo.accountNumber,
                    type: "account",
                  },
                  { label: "Chủ tài khoản", value: bankInfo.accountName },
                  { label: "Ngân hàng", value: bankInfo.bankName },
                  {
                    label: "Số tiền",
                    value: finalAmount.toLocaleString() + "đ",
                    type: "amount",
                  },
                  {
                    label: "Nội dung CK",
                    value: transactionCode,
                    type: "code",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      {item.type && (
                        <button
                          onClick={() => handleCopy(item.value, item.type)}
                          disabled={
                            item.type === "amount" && (isBelowMin || isAboveMax)
                          }
                          className="p-1.5 text-gray-500 hover:text-[#516349] rounded-lg transition-colors disabled:opacity-50"
                          title="Sao chép"
                        >
                          {copied[item.type] ? (
                            <span className="text-[#516349] text-sm">
                              Đã sao chép!
                            </span>
                          ) : (
                            <FaCopy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - QR Code & Transaction History */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <FaQrcode className="text-[#516349]" /> Quét mã QR để thanh toán
            </h2>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-xl shadow-inner">
                <img
                  src={getVietQRUrl()}
                  alt="VietQR Payment QR Code"
                  className="w-[250px] h-[250px] object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Quét mã QR bằng ứng dụng ngân hàng để tự động điền thông tin
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Lịch sử giao dịch
            </h2>
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800">
                      {tx.amount.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        tx.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tx.status === "success" ? "Thành công" : "Đang xử lý"}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {tx.transactionId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Deposit;
