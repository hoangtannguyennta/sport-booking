import { MapPin, Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
  <header className="header">
      {/* Top bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-left">
            <a href="tel:0123456789" className="top-bar-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>0123 456 789</span>
            </a>

            <span className="top-bar-address">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>97 Ngô Đức Kế, TP-HUẾ</span>
            </span>
          </div>

          <div className="top-bar-right">
            <a href="#" className="top-bar-link">Hỗ trợ</a>
            <a href="#" className="top-bar-link">Đăng nhập</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="main-header">
        <div className="container header-content">
          {/* Logo */}
          <a href="/" className="logo">
            <div className="logo-icon">S</div>
            <div className="logo-text">
              <h1>SportBook</h1>
              <p>Đặt sân thể thao online</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <a href="#" className="nav-link active">Trang chủ</a>
            <a href="#sports" className="nav-link">Môn thể thao</a>
            <a href="#venues" className="nav-link">Sân bãi</a>
            <a href="#" className="nav-link">Khuyến mãi</a>
            <a href="#" className="nav-link">Liên hệ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="header-cta">
            <button className="btn btn-outline">Đăng ký sân</button>
            <button className="btn btn-primary">Đặt sân ngay</button>
          </div>

          {/* Mobile menu button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isOpen ? "open" : ""}`}>
          <div className="container">
            <a href="#" className="nav-link active">Trang chủ</a>
            <a href="#sports" className="nav-link">Môn thể thao</a>
            <a href="#venues" className="nav-link">Sân bãi</a>
            <a href="#" className="nav-link">Khuyến mãi</a>
            <a href="#" className="nav-link">Liên hệ</a>

            <div className="mobile-cta">
              <button className="btn btn-outline">Đăng ký sân</button>
              <button className="btn btn-primary">Đặt sân ngay</button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
