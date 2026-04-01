import { useEffect, useState } from "react";
import api from "../services/api";
import { LocationIcon, CalendarIcon, ClockIcon, UsersIcon, ArrowRightIcon, SparklesIcon, SearchIcon } from "./icons/Icons";
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  skill_level?: string;
}

interface Match {
  id: number;
  max_players: number;
  skill_level: string;
  status: string;
  booking: {
    booking_date: string;
    venue: {
      name: string;
      address: string;
    };
    time_slot: {
      start_time: string;
      end_time: string;
    };
  };
  host: User;
  users_match: User[];
}

interface MatchesProps {
  refreshTrigger?: number;
}

const Matches = ({ refreshTrigger }: MatchesProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    id: number;
    type: 'join' | 'leave';
    message: string;
  } | null>(null);
  const [selectedMatchParticipants, setSelectedMatchParticipants] = useState<Match | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [filterInfo, setFilterInfo] = useState<{ sport?: string; date?: string | string[]; address?: string } | null>(null);

  const fetchUser = async () => {
    try {
      const res = await api.get('/me');
      setCurrentUser(res.data.user);
    } catch (error) {
      console.error("Chưa đăng nhập");
    }
  };

  const handleJoin = (id: number) => {
    setConfirmModal({
      id,
      type: 'join',
      message: "Bạn có muốn tham gia trận đấu này không?"
    });
  };

  const handleLeave = (id: number) => {
    setConfirmModal({
      id,
      type: 'leave',
      message: "Bạn có chắc chắn muốn rời khỏi trận đấu này?"
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;

    const { id, type } = confirmModal;
    setConfirmModal(null);
    setProcessingId(id);

    try {
      if (type === 'join') {
        await api.post(`/matches/${id}/join`);
        toast.success("Tham gia trận đấu thành công!");
      } else {
        await api.post(`/matches/${id}/leave`);
        toast.success("Đã rời trận đấu.");
      }
      await fetchMatches();
    } catch (error: any) {
      const msg = error.response?.data?.message || `Lỗi khi ${type === 'join' ? 'tham gia' : 'rời'} trận đấu`;
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    fetchMatches(aiQuery);
  };

  const fetchMatches = async (searchQuery?: string) => {
    setIsParsing(!!searchQuery);
    try {
      const res = await api.get('/matches', {
        params: searchQuery ? { query: searchQuery } : {}
      });
      const data = res.data.data || res.data.matches || [];
      setMatches(data);

      // Cập nhật thông tin filter từ backend trả về để hiển thị UI
      if (res.data.ai_filters) {
        setFilterInfo(res.data.ai_filters);
      } else if (!searchQuery) {
        setFilterInfo(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trận đấu:", error);
    } finally {
      setLoading(false);
      setIsParsing(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMatches();
  }, [refreshTrigger]);

  const getStatusInfo = (match: Match) => {
    const currentPlayers = match.users_match?.length || 0;
    if (currentPlayers >= match.max_players) {
      return { label: "Đủ người", class: "status-full" };
    }
    if (currentPlayers === match.max_players - 1) {
      return { label: "Sắp đủ người", class: "status-almost-full", dot: true };
    }
    return { label: "Đang tìm người", class: "status-looking", dot: true };
  };

  const getSkillLabel = (level: string) => {
    const levels: Record<string, string> = {
      newbie: "Mới chơi",
      beginner: "Mới chơi",
      intermediate: "Trung bình",
      advanced: "Nâng cao",
      all: "Mọi trình độ"
    };
    return levels[level] || "Mọi trình độ";
  };

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Đang tải trận đấu...</p>
      </div>
    );
  }

  return (
    <>
      <main className="main-matches">
        <div className="container">
          {/* Nâng cấp AI Search Box */}
          <div className="ai-search-container" style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
            <form onSubmit={handleAISearch} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                padding: '4px',
                borderRadius: '1.25rem',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #22c55e 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                transition: 'transform 0.2s ease'
              }}>
                <div style={{ paddingLeft: '1.25rem', color: '#6366f1', display: 'flex', alignItems: 'center' }}>
                  <SparklesIcon />
                </div>
                <input
                  type="text"
                  className="search-field"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: 'none',
                    fontSize: '1rem',
                    background: 'transparent',
                    outline: 'none'
                  }}
                  placeholder="Thử: 'Tìm sân cầu lông tại Huế vào tối mai'..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '0.7rem 1.5rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                  }}
                  disabled={isParsing}
                >
                  {isParsing ? "Đang xử lý..." : <><SearchIcon /> Hỏi AI</>}
                </button>
              </div>
            </form>

            {filterInfo && (
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Kết quả cho:</span>
                <div style={{ background: '#eef2ff', color: '#6366f1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #c7d2fe' }}>
                  {filterInfo.sport || 'Tất cả môn'} 
                  {filterInfo.address && ` • ${filterInfo.address}`} 
                  {filterInfo.date && ` • ${Array.isArray(filterInfo.date) 
                    ? filterInfo.date.join(', ') 
                    : filterInfo.date}`}
                </div>
                <button onClick={() => { setAiQuery(""); fetchMatches(); }} style={{ fontSize: '0.85rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', textDecoration: 'underline' }}>Thiết lập lại</button>
              </div>
            )}
          </div>
            
          {/* Section Header */}
          <div className="section-header-matches">
            <h2>Các trận sắp diễn ra</h2>
            <span className="match-count">{matches.length} trận</span>
          </div>

          {/* Match Cards Grid */}
          <div className="match-grid">
            {matches.length === 0 && !loading && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3>Không tìm thấy trận đấu nào phù hợp</h3>
                <p>Bạn hãy thử thay đổi từ khóa tìm kiếm hoặc xem các trận khác nhé.</p>
              </div>
            )}

            {matches.map((match) => {
              const status = getStatusInfo(match);
              const currentPlayers = match.users_match?.length || 0;
              const isFull = currentPlayers >= match.max_players;
              const isParticipant = currentUser && match.users_match?.some(u => u.id === currentUser.id);

              return (
                <article key={match.id} className={`match-card ${match.status === 'ended' ? 'match-card-ended' : ''}`}>
                  <div className="match-card-header">
                    <div className="venue-info">
                      <h3 className="venue-name">{match.booking.venue.name}</h3>
                      <p className="venue-address">
                        <LocationIcon />
                        {match.booking.venue.address}
                      </p>
                    </div>

                    <span className={`status-badge ${status.class}`}>
                      {status.dot && <span className="status-dot" />}
                      {status.label}
                    </span>
                  </div>

                  <div className="match-meta">
                    <span className="meta-item">
                      <CalendarIcon />
                      {new Date(match.booking.booking_date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                    </span>
                    <span className="meta-item">
                      <ClockIcon />
                      {match.booking.time_slot.start_time.substring(0, 5)} - {match.booking.time_slot.end_time.substring(0, 5)}
                    </span>
                    <span className={`meta-item ${currentPlayers >= match.max_players - 1 && !isFull ? 'meta-warning' : ''}`}>
                      <UsersIcon />
                      {currentPlayers}/{match.max_players} người
                    </span>
                  </div>

                  <div className="match-card-footer">
                    <div className="footer-left">
                      <span className={`skill-badge skill-${match.skill_level || 'all'}`}>
                        {getSkillLabel(match.skill_level)}
                      </span>
                      <div className="player-avatars">
                        {match.users_match?.slice(0, 4).map((user, idx) => (
                          <div key={user.id} className={`avatar ${user.id === match.host.id ? 'avatar-host' : ''}`}>
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                        ))}
                        {currentPlayers > 4 && <span className="avatar-more">+{currentPlayers - 4}</span>}
                      </div>
                    </div>

                    <div className="match-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="btn-detail"
                        style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        onClick={() => setSelectedMatchParticipants(match)}
                      >
                        Chi tiết
                      </button>

                      {isParticipant ? (
                        <button
                          className="btn-action btn-leave"
                          onClick={() => handleLeave(match.id)}
                          disabled={processingId === match.id}
                        >
                          {processingId === match.id ? "Đang xử lý..." : "Rời trận"}
                        </button>
                      ) : (
                        !isFull && match.status === 'open' && (
                          <button
                            className="join-hint"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                            onClick={() => handleJoin(match.id)}
                            disabled={processingId === match.id}
                          >
                            {processingId === match.id ? "Đang xử lý..." : "Tham gia"} <ArrowRightIcon />
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {!isFull && <span className="spots-badge">Còn {match.max_players - currentPlayers} chỗ</span>}
                </article>
              );
            })}
          </div>
        </div>

        {/* Modal xác nhận Custom */}
        {confirmModal && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 3000
          }}>
            <div className="modal-content" style={{
              background: 'white', padding: '2rem', borderRadius: '1rem',
              width: '100%', maxWidth: '400px', textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {confirmModal.type === 'join' ? '🤝' : '🚪'}
              </div>
              <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
                {confirmModal.type === 'join' ? 'Tham gia trận đấu' : 'Rời trận đấu'}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.5' }}>
                {confirmModal.message}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1 }} 
                  onClick={() => setConfirmModal(null)}
                >
                  Hủy bỏ
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={handleConfirmAction}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Chi tiết người tham gia */}
        {selectedMatchParticipants && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 3000
          }}>
            <div className="modal-content" style={{
              background: 'white', padding: '2rem', borderRadius: '1.25rem',
              width: '100%', maxWidth: '450px', position: 'relative',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <button
                onClick={() => setSelectedMatchParticipants(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>Người tham gia</h2>
                <p style={{ color: '#6366f1', fontWeight: 600 }}>{selectedMatchParticipants.booking.venue.name}</p>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedMatchParticipants.users_match.map((user) => (
                    <div key={user.id} style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: '0.75rem', 
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        width: '36px', height: '36px', background: user.id === selectedMatchParticipants.host.id ? '#6366f1' : '#e2e8f0', 
                        color: user.id === selectedMatchParticipants.host.id ? 'white' : '#64748b',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold'
                      }}>
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{user.name}</div>
                          {user.skill_level && (
                            <span style={{ 
                              fontSize: '0.65rem', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              background: user.skill_level === 'advanced' ? '#fee2e2' : user.skill_level === 'intermediate' ? '#fef9c3' : '#dcfce7',
                              color: user.skill_level === 'advanced' ? '#991b1b' : user.skill_level === 'intermediate' ? '#854d0e' : '#166534',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {getSkillLabel(user.skill_level)}
                            </span>
                          )}
                        </div>
                        {user.id === selectedMatchParticipants.host.id && (
                          <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase' }}>Chủ trận</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', borderRadius: '0.75rem' }} onClick={() => setSelectedMatchParticipants(null)}>Đóng</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Matches;