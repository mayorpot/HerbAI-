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
        {/* Left Section */}
        <div style={leftSectionStyles}>
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

        {/* Right Section - Social Media */}
        <div style={rightSectionStyles}>
          <div style={socialMediaStyles}>
            <span style={socialTextStyles}>Follow Us</span>
            <div style={socialIconsStyles}>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={socialLinkStyles}
                className="social-link"
                aria-label="Follow us on Instagram"
              >
                📷
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={socialLinkStyles}
                className="social-link"
                aria-label="Follow us on Facebook"
              >
                👍
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={socialLinkStyles}
                className="social-link"
                aria-label="Follow us on LinkedIn"
              >
                💼
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Updated Footer Styles with reduced height
const footerStyles: React.CSSProperties = {
  background: '#FFFFFF',
  borderTop: '1px solid #E8F5E8',
  padding: '1rem 1rem', // Reduced from 1.5rem to 1rem
  marginTop: 'auto',
  boxShadow: '0 -2px 10px rgba(46, 125, 50, 0.1)',
  minHeight: 'auto', // Ensure no minimum height
};

const footerContentStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem', // Reduced from 2rem to 1rem
};

const leftSectionStyles: React.CSSProperties = {
  flex: 1,
  maxWidth: '500px',
};

const rightSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  minWidth: '120px', // Reduced from 150px
};

const footerLogoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.1rem', // Reduced from 1.25rem
  fontWeight: 'bold',
  color: '#2E7D32',
  marginBottom: '0.5rem', // Reduced from 0.75rem
};

const footerDisclaimerStyles: React.CSSProperties = {
  color: '#666666',
  fontSize: '0.75rem', // Reduced from 0.8rem
  lineHeight: 1.4, // Reduced from 1.5
  marginBottom: '0.5rem', // Reduced from 0.75rem
};

const footerLinksStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem', // Reduced from 2rem
};

const footerCopyrightStyles: React.CSSProperties = {
  color: '#888888',
  fontSize: '0.7rem', // Reduced from 0.75rem
};

// Social Media Styles
const socialMediaStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.5rem', // Reduced from 0.75rem
};

const socialTextStyles: React.CSSProperties = {
  color: '#666666',
  fontSize: '0.8rem', // Reduced from 0.875rem
  fontWeight: '500',
};

const socialIconsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem', // Reduced from 0.75rem
  alignItems: 'center',
};

const socialLinkStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px', // Reduced from 36px
  height: '32px', // Reduced from 36px
  borderRadius: '50%',
  background: '#F8F9FA',
  border: '1px solid #E8F5E8',
  fontSize: '1rem', // Reduced from 1.1rem
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
};

// Add hover effects
const style = document.createElement('style');
style.textContent = `
  .social-link:hover {
    background: #E8F5E8;
    border-color: #2E7D32;
    transform: translateY(-1px); // Reduced from -2px
  }

  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem; // Reduced from 1.5rem
    }
    
    .right-section {
      align-items: center;
    }
    
    .social-media {
      align-items: center;
    }
  }
`;
document.head.appendChild(style);

export default Footer;