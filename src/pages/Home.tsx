// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const quickActions = [
    {
      title: 'Scan Leaf',
      description: 'Identify plants and learn about their medicinal uses',
      icon: '📷',
      color: '#4CAF50',
      path: '/scanner',
    },
    {
      title: 'Find Remedies',
      description: 'Get herbal recommendations based on your symptoms',
      icon: '🌿',
      color: '#FF9800',
      path: '/remedies',
    },
    {
      title: 'Consult Doctor',
      description: 'Talk to certified herbal medicine practitioners',
      icon: '👨‍⚕️',
      color: '#2196F3',
      path: '/consultation',
    },
    {
      title: 'Health Profile',
      description: 'Manage your health information and preferences',
      icon: '👤',
      color: '#9C27B0',
      path: '/profile',
    },
  ];

  const healthTips = [
    'Always consult with a healthcare provider before trying new herbal remedies, especially if you have existing medical conditions.',
    'Start with small doses when trying new herbs to check for any adverse reactions.',
    'Research potential herb-drug interactions if you are taking prescription medications.',
    'Purchase herbs from reputable sources to ensure quality and purity.',
    'Keep a journal to track your symptoms and the effects of herbal treatments.',
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to HerbAI</h1>
        <p className="hero-subtitle">
          Your modern herbal medicine companion. Discover natural remedies, 
          identify medicinal plants, and consult with certified practitioners.
        </p>
      </section>

      <section className="section">
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} className="action-card">
              <div 
                className="action-icon" 
                style={{ backgroundColor: `${action.color}20`, color: action.color }}
              >
                {action.icon}
              </div>
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
              <div className="action-link">
                Get Started <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Health & Safety Tips</h2>
        <div className="tips-grid">
          {healthTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <p className="tip-text">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;