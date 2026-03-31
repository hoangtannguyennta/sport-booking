import { useEffect, useState } from "react";
import api from "../services/api";
import { LocationIcon, CalendarIcon, ClockIcon, UsersIcon, ArrowRightIcon } from "./icons/Icons";

interface User {
  id: number;
  name: string;
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
    const [aiQuery, setAiQuery] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [filterInfo, setFilterInfo] = useState<{ sport?: string; date?: string } | null>(null);

    const fetchUser = async () => {
      try {
        const res = await api.get('/me');
        setCurrentUser(res.data.user);
      } catch (error) {
        console.error("Chưa đăng nhập");
      }
    };

    const handleJoin = async (id: number) => {
      if (!window.confirm("Bạn có muốn tham gia trận đấu này không?")) return;
      
      setProcessingId(id);
      try {
        await api.post(`/matches/${id}/join`);
        alert("Tham gia thành công!");
        await fetchMatches(); // Tải lại danh sách
      } catch (error: any) {
        const msg = error.response?.data?.message || "Lỗi khi tham gia trận đấu";
        alert(msg);
      } finally {
        setProcessingId(null);
      }
    };

    const handleLeave = async (id: number) => {
      if (!window.confirm("Bạn có chắc chắn muốn rời khỏi trận đấu này?")) return;

      setProcessingId(id);
      try {
        await api.post(`/matches/${id}/leave`);
        alert("Đã rời trận đấu.");
        await fetchMatches(); // Tải lại danh sách
      } catch (error: any) {
        alert("Lỗi khi rời trận đấu");
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
        beginner: "Mới chơi",
        intermediate: "Trung bình",
        advanced: "Nâng cao",
        all: "Mọi trình độ"
      };
      return levels[level] || "Mọi trình độ";
    };

    if (loading) return <div className="container">Đang tải trận đấu...</div>;

    return (
      <>
      <main className="main-matches">
      <div className="container">
        {/* AI Search Box */}
        <div className="ai-search-container" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleAISearch} style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="search-field"
              style={{ width: '100%', padding: '1rem 3rem 1rem 3rem', borderRadius: '1rem', border: '2px solid #e2e8f0' }}
              placeholder="Hỏi AI: Tìm sân cầu lông chiều hôm nay..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
            />
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }}>
              {/* <SparklesIcon /> */}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', padding: '0.5rem 1rem' }}
              disabled={isParsing}
            >
              {isParsing ? "Đang phân tích..." : "Tìm bằng AI"}
            </button>
          </form>
          {filterInfo && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
              Đang hiển thị kết quả cho: <b>{filterInfo.sport || 'Tất cả môn'}</b> {filterInfo.date && <>ngày <b>{filterInfo.date}</b></>}
              <button onClick={() => { setAiQuery(""); fetchMatches(); }} style={{ marginLeft: '10px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Xóa lọc</button>
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

                  <div className="match-actions">
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
    </main>
    </>
  );
}

export default Matches;