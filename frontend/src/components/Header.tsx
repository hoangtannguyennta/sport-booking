import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface HeaderProps {
  onVenueSuccess?: () => void;
}

const Header = ({ onVenueSuccess }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  // State cho Modal Đăng ký sân
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venueData, setVenueData] = useState({
    name: '',
    address: '',
    price_per_hour: '',
    sport_id: ''
  });
  const [sports, setSports] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Tạo URL tạm thời để hiển thị ảnh preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin user từ localStorage khi component mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Khôi phục token cho Axios nếu có trong localStorage (tránh mất token khi F5)
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const fetchSports = async () => {
      try {
        const res = await api.get('/sports');
        if (res.data.success) {
          setSports(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách môn thể thao:", error);
      }
    };
    fetchSports();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
    // Xóa thông tin auth ở client dù API có lỗi hay không
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const handleVenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    // Sử dụng FormData để gửi file
    const formData = new FormData();
    formData.append('name', venueData.name);
    formData.append('address', venueData.address);
    formData.append('price_per_hour', venueData.price_per_hour);
    formData.append('sport_id', venueData.sport_id);
    if (imageFile) {
      formData.append('image', imageFile); // 'image' là key mà backend sẽ nhận
    }

    try {
      await api.post('/venues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Gửi yêu cầu đăng ký sân thành công! Chúng tôi sẽ liên hệ lại sớm.');
      setIsVenueModalOpen(false);
      setVenueData({ name: '', address: '', price_per_hour: '', sport_id: '' });
      setImageFile(null);
      setPreviewUrl(null);

      if (onVenueSuccess) onVenueSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký sân');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              {user ? (
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span className="top-bar-link">Chào, {user.name}</span>
                  <a onClick={handleLogout} className="top-bar-link" style={{ cursor: 'pointer' }}>
                    Đăng xuất
                  </a>
                </div>
              ) : (
                <a onClick={() => navigate('/login')} className="top-bar-link" style={{ cursor: 'pointer' }}>
                  Đăng nhập
                </a>
              )}
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
              <a onClick={() => navigate('/')} className="nav-link active">Trang chủ</a>
              {/* <a href="#sports" className="nav-link">Môn thể thao</a>
            <a href="#venues" className="nav-link">Sân bãi</a>
            <a href="#" className="nav-link">Liên hệ</a> */}
            </nav>

            {/* CTA Buttons */}
            <div className="header-cta">
              <button
                className="btn btn-outline"
                onClick={() => setIsVenueModalOpen(true)}
              >
                Đăng ký sân
              </button>
              {/* <button className="btn btn-primary">Đặt sân ngay</button> */}
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

      {isVenueModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div className="modal-content" style={{
            background: 'white', padding: '2rem', borderRadius: '1rem',
            width: '100%', maxWidth: '500px', position: 'relative'
          }}>
            <button
              onClick={() => setIsVenueModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ×
            </button>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Đăng ký hợp tác kinh doanh sân</h2>

            <form onSubmit={handleVenueSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Tên sân / CLB</label>
                <input
                  type="text"
                  required
                  className="search-field"
                  style={{ width: '100%', padding: '0.6rem' }}
                  placeholder="VD: Sân Cầu Lông ABC"
                  value={venueData.name}
                  onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Địa chỉ chi tiết</label>
                <input
                  type="text"
                  required
                  className="search-field"
                  style={{ width: '100%', padding: '0.6rem' }}
                  placeholder="Số nhà, tên đường, Quận/Huyện..."
                  value={venueData.address}
                  onChange={(e) => setVenueData({ ...venueData, address: e.target.value })}
                />
              </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Môn thể thao</label>
              <select
                required
                className="search-field"
                style={{ width: '100%', padding: '0.6rem' }}
                value={venueData.sport_id}
                onChange={(e) => setVenueData({ ...venueData, sport_id: e.target.value })}
              >
                <option value="">Chọn môn thể thao</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.icon} {sport.name}
                  </option>
                ))}
              </select>
            </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Giá thuê (VND/giờ)</label>
                <input
                  type="number"
                  required
                  className="search-field"
                  style={{ width: '100%', padding: '0.6rem' }}
                  placeholder="VD: 150000"
                  value={venueData.price_per_hour}
                  onChange={(e) => setVenueData({ ...venueData, price_per_hour: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Hình ảnh sân</label>
                <input
                type="file"
                accept="image/*"
                  className="search-field"
                  style={{ width: '100%', padding: '0.6rem' }}
                onChange={handleFileChange}
                />
              {previewUrl && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.5rem', objectFit: 'cover' }} 
                  />
                </div>
              )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Gửi yêu cầu đăng ký'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
