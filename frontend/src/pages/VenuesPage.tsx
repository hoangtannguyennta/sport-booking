import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { SparklesIcon, SearchIcon, LocationIcon } from '../components/icons/Icons';

type Venue = {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  address: string;
  price_per_hour: number;
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

  return (
    <main className="main-content" style={{ paddingTop: '100px', paddingBottom: '4rem'}}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Tìm kiếm sân tập</h2>
          <p>Tìm sân thể thao phù hợp với nhu cầu của bạn qua AI hoặc bộ lọc</p>
        </div>

        {/* AI Search Section */}
        <div className="ai-search-container" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleAiSearch} style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'white', padding: '6px',
              borderRadius: '1.25rem', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.1)',
              border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #22c55e 100%)',
              backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box'
            }}>
              <div style={{ paddingLeft: '1.25rem', color: '#6366f1' }}><SparklesIcon /></div>
              <input
                type="text"
                className="search-field"
                style={{ width: '100%', padding: '0.8rem 1rem', border: 'none', outline: 'none', background: 'transparent' }}
                placeholder="Thử: 'Sân tennis tại Quận 1 vào sáng thứ 7 tới'..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '1rem' }} disabled={isAiSearching}>
                {isAiSearching ? "Đang xử lý..." : "Hỏi AI"}
              </button>
            </div>
          </form>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Sidebar Filters */}
          <aside>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Bộ lọc truyền thống</h3>
              <form onSubmit={handleTraditionalSearch}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Môn thể thao</label>
                  <select name="sport" className="search-field" style={{ width: '100%' }} defaultValue={searchParams.get('sport') || ""}>
                    <option>Tất cả môn</option>
                    <option>Bóng đá</option>
                    <option>Tennis</option>
                    <option>Cầu lông</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Khu vực</label>
                  <select name="address" className="search-field" style={{ width: '100%' }} defaultValue={searchParams.get('address') || "all"}>
                    <option value="all">Tất cả khu vực</option>
                    <option value="Phú Nhuận">Phú Nhuận</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Bình Thạnh">Bình Thạnh</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ngày chơi</label>
                  <input name="date" type="date" className="search-field" style={{ width: '100%' }} defaultValue={searchParams.get('date') || ""} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Áp dụng bộ lọc</button>
              </form>
            </div>
          </aside>

          {/* Results Grid */}
          <div>
            {aiFilters && (
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>AI đề xuất:</span>
                <div style={{ background: '#eef2ff', color: '#6366f1', padding: '6px 16px', borderRadius: '2rem', fontWeight: 'bold', border: '1px solid #c7d2fe' }}>
                  {aiFilters.sport || 'Thể thao'} • {aiFilters.address || 'Khu vực'} {aiFilters.date && `• ${aiFilters.date}`}
                </div>
                <button onClick={() => setSearchParams({})} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}>Xóa</button>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem' }}>Đang tải danh sách sân...</div>
            ) : (
              <div className="venues-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {venues.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                    <h3 style={{ color: '#64748b' }}>Rất tiếc, không tìm thấy sân nào phù hợp!</h3>
                  </div>
                ) : (
                  venues.map(venue => (
                    <div key={venue.id} className="venue-card" style={{ height: '100%' }}>
                      <div className="venue-image">
                        <img src={venue.image_url} alt={venue.name} />
                      </div>
                      <div className="venue-content">
                        <div className="venue-header">
                          <h3 style={{ fontSize: '1.1rem' }}>{venue.name}</h3>
                          <div className="venue-rating">⭐ {venue.rating}</div>
                        </div>
                        <p className="venue-location"><LocationIcon /> {venue.address}</p>
                        <div className="venue-footer">
                          <div className="venue-price">
                            <span className="price-value">{vndFormatter.format(venue.price_per_hour)}</span>
                            <span className="price-unit">/giờ</span>
                          </div>
                          <button className="btn btn-primary btn-sm">Chi tiết</button>
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
    </main>
  );
};

export default VenuesPage;