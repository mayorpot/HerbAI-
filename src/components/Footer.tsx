// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span>🌿</span>
          <span>ALBA Herbal Medicine</span>
        </div>
        
        <p className="footer-disclaimer">
          This information is for educational purposes only and is not a substitute for professional medical advice.
          Always consult with a healthcare provider before using herbal remedies.
        </p>
      </div>
    </footer>
  );
};

export default Footer;