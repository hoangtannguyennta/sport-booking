import { useEffect, useState } from 'react';
import api from '../services/api'

type Venue = {
  id: number;
  name: string;
  image: string;
  rating: number;

  location: string;
  price: string;
  features: string[];
  badge?: {
    label: string;
    type?: "popular" | "new";
  };
};

const venues: Venue[] = [
  {
    id: 1,
    name: "Sân Bóng Đá Phú Mỹ Hưng",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80",
    rating: 4.9,
    location: "Quận 7, TP.HCM",
    price: "500.000đ",
    features: ["Sân cỏ nhân tạo", "Đèn chiếu sáng", "Phòng thay đồ"],
    badge: { label: "Phổ biến", type: "popular" },
  },
  {
    id: 2,
    name: "Tennis Club Thảo Điền",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80",
    rating: 4.8,
    location: "Quận 2, TP.HCM",
    price: "300.000đ",
    features: ["Sân cứng", "Huấn luyện viên", "Cho thuê vợt"],
  },
  {
    id: 3,
    name: "CLB Cầu Lông Tân Bình",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80",
    rating: 4.7,
    location: "Tân Bình, TP.HCM",
    price: "150.000đ",
    features: ["8 sân", "Máy lạnh", "Căng tin"],
    badge: { label: "Mới", type: "new" },
  },
];

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const FeaturedVenues = () => {

  const [venues, setVenues] = useState<Venue[]>([]);

  const fetchData = async () => {
    try {
      const res = await api.get('/venues');
      setVenues(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { 
    fetchData();
  }, []);


  return (
   <section className="section section-gray" id="venues">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-subtitle">Đề xuất</span>
          <h2 className="section-title">Sân nổi bật tại</h2>
          <p className="section-description">
            Những sân thể thao được đánh giá cao và đặt nhiều nhất
          </p>
        </div>

        {/* Venues grid */}
        <div className="venues-grid">
          {venues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <div className="venue-image">
                <img src={venue.image_url} alt={venue.name} />

                {venue.badge && (
                  <span
                    className={`venue-badge ${
                      venue.badge.type === "new"
                        ? "venue-badge-new"
                        : ""
                    }`}
                  >
                    {venue.badge.label}
                  </span>
                )}
              </div>

              <div className="venue-content">
                <div className="venue-header">
                  <h3>{venue.name}</h3>
                  <div className="venue-rating">
                    <span>⭐</span>
                    <span>{venue.rating}</span>
                  </div>
                </div>

                <p className="venue-location">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {venue.address}
                </p>

                <div className="venue-features">
                  {/* {venue.features.map((feature) => (
                    <span key={feature} className="feature-tag">
                      {feature}
                    </span>
                  ))} */}
                </div>

                <div className="venue-footer">
                  <div className="venue-price">
                    <span className="price-value">{vndFormatter.format(venue.price_per_hour)}</span>
                    <span className="price-unit">/giờ</span>
                  </div>

                  <button className="btn btn-primary btn-sm">
                    Đặt sân
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenues;
