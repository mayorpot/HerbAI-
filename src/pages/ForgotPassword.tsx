// src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password reset request
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="page-container">
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
          <h1 className="page-title">Check Your Email</h1>
          <p className="page-subtitle">
            We've sent a password reset link to:<br />
            <strong>{email}</strong>
          </p>
          <div style={{ 
            background: '#F8F9FA', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#666666', marginBottom: '1rem' }}>
              If you don't see the email, check your spam folder or try again.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link 
              to="/login" 
              style={{
                padding: '1rem 2rem',
                background: '#2E7D32',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              Back to Login
            </Link>
            <button
              onClick={() => setIsSubmitted(false)}
              style={{
                padding: '1rem 2rem',
                background: 'transparent',
                color: '#666666',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Try Another Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h1 className="page-title">Reset Password</h1>
          <p className="page-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              placeholder="Enter your email address"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem 2rem',
              background: '#2E7D32',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            Send Reset Link
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                color: '#2E7D32', 
                fontWeight: '500', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ← Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;