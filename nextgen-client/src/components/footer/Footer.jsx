import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaDiscord, FaYoutube } from "react-icons/fa";

const links = [
  {
    category: "THÔNG TIN",
    items: [
      { label: "Về NextGen", url: "/about" },
      { label: "Blog & Hướng dẫn", url: "/blog" },
      { label: "Điều khoản sử dụng", url: "/terms" },
      { label: "Chính sách bảo mật", url: "/privacy" },
      { label: "Liên hệ", url: "/contact" },
    ],
  },
  {
    category: "DỊCH VỤ",
    items: [
      { label: "Marketplace", url: "/marketplace" },
      { label: "Tải source code", url: "/downloads" },
      { label: "Báo cáo bản quyền", url: "/report" },
      { label: "Trở thành người bán", url: "/become-seller" },
      { label: "Hỗ trợ kỹ thuật", url: "/support" },
    ],
  },
  {
    category: "TÀI NGUYÊN",
    items: [
      { label: "Tài liệu API", url: "/docs/api" },
      { label: "Hướng dẫn tích hợp", url: "/docs/integration" },
      { label: "Cộng đồng", url: "/community" },
      { label: "Câu hỏi thường gặp", url: "/faq" },
    ],
  },
];

const socials = [
  {
    alt: "GitHub",
    url: "https://github.com/nextgen",
    icon: <FaGithub className="w-6 h-6" />,
  },
  {
    alt: "LinkedIn",
    url: "https://linkedin.com/company/nextgen",
    icon: <FaLinkedin className="w-6 h-6" />,
  },
  {
    alt: "Discord",
    url: "https://discord.gg/nextgen",
    icon: <FaDiscord className="w-6 h-6" />,
  },
  {
    alt: "YouTube",
    url: "https://youtube.com/@nextgen",
    icon: <FaYoutube className="w-6 h-6" />,
  },
];

const Footer = () => (
  <footer className="bg-[#516349] text-white py-12 mt-16 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-8 justify-between">
      <div className="mb-6 w-full md:w-auto">
        <div className="font-extrabold text-2xl mb-2 tracking-[0.11em] text-white">
          NextGen
        </div>
        <div className="text-sm">NEXTGEN TECHNOLOGY SOLUTIONS</div>
        <div className="text-xs mt-2 text-white">
          Nơi cung cấp giải pháp source code
          <br />
          chất lượng cho doanh nghiệp và nhà phát triển
        </div>
      </div>

      <div className="flex flex-1 gap-14 flex-wrap">
        {links.map((section) => (
          <div key={section.category} className="mb-4 min-w-[180px]">
            <div className="font-semibold mb-3 text-sm text-white">
              {section.category}
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.url}
                    className="text-sm hover:text-[#c9d1c5] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-semibold mb-2 text-sm text-white">
          KẾT NỐI VỚI CHÚNG TÔI
        </div>
        <div className="flex gap-4 items-center">
          {socials.map((s) => (
            <a
              href={s.url}
              key={s.alt}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#b0baac] transition-colors hover:scale-110"
              title={s.alt}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-gray-200">
      <div className="text-xs text-white text-center">
        © {new Date().getFullYear()} NextGen Technology Solutions. All rights
        reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
