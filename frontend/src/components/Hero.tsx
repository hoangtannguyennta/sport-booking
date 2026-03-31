import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [sport, setSport] = useState("Tất cả môn");
  const [location, setLocation] = useState("all");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (sport !== "Tất cả môn") params.append("sport", sport);
    if (location !== "all") params.append("address", location);
    if (date) params.append("date", date);
    
    navigate(`/venues?${params.toString()}`);
  };

  return (
      <section className="hero">
      {/* Background */}
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80"
          alt="Sports facility"
        />
        <div className="hero-overlay" />
      </div>

      <div className="container hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span className="badge-dot" />
          <span>Hơn 500+ sân thể thao trên toàn quốc</span>
        </div>

        {/* Heading */}
        <h1 className="hero-title">
          Đặt sân thể thao
          <br />
          <span className="text-primary">nhanh chóng & dễ dàng</span>
        </h1>

        {/* Description */}
        <p className="hero-description">
          Tìm kiếm và đặt sân bóng đá, tennis, cầu lông, bơi lội và nhiều môn thể
          thao khác chỉ trong vài phút
        </p>

        {/* Search Box */}
        <div className="search-box">
          <div className="search-grid">
            {/* Sport Type */}
            <div className="search-field">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <div className="search-field-content">
                <label>Môn thể thao</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)}>
                  <option>Tất cả môn</option>
                  <option>Bóng đá</option>
                  <option>Tennis</option>
                  <option>Cầu lông</option>
                  <option>Bơi lội</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="search-field">
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

              <div className="search-field-content">
                <label>Địa điểm</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="all">Tất cả địa điểm</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="search-field">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>

              <div className="search-field-content">
                <label>Ngày đặt</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
            </div>

            {/* Search Button */}
            <button className="btn btn-primary search-btn" onClick={handleSearch}>
              Tìm sân
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat">
            <p className="stat-value">500+</p>
            <p className="stat-label">Sân thể thao</p>
          </div>
          <div className="stat">
            <p className="stat-value">50K+</p>
            <p className="stat-label">Lượt đặt sân</p>
          </div>
          <div className="stat">
            <p className="stat-value">15+</p>
            <p className="stat-label">Tỉnh thành</p>
          </div>
          <div className="stat">
            <p className="stat-value">4.8⭐</p>
            <p className="stat-label">Đánh giá</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
