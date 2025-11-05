// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h1 className="page-title">Welcome Back</h1>
          <p className="page-subtitle">Sign in to your ALBA account</p>
        </div>

        {error && (
          <div style={{
            background: '#FFEBEE',
            border: '1px solid #F44336',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#C62828',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              background: loading ? '#CCCCCC' : '#2E7D32',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1.5rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', color: '#666666' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2E7D32', fontWeight: '500', textDecoration: 'none' }}>
              Sign up
            </Link>
          </div>
        </form>

        {/* Demo credentials */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#F8F9FA', 
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#666666'
        }}>
          <strong>Demo Account:</strong><br />
          Email: demo@alba.com<br />
          Password: demo123
        </div>
      </div>
    </div>
  );
};

export default Login;