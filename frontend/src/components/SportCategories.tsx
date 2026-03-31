import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Sport {
  id: number;
  name: string;
  icon: string;
  color?: string;
  venues_count?: number;
}

const SportCategories = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await api.get('/sports');
        if (res.data.success) {
          setSports(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách môn thể thao:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  const handleSportClick = (sportName: string) => {
    // Chuyển hướng sang trang venues với query param sport
    navigate(`/venues?sport=${encodeURIComponent(sportName)}`);
  };

  return (
    <section className="section" id="sports">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-subtitle">Khám phá</span>
          <h2 className="section-title">Môn thể thao phổ biến</h2>
          <p className="section-description">
            Chọn môn thể thao yêu thích và tìm sân phù hợp nhất với bạn
          </p>
        </div>

        {/* Sports grid */}
        <div className="sports-grid">
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '1rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p style={{ color: '#64748b' }}>Đang quét dữ môn thể thao...</p>
                </div>
            </div>
          ) : (
            sports.map((sport) => (
            <div
              key={sport.id}
              className="sport-card"
              style={{ 
                "--sport-color": sport.color || '#6366f1', 
                cursor: 'pointer' 
              } as React.CSSProperties}
              onClick={() => handleSportClick(sport.name)}
            >
              <div className="sport-icon">{sport.icon}</div>
              <h3>{sport.name}</h3>
              <p>{sport.venues_count || 0}+ sân</p>
            </div>
          )))}
        </div>
      </div>
    </section>
  );
};

export default SportCategories;
