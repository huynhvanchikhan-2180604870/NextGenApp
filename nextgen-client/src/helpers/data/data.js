export const sampleProducts = [
  {
    id: "1",
    name: "E-commerce Template React + Node.js",
    price: 1299000,
    shortDescription:
      "Giải pháp E-commerce hoàn chỉnh với React và Node.js, tích hợp thanh toán và quản lý đơn hàng.",
    description: `
        <h3>Tính năng nổi bật:</h3>
        <ul>
          <li>Dashboard quản lý đơn hàng trực quan</li>
          <li>Tích hợp nhiều cổng thanh toán</li>
          <li>Quản lý sản phẩm linh hoạt</li>
          <li>SEO friendly</li>
          <li>Responsive trên mọi thiết bị</li>
        </ul>
        <p>Được xây dựng trên công nghệ mới nhất của React 18 và Node.js...</p>
      `,
    installation: `
        <h3>Yêu cầu hệ thống:</h3>
        <ul>
          <li>Node.js v16 trở lên</li>
          <li>MongoDB v4.4 trở lên</li>
        </ul>
        <h3>Các bước cài đặt:</h3>
        <pre>
1. Clone repository
2. Chạy npm install
3. Cấu hình file .env
4. Chạy npm run dev</pre>
      `,
    coverImage: "https://via.placeholder.com/800x600?text=E-commerce+Template",
    images: Array(10)
      .fill()
      .map(
        (_, i) => `https://via.placeholder.com/800x600?text=Feature+${i + 1}`
      ),
    videoUrl: "https://www.youtube.com/embed/demo-video-id",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Redux"],
    downloads: 234,
    category: "web",
    subCategory: "ecommerce",
    reviews: [
      {
        name: "Nguyễn Văn A",
        rating: 5,
        comment: "Code sạch, dễ tùy biến, support nhanh!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      },
      {
        name: "Trần Thị B",
        rating: 4,
        comment:
          "Rất hài lòng với template, chỉ cần thêm vài tính năng nữa là hoàn hảo.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      },
    ],
  },
  {
    id: "2",
    name: "Social Media Dashboard React",
    price: 899000,
    shortDescription:
      "Dashboard quản lý mạng xã hội với React, tích hợp nhiều nền tảng và phân tích dữ liệu.",
    description: `
        <h3>Tính năng chính:</h3>
        <ul>
          <li>Tích hợp nhiều nền tảng mạng xã hội</li>
          <li>Biểu đồ phân tích chi tiết</li>
          <li>Quản lý nội dung đa nền tảng</li>
          <li>Lập lịch đăng bài tự động</li>
          <li>Báo cáo tương tác theo thời gian thực</li>
        </ul>
      `,
    installation: `
        <h3>Yêu cầu:</h3>
        <ul>
          <li>Node.js v14 trở lên</li>
          <li>Firebase account</li>
        </ul>
        <h3>Cài đặt:</h3>
        <pre>
1. Clone repository
2. npm install
3. Cấu hình Firebase
4. npm start</pre>
      `,
    coverImage: "https://via.placeholder.com/800x600?text=Social+Dashboard",
    images: Array(10)
      .fill()
      .map(
        (_, i) => `https://via.placeholder.com/800x600?text=Dashboard+${i + 1}`
      ),
    videoUrl: "https://www.youtube.com/embed/another-demo",
    technologies: ["React", "Firebase", "Chart.js", "TailwindCSS"],
    downloads: 156,
    category: "web",
    subCategory: "dashboard",
    reviews: [
      {
        name: "Lê Văn C",
        rating: 5,
        comment: "Dashboard rất đẹp và dễ sử dụng!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      },
    ],
  },
  {
    id: "3",
    name: "Portfolio Template Next.js",
    price: 599000,
    shortDescription:
      "Template portfolio chuyên nghiệp với Next.js và Framer Motion, tối ưu SEO.",
    description: `
        <h3>Đặc điểm nổi bật:</h3>
        <ul>
          <li>Hiệu ứng mượt mà với Framer Motion</li>
          <li>Tối ưu SEO</li>
          <li>Tích hợp Blog</li>
          <li>Dark mode</li>
          <li>Responsive design</li>
        </ul>
      `,
    installation: `
        <h3>Cài đặt:</h3>
        <pre>
1. Clone project
2. yarn install
3. yarn dev</pre>
      `,
    coverImage: "https://via.placeholder.com/800x600?text=Portfolio",
    images: Array(10)
      .fill()
      .map(
        (_, i) => `https://via.placeholder.com/800x600?text=Portfolio+${i + 1}`
      ),
    videoUrl: "https://www.youtube.com/embed/portfolio-demo",
    technologies: ["Next.js", "Framer Motion", "TailwindCSS"],
    downloads: 89,
    category: "web",
    subCategory: "portfolio",
    reviews: [
      {
        name: "Phạm Thị D",
        rating: 5,
        comment: "Template đẹp, code dễ hiểu!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      },
    ],
  },
];

export const getRelatedProducts = (products,currentProduct, limit = 4) => {
  return products
    .filter(
      (product) =>
        product._id !== currentProduct._id &&
        (product.category._id === currentProduct.category._id ||
          product.technologies.some((tech) =>
            currentProduct.technologies.includes(tech)
          ))
    )
    .slice(0, limit);
};
