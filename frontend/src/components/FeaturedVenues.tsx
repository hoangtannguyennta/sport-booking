import React, { useEffect, useState } from 'react';
import api from '../services/api'
import { useNavigate } from 'react-router-dom';

type Venue = {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  address: string;
  price_per_hour: number;
  badge?: {
    label: string;
    type?: "popular" | "new";
  };
};

type TimeSlot = {
  id: number;
  start_time: string;
  end_time: string;
};

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

interface FeaturedVenuesProps {
  onBookingSuccess?: () => void;
  venueTrigger?: number;
}

const FeaturedVenues = ({ onBookingSuccess, venueTrigger }: FeaturedVenuesProps) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlotId, setTimeSlotId] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [skillLevel, setSkillLevel] = useState('all');
  const [note, setNote] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/venues');
      setVenues(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const res = await api.get('/time-slots');
      setTimeSlots(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { 
    fetchData();
    fetchTimeSlots();
  }, [venueTrigger]);

  const handleOpenBooking = (venue: Venue) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vui lòng đăng nhập để đặt sân!");
      navigate('/login');
      return;
    }
    setSelectedVenue(venue);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', {
        venue_id: selectedVenue?.id,
        time_slot_id: timeSlotId,
        booking_date: bookingDate,
        max_players: maxPlayers,
        skill_level: skillLevel,
        note: note
      });
      alert("Đặt sân và tạo trận đấu thành công!");
      setSelectedVenue(null);
      if (onBookingSuccess) onBookingSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi đặt sân");
    } finally {
      setLoading(false);
    }
  };

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

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenBooking(venue)}
                  >
                    Đặt sân
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedVenue && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white', padding: '2rem', borderRadius: '1rem',
            width: '100%', maxWidth: '500px', position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedVenue(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ×
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>Đặt sân: {selectedVenue.name}</h2>
            
            <form onSubmit={handleBookingSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ngày đặt</label>
                <input 
                  type="date" 
                  required 
                  className="search-field" 
                  style={{ width: '100%', padding: '0.5rem' }}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Khung giờ</label>
                <select 
                  required 
                  style={{ width: '100%', padding: '0.5rem' }}
                  value={timeSlotId}
                  onChange={(e) => setTimeSlotId(e.target.value)}
                >
                  <option value="">Chọn khung giờ</option>
                  {timeSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>{slot.start_time} - {slot.end_time}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Số người tối đa</label>
                  <input 
                    type="number" 
                    min="2" 
                    style={{ width: '100%', padding: '0.5rem' }} 
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Trình độ</label>
                  <select 
                    style={{ width: '100%', padding: '0.5rem' }}
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    <option value="all">Mọi trình độ</option>
                    <option value="beginner">Mới chơi</option>
                    <option value="intermediate">Trung bình</option>
                    <option value="advanced">Nâng cao</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ghi chú</label>
                <textarea 
                  style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Cần tìm thêm người chơi cùng..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedVenues;
