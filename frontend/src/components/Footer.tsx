const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-col">
            <div className="footer-logo">
              <div className="logo-icon">S</div>
              <div className="logo-text">
                <h3>SportBook</h3>
                <p>Đặt sân thể thao online</p>
              </div>
            </div>

            <p className="footer-about">
              © 2026 SportBook. Kết nối đam mê thể thao.
            </p>

            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">▶️</a>
              <a href="#" className="social-link">💬</a>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div className="footer-col">
            <h4>Truy cập nhanh</h4>
            <ul className="footer-links">
              <li><a href="#">Trang chủ</a></li>
              <li><a href="#">Tìm sân</a></li>
              <li><a href="#">Môn thể thao</a></li>
              <li><a href="#">Khuyến mãi</a></li>
              <li><a href="#">Đăng ký đối tác</a></li>
              <li><a href="#">Blog thể thao</a></li>
            </ul>
          </div> */}

          {/* Support */}
          {/* <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              <li><a href="#">Hướng dẫn đặt sân</a></li>
              <li><a href="#">Chính sách hoàn tiền</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div> */}

          {/* Contact */}
          <div className="footer-col">
            <h4>Liên hệ</h4>

            <ul className="contact-list">
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  97 Ngô Đức Kế, TP-HUẾ
                </span>
              </li>

              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:0123456789">0123 456 789</a>
              </li>

              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:info@sportbook.vn">
                  info@sportbook.vn
                </a>
              </li>
            </ul>

            {/* <div className="app-badges">
              <p>Tải ứng dụng</p>
              <div className="badge-buttons">
                <a href="#" className="app-badge">App Store</a>
                <a href="#" className="app-badge">Google Play</a>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© 2026 SportBook. Bảo lưu mọi quyền.</p>
          {/* <div className="footer-bottom-links">
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <a href="#">Cookies</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
