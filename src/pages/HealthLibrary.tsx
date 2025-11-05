// src/pages/HealthLibrary.tsx
import React, { useState } from 'react';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  image: string;
  content: string;
  tags: string[];
}

const HealthLibrary: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const articles: Article[] = [
    {
      id: '1',
      title: 'Top 5 Herbs for Digestive Health',
      description: 'Discover natural remedies for bloating, indigestion, and gut health',
      category: 'Digestive Health',
      readTime: '5 min read',
      image: '🌿',
      tags: ['digestion', 'bloating', 'gut health'],
      content: `## Top 5 Herbs for Digestive Health

### 1. Ginger (Zingiber officinale)
**Benefits**: Reduces nausea, improves digestion, anti-inflammatory
**How to use**: 
- Tea: Steep 2-3 thin slices in hot water for 10 minutes
- Fresh: Add to meals or chew small piece after eating
**Dosage**: 2-3 cups of tea daily

### 2. Peppermint (Mentha piperita)
**Benefits**: Relieves bloating, reduces stomach cramps, cools digestion
**How to use**:
- Tea: Steep 1-2 tsp dried leaves for 5-7 minutes
- Essential oil: Dilute and massage on abdomen
**Precautions**: Avoid if you have GERD

### 3. Fennel (Foeniculum vulgare)
**Benefits**: Reduces gas, relieves constipation, antispasmodic
**How to use**:
- Tea: Crush 1 tsp seeds, steep for 10 minutes
- Chew seeds directly after meals
**Best for**: Post-meal bloating and gas

### 4. Chamomile (Matricaria chamomilla)
**Benefits**: Calms digestive system, reduces inflammation, relaxes muscles
**How to use**:
- Tea: Steep 2-3 tsp flowers for 5-10 minutes
- Drink 30 minutes before meals
**Ideal for**: Stress-related digestive issues

### 5. Turmeric (Curcuma longa)
**Benefits**: Powerful anti-inflammatory, supports liver function
**How to use**:
- Golden milk: Mix 1 tsp powder with warm milk
- Add to curries and soups
**Enhancement**: Take with black pepper for better absorption`
    },
    {
      id: '2',
      title: 'Natural Stress Relief: Herbal Solutions',
      description: 'Calm your mind and body with these traditional remedies',
      category: 'Mental Wellness',
      readTime: '4 min read',
      image: '🧘',
      tags: ['stress', 'anxiety', 'relaxation'],
      content: `## Natural Stress Relief: Herbal Solutions

### Understanding Stress
Stress affects both mind and body. Herbal remedies can help restore balance naturally.

### Top Herbs for Stress

#### 1. Ashwagandha (Withania somnifera)
**Benefits**: Adaptogen that helps body cope with stress, reduces cortisol
**How to use**:
- Powder: 1/2 tsp in warm milk or water
- Capsules: As directed on package
**Best time**: Evening, helps with sleep

#### 2. Lavender (Lavandula angustifolia)
**Benefits**: Calms nervous system, promotes relaxation
**How to use**:
- Aromatherapy: Diffuse essential oil
- Tea: Steep 1-2 tsp dried flowers
- Bath: Add 10 drops to warm bath

#### 3. Lemon Balm (Melissa officinalis)
**Benefits**: Uplifts mood, reduces anxiety, improves sleep
**How to use**:
- Tea: Steep fresh leaves for 5-7 minutes
- Tincture: As directed
**Note**: Works well in combination with other calming herbs

### Daily Stress Management
- Practice deep breathing for 5 minutes daily
- Take short walks in nature
- Maintain consistent sleep schedule
- Limit caffeine and sugar intake`
    },
    {
      id: '3',
      title: 'Immune-Boosting Herbs for Cold Season',
      description: 'Strengthen your immune system naturally with these powerful herbs',
      category: 'Immune Health',
      readTime: '6 min read',
      image: '🛡️',
      tags: ['immunity', 'cold', 'flu', 'prevention'],
      content: `## Immune-Boosting Herbs for Cold Season

### Building Natural Immunity
A strong immune system is your best defense against seasonal illnesses.

### Key Immune Herbs

#### 1. Echinacea (Echinacea purpurea)
**Benefits**: Stimulates immune response, reduces cold duration
**How to use**:
- Tea: Steep 1-2 tsp dried herb at first sign of cold
- Tincture: As directed on package
**Usage**: Start at first symptoms, continue for 7-10 days

#### 2. Elderberry (Sambucus nigra)
**Benefits**: Antiviral properties, rich in antioxidants
**How to use**:
- Syrup: Take 1 tsp daily for prevention
- Tea: Brew dried berries
**Note**: Cook berries before consumption

#### 3. Astragalus (Astragalus membranaceus)
**Benefits**: Long-term immune support, adaptogen
**How to use**:
- Decoction: Simmer sliced root for 20-30 minutes
- Powder: Add to soups and broths
**Best for**: Preventive daily use

### Prevention Strategy
- Start herbs 1-2 months before cold season
- Combine with vitamin C-rich foods
- Ensure adequate sleep and hydration
- Practice good hygiene`
    }
  ];

  const categories = ['All', 'Digestive Health', 'Mental Wellness', 'Immune Health', 'Skin Care', 'Respiratory Health'];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedArticle) {
    return (
      <div className="page-container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={() => setSelectedArticle(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2E7D32',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Back to Library
          </button>

          <article style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>{selectedArticle.image}</div>
              <div>
                <span style={{ 
                  background: '#E8F5E8', 
                  color: '#2E7D32', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {selectedArticle.category}
                </span>
                <h1 style={{ color: '#333333', margin: '0.5rem 0' }}>{selectedArticle.title}</h1>
                <p style={{ color: '#666666', margin: 0 }}>{selectedArticle.readTime}</p>
              </div>
            </div>

            <div style={{ 
              color: '#333333', 
              lineHeight: '1.8',
              whiteSpace: 'pre-line'
            }}>
              {selectedArticle.content}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #E0E0E0' }}>
              <strong style={{ color: '#666666' }}>Tags: </strong>
              {selectedArticle.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: '#F8F9FA',
                    color: '#666666',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    marginLeft: '0.5rem'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="page-title">Health Library</h1>
          <p className="page-subtitle">
            Evidence-based articles on herbal medicine and natural wellness
          </p>
        </div>

        {/* Search and Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search articles, herbs, or conditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #E0E0E0',
              borderRadius: '12px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category}
                style={{
                  padding: '0.5rem 1rem',
                  background: category === 'All' ? '#2E7D32' : '#F8F9FA',
                  color: category === 'All' ? 'white' : '#666666',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem' 
        }}>
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#2E7D32';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{article.image}</div>
                <div>
                  <span style={{ 
                    background: '#E8F5E8', 
                    color: '#2E7D32', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {article.category}
                  </span>
                  <h3 style={{ color: '#333333', margin: '0.5rem 0' }}>{article.title}</h3>
                </div>
              </div>
              
              <p style={{ color: '#666666', marginBottom: '1rem', lineHeight: '1.5' }}>
                {article.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#999999', fontSize: '0.875rem' }}>{article.readTime}</span>
                <button
                  style={{
                    background: 'transparent',
                    color: '#2E7D32',
                    border: '1px solid #2E7D32',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Read Article
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666666' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3>No articles found</h3>
            <p>Try different search terms or browse all categories</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthLibrary;