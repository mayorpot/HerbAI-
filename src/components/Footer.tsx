// src/components/Footer.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();

  // Hide footer on login/register pages - return null to remove completely
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  if (isAuthPage) {
    return null;
  }

  return (
    <footer style={footerStyles}>
      <div style={footerContentStyles}>
        <div style={footerLogoStyles}>
          <span>🌿</span>
          <span style={{ marginLeft: '0.5rem' }}>HerbAI</span>
        </div>
        
        <p style={footerDisclaimerStyles}>
          This information is for educational purposes only and is not a substitute for professional medical advice.
          Always consult with a healthcare provider before using herbal remedies.
        </p>
        
        <div style={footerLinksStyles}>
          <span style={footerCopyrightStyles}>
            © 2024 HerbAI. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

// Footer Styles
const footerStyles: React.CSSProperties = {
  background: '#000000',
  borderTop: '1px solid #333333',
  padding: '2rem 1rem',
  marginTop: 'auto',
};

const footerContentStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  textAlign: 'center',
};

const footerLogoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#48bb78',
  marginBottom: '1rem',
};

const footerDisclaimerStyles: React.CSSProperties = {
  color: '#a0a0a0',
  fontSize: '0.875rem',
  lineHeight: 1.6,
  maxWidth: '600px',
  margin: '0 auto 1rem auto',
};

const footerLinksStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '2rem',
  marginTop: '1rem',
};

const footerCopyrightStyles: React.CSSProperties = {
  color: '#718096',
  fontSize: '0.75rem',
};

export default Footer;