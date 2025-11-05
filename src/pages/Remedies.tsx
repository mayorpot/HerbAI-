// src/pages/Remedies.tsx
import React, { useState } from 'react';

const Remedies: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [showResults, setShowResults] = useState(false);

  const commonSymptoms = [
    'Headache', 'Stress', 'Insomnia', 'Digestive Issues', 'Cold & Flu',
    'Skin Problems', 'Joint Pain', 'Low Energy', 'Anxiety', 'Allergies'
  ];

  const herbalRemedies = [
    {
      name: 'Chamomile',
      scientificName: 'Matricaria chamomilla',
      uses: ['Anxiety relief', 'Sleep aid', 'Digestive support', 'Skin inflammation'],
      symptoms: ['Stress', 'Insomnia', 'Digestive Issues', 'Anxiety'],
      preparation: 'Tea: Steep 2-3 tsp dried flowers in hot water for 5-10 minutes',
      dosage: '2-3 cups daily',
      warnings: ['May interact with blood thinners', 'Avoid if allergic to ragweed']
    },
    {
      name: 'Ginger',
      scientificName: 'Zingiber officinale',
      uses: ['Nausea relief', 'Anti-inflammatory', 'Digestive aid', 'Cold symptoms'],
      symptoms: ['Digestive Issues', 'Cold & Flu', 'Joint Pain'],
      preparation: 'Tea: Steep 2-3 thin slices fresh ginger in hot water for 10 minutes',
      dosage: '2-3 cups daily as needed',
      warnings: ['May interact with blood thinners', 'Large doses may cause heartburn']
    },
    {
      name: 'Lavender',
      scientificName: 'Lavandula angustifolia',
      uses: ['Anxiety relief', 'Sleep improvement', 'Headache relief', 'Stress reduction'],
      symptoms: ['Stress', 'Insomnia', 'Headache', 'Anxiety'],
      preparation: 'Tea: Steep 1-2 tsp dried flowers in hot water for 5 minutes',
      dosage: '1-2 cups daily, especially before bed',
      warnings: ['May cause drowsiness', 'Avoid during early pregnancy']
    },
    {
      name: 'Peppermint',
      scientificName: 'Mentha piperita',
      uses: ['Digestive relief', 'Headache relief', 'Respiratory support', 'Energy boost'],
      symptoms: ['Headache', 'Digestive Issues', 'Cold & Flu', 'Low Energy'],
      preparation: 'Tea: Steep 1-2 tsp dried leaves in hot water for 5-7 minutes',
      dosage: '2-3 cups daily between meals',
      warnings: ['May cause heartburn in some people', 'Avoid with GERD']
    },
    {
      name: 'Turmeric',
      scientificName: 'Curcuma longa',
      uses: ['Anti-inflammatory', 'Joint pain relief', 'Immune support', 'Antioxidant'],
      symptoms: ['Joint Pain', 'Low Energy', 'Cold & Flu'],
      preparation: 'Golden milk: Mix 1 tsp powder with warm milk and honey',
      dosage: '1-2 times daily',
      warnings: ['May interact with blood thinners', 'High doses may cause stomach upset']
    },
    {
      name: 'Echinacea',
      scientificName: 'Echinacea purpurea',
      uses: ['Immune support', 'Cold prevention', 'Respiratory health', 'Anti-inflammatory'],
      symptoms: ['Cold & Flu', 'Allergies'],
      preparation: 'Tea: Steep 1-2 tsp dried herb in hot water for 10 minutes',
      dosage: 'At first sign of cold, 3-4 cups daily for up to 10 days',
      warnings: ['Not for long-term use', 'Avoid if allergic to ragweed']
    }
  ];

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const findRemedies = () => {
    if (symptoms.length > 0) {
      setShowResults(true);
    }
  };

  const getMatchingRemedies = () => {
    return herbalRemedies.filter(remedy =>
      remedy.symptoms.some(symptom => symptoms.includes(symptom))
    );
  };

  const resetSearch = () => {
    setSymptoms([]);
    setShowResults(false);
    setSearchInput('');
  };

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchInput.toLowerCase())
  );

  const matchingRemedies = getMatchingRemedies();

  return (
    <div className="page-container">
      <h1 className="page-title">Find Herbal Remedies</h1>
      <p className="page-subtitle">
        Select your symptoms to discover natural herbal treatments
      </p>

      {!showResults ? (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Search Input */}
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Symptoms Grid */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333333' }}>
              Select your symptoms ({symptoms.length} selected)
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {filteredSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${symptoms.includes(symptom) ? '#2E7D32' : '#E0E0E0'}`,
                    borderRadius: '12px',
                    background: symptoms.includes(symptom) ? '#2E7D3215' : '#FFFFFF',
                    color: symptoms.includes(symptom) ? '#2E7D32' : '#333333',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {symptom} {symptoms.includes(symptom) && '✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={findRemedies}
            disabled={symptoms.length === 0}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              background: symptoms.length > 0 ? '#2E7D32' : '#CCCCCC',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: symptoms.length > 0 ? 'pointer' : 'not-allowed',
              opacity: symptoms.length > 0 ? 1 : 0.6
            }}
          >
            Find Herbal Remedies ({symptoms.length} symptoms selected)
          </button>
        </div>
      ) : (
        <div>
          {/* Results Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#F8F9FA',
            borderRadius: '12px'
          }}>
            <div>
              <h2 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>
                Recommended Herbal Remedies
              </h2>
              <p style={{ color: '#666666' }}>
                Based on: {symptoms.join(', ')}
              </p>
            </div>
            <button
              onClick={resetSearch}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: '#666666',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              New Search
            </button>
          </div>

          {/* Remedies Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem' 
          }}>
            {matchingRemedies.map((remedy, index) => (
              <div
                key={index}
                style={{
                  background: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                  border: '2px solid #E8F5E8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>{remedy.name}</h3>
                    <p style={{ color: '#666666', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      {remedy.scientificName}
                    </p>
                  </div>
                  <span style={{
                    background: '#4CAF50',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {remedy.symptoms.filter(s => symptoms.includes(s)).length} matches
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#333333', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💊</span> Uses
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {remedy.uses.map((use, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#E8F5E8',
                          color: '#2E7D32',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem'
                        }}
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#333333', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚗️</span> Preparation
                  </h4>
                  <p style={{ color: '#666666', lineHeight: '1.5' }}>{remedy.preparation}</p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#333333', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📋</span> Dosage
                  </h4>
                  <p style={{ color: '#666666' }}>{remedy.dosage}</p>
                </div>

                <div style={{ 
                  background: '#FFF3E0', 
                  border: '1px solid #FFB74D',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ color: '#E65100', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚠️</span> Precautions
                  </h4>
                  <p style={{ color: '#E65100', fontSize: '0.9rem' }}>{remedy.warnings.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>

          {matchingRemedies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
              <h3>No remedies found</h3>
              <p>Try selecting different symptoms or consult with our herbal doctors</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Remedies;