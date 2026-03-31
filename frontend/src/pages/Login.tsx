import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Home.css';
import Header from "../components/Header";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Cấu hình axios để các request sau tự động gửi kèm token
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/'); // Quay lại trang chủ
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Email hoặc mật khẩu không đúng');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f3f4f6'
      }}>
        <div className="login-card" style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          width: '100%',
          maxHeight: '100vh',
          maxWidth: '400px'
        }}>
          <div className="logo-login" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div className="logo-icon" style={{ margin: '0 auto' }}>S</div>
            <h2 style={{ marginTop: '1rem', color: '#1f2937' }}>Chào mừng trở lại</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Đăng nhập để tiếp tục đặt sân</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <div className="search-field" style={{ marginBottom: '1.25rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem' }}>
              <div className="search-field-content" style={{ width: '100%' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#374151' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                  style={{ width: '100%', border: 'none', outline: 'none', padding: '0.25rem 0' }}
                />
              </div>
            </div>

            <div className="search-field" style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem' }}>
              <div className="search-field-content" style={{ width: '100%' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#374151' }}>Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', border: 'none', outline: 'none', padding: '0.25rem 0' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
            Chưa có tài khoản? <Link to="/register" style={{ color: '#22c55e', fontWeight: 'bold', textDecoration: 'none' }}>Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;