import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { SparklesIcon, SearchIcon, LocationIcon, CalendarIcon } from '../components/icons/Icons';
import Header from "../components/Header";

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

type BookingDetail = {
  id: number;
  booking_date: string;
  time_slot: {
    start_time: string;
    end_time: string;
  };
  user: {
    name: string;
  };
  matches: {
    host: {
      name: string;
    };
  }[];
};

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const VenuesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiFilters, setAiFilters] = useState<any>(null);
  const [selectedVenueBookings, setSelectedVenueBookings] = useState<BookingDetail[]>([]);
  const [detailVenue, setDetailVenue] = useState<Venue | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get('/venues', { params });
      setVenues(res.data.data || []);
      setAiFilters(res.data.ai_filters || null);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sân:", error);
    } finally {
      setLoading(false);
      setIsAiSearching(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [searchParams]);

  const handleTraditionalSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newParams = new URLSearchParams();

    const sport = formData.get('sport') as string;
    const address = formData.get('address') as string;
    const date = formData.get('date') as string;

    if (sport && sport !== 'Tất cả môn') newParams.set('sport', sport);
    if (address && address !== 'all') newParams.set('address', address);
    if (date) newParams.set('date', date);

    setSearchParams(newParams);
    setAiFilters(null);
    setAiQuery("");
  };

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiSearching(true);
    setSearchParams({ query: aiQuery });
  };

  const handleShowDetail = async (venue: Venue) => {
    setDetailVenue(venue);
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/venues/${venue.id}/bookings`);
      setSelectedVenueBookings(res.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải lịch đặt sân:", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <main className="main-content" style={{ paddingTop: '150px', paddingBottom: '5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
            <span className="section-subtitle" style={{ color: '#6366f1', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Tìm kiếm thông minh</span>
            <h2 className="section-title">Tìm kiếm sân tập</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Sử dụng sức mạnh AI để tìm sân bãi phù hợp nhất với nhu cầu của bạn.</p>
          </div>

          {/* AI Search Section */}
          <div className="ai-search-container" style={{ marginBottom: '3rem' }}>
            <form onSubmit={handleAiSearch} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                padding: '8px',
                borderRadius: '1.5rem',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.15)',
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #22c55e 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ paddingLeft: '1.5rem', color: '#6366f1', display: 'flex', alignItems: 'center' }}>
                  <SparklesIcon />
                </div>
                <input
                  type="text"
                  className="search-field"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '1.1rem'
                  }}
                  placeholder="Thử: 'Sân cầu lông ở Huế vào thứ 7 tuần này'..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.8rem 2rem', borderRadius: '1.25rem', fontSize: '1rem', fontWeight: 600 }}
                  disabled={isAiSearching}
                >
                  {isAiSearching ? "Đang phân tích..." : "Tìm bằng AI"}
                </button>
              </div>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
            {/* Sidebar Filters */}
            <aside>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1.25rem',
                border: '1px solid #e2e8f0',
                position: 'sticky',
                top: '120px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SearchIcon /> Bộ lọc
                </h3>
                <form onSubmit={handleTraditionalSearch}>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.6rem' }}>
                      <SearchIcon /> Môn thể thao
                    </label>
                    <div className="search-field-wrapper" style={{ position: 'relative' }}>
                      <select name="sport" className="search-field" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem' }} defaultValue={searchParams.get('sport') || ""}>
                        <option>Tất cả môn</option>
                        <option>Bóng đá</option>
                        <option>Tennis</option>
                        <option>Cầu lông</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.6rem' }}>
                      <LocationIcon /> Khu vực
                    </label>
                    <div className="search-field-wrapper">
                      <select name="address" className="search-field" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem' }} defaultValue={searchParams.get('address') || "all"}>
                        <option value="all">Tất cả khu vực</option>
                        <option value="Phú Nhuận">Phú Nhuận</option>
                        <option value="Quận 1">Quận 1</option>
                        <option value="Bình Thạnh">Bình Thạnh</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.6rem' }}>
                      <CalendarIcon /> Ngày chơi
                    </label>
                    <input name="date" type="date" className="search-field" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem' }} defaultValue={searchParams.get('date') || ""} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.75rem' }}>
                    Áp dụng bộ lọc
                  </button>
                </form>
              </div>
            </aside>

            {/* Results Grid */}
            <div>
              {aiFilters && (
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <SparklesIcon /> Đang hiển thị kết quả AI cho:
                  </span>
                  <div style={{ background: '#eef2ff', color: '#6366f1', padding: '8px 18px', borderRadius: '2rem', fontWeight: 600, border: '1px solid #c7d2fe', fontSize: '0.9rem' }}>
                    {aiFilters.sport || 'Thể thao'} • {aiFilters.address || 'Khu vực'} {aiFilters.date && `• ${aiFilters.date}`}
                  </div>
                  <button
                    onClick={() => { setSearchParams({}); setAiQuery(""); }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem', fontWeight: 500 }}
                  >
                    Đặt lại mặc định
                  </button>
                </div>
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '1rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p style={{ color: '#64748b' }}>Đang quét dữ liệu sân bãi...</p>
                </div>
              ) : (
                <div className="venues-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {venues.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '1.5rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
                      <h3 style={{ color: '#64748b' }}>Rất tiếc, không tìm thấy sân nào phù hợp!</h3>
                      <p>Hãy thử thay đổi tiêu chí lọc hoặc mô tả chi tiết hơn cho AI.</p>
                    </div>
                  ) : (
                    venues.map(venue => (
                      <div key={venue.id} className="venue-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="venue-image">
                          <img src={venue.image_url} alt={venue.name} />
                          {venue.badge && (
                            <span className={`venue-badge ${venue.badge.type === "new" ? "venue-badge-new" : ""}`}>
                              {venue.badge.label}
                            </span>
                          )}
                        </div>
                        <div className="venue-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div className="venue-header">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{venue.name}</h3>
                            <div className="venue-rating">⭐ {venue.rating}</div>
                          </div>
                          <p className="venue-location"><LocationIcon /> {venue.address}</p>

                          <div className="venue-features" style={{ margin: '1rem 0' }}>
                            {/* Render features if needed */}
                          </div>

                          <div className="venue-footer" style={{ marginTop: 'auto' }}>
                            <div className="venue-price">
                              <span className="price-value">{vndFormatter.format(venue.price_per_hour)}</span>
                              <span className="price-unit">/giờ</span>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => handleShowDetail(venue)}>Chi tiết</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Chi tiết lịch đặt sân */}
        {detailVenue && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: 'white', padding: '2rem', borderRadius: '1.25rem',
              width: '100%', maxWidth: '600px', position: 'relative',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <button
                onClick={() => setDetailVenue(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>Lịch đặt sân</h2>
                <p style={{ color: '#6366f1', fontWeight: 600 }}>{detailVenue.name}</p>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {isDetailLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải lịch đặt...</div>
                ) : selectedVenueBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '1rem' }}>
                    Hiện chưa có lịch đặt nào cho sân này.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedVenueBookings.map((booking) => (
                      <div key={booking.id} style={{ 
                        padding: '1rem', 
                        borderRadius: '0.75rem', 
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                            {new Date(booking.booking_date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ color: '#6366f1', fontWeight: 600 }}>{booking.time_slot.start_time.substring(0, 5)} - {booking.time_slot.end_time.substring(0, 5)}</span>
                            <span>•</span>
                            <span>Người đặt: {booking.matches[0]?.host?.name}</span>
                          </div>
                        </div>
                        <div style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          Đã xác nhận
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', borderRadius: '0.75rem' }}
                onClick={() => setDetailVenue(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </main>
    </>

  );
};

export default VenuesPage;