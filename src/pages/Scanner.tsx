// src/pages/Scanner.tsx
import React, { useState, useRef } from 'react';

const Scanner: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setScanResult(null);
      simulateScan();
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setScanResult(null);
      simulateScan();
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults = [
        {
          name: "Moringa Oleifera",
          scientificName: "Moringa oleifera",
          uses: [
            "Rich in vitamins A, C, and E",
            "High in calcium and potassium",
            "Powerful antioxidant properties",
            "Supports immune system function",
            "Anti-inflammatory effects"
          ],
          preparation: [
            "Tea: Steep 1-2 teaspoons of dried leaves in hot water for 5-10 minutes",
            "Powder: Add 1/2 to 1 teaspoon to smoothies or food daily",
            "Capsules: Follow manufacturer's dosage instructions"
          ],
          warnings: [
            "May lower blood pressure",
            "Consult doctor if pregnant or breastfeeding",
            "May interact with diabetes medications",
            "Start with small doses to check tolerance"
          ],
          safety: "safe"
        },
        {
          name: "Neem",
          scientificName: "Azadirachta indica",
          uses: [
            "Skin conditions like acne and eczema",
            "Oral health and dental care",
            "Blood purification",
            "Immune system support",
            "Anti-fungal properties"
          ],
          preparation: [
            "Tea: Boil 4-5 leaves in water for 5 minutes, strain and drink",
            "Paste: Crush leaves with water for topical application",
            "Oil: Apply diluted oil to affected skin areas"
          ],
          warnings: [
            "Not recommended for pregnant women",
            "May cause stomach irritation in large doses",
            "Can interact with diabetes and blood pressure medications",
            "Use cautiously with autoimmune conditions"
          ],
          safety: "caution"
        },
        {
          name: "Aloe Vera",
          scientificName: "Aloe barbadensis miller",
          uses: [
            "Skin burns and wounds",
            "Digestive health support",
            "Moisturizes skin",
            "Anti-inflammatory properties",
            "Supports oral health"
          ],
          preparation: [
            "Gel: Apply fresh gel directly to skin",
            "Juice: Drink 2-4 ounces daily for digestive health",
            "Poultice: Apply gel with clean cloth to affected areas"
          ],
          warnings: [
            "Oral use may cause cramping or diarrhea",
            "Not for use on deep or surgical wounds",
            "Some people may be allergic to aloe",
            "Consult doctor before internal use"
          ],
          safety: "safe"
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setScanResult(randomResult);
      setIsScanning(false);
    }, 2000);
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe': return '#4CAF50';
      case 'caution': return '#FF9800';
      case 'toxic': return '#F44336';
      default: return '#666666';
    }
  };

  const getSafetyText = (safety: string) => {
    switch (safety) {
      case 'safe': return 'Generally Safe';
      case 'caution': return 'Use With Caution';
      case 'toxic': return 'Potentially Toxic';
      default: return 'Safety Unknown';
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setScanResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Leaf Scanner</h1>
      <p className="page-subtitle">
        Upload a photo to identify plants and learn about their medicinal uses
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Upload Section */}
        <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.12)' }}>
          <h2 style={{ marginBottom: '1rem', color: '#2E7D32' }}>Upload Leaf Image</h2>
          
          <div
            style={{
              border: '2px dashed #E0E0E0',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: selectedImage ? '#F8F9FA' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <div>
                <img 
                  src={selectedImage} 
                  alt="Selected leaf" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }} 
                />
                <p>Image selected ✓</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                <p style={{ color: '#666666', marginBottom: '1rem' }}>
                  Drag & drop a leaf image here, or click to browse
                </p>
                <button 
                  style={{
                    background: '#2E7D32',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Choose Image
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          {selectedImage && (
            <button
              onClick={resetScanner}
              style={{
                background: 'transparent',
                color: '#666666',
                border: '1px solid #E0E0E0',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                marginTop: '1rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Upload Different Image
            </button>
          )}
        </div>

        {/* Results Section */}
        <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.12)' }}>
          <h2 style={{ marginBottom: '1rem', color: '#2E7D32' }}>Identification Results</h2>
          
          {isScanning ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
              <p>Analyzing leaf image...</p>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                background: '#E0E0E0', 
                borderRadius: '2px',
                marginTop: '2rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#2E7D32',
                  animation: 'loading 2s infinite'
                }}></div>
              </div>
            </div>
          ) : scanResult ? (
            <div>
              <div style={{ 
                background: '#F8F9FA', 
                padding: '1.5rem', 
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>{scanResult.name}</h3>
                    <p style={{ color: '#666666', fontStyle: 'italic' }}>{scanResult.scientificName}</p>
                  </div>
                  <span style={{
                    background: getSafetyColor(scanResult.safety),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {getSafetyText(scanResult.safety)}
                  </span>
                </div>

                {selectedImage && (
                  <img 
                    src={selectedImage} 
                    alt={scanResult.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#333333', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>✅</span> Medicinal Uses
                </h4>
                <ul style={{ color: '#666666', paddingLeft: '1.5rem' }}>
                  {scanResult.uses.map((use: string, index: number) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{use}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#333333', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⚗️</span> Preparation Methods
                </h4>
                <ul style={{ color: '#666666', paddingLeft: '1.5rem' }}>
                  {scanResult.preparation.map((method: string, index: number) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{method}</li>
                  ))}
                </ul>
              </div>

              <div style={{ 
                background: '#FFF3E0', 
                border: '1px solid #FFB74D',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1.5rem'
              }}>
                <h4 style={{ color: '#E65100', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⚠️</span> Important Safety Information
                </h4>
                <ul style={{ color: '#E65100', paddingLeft: '1.5rem' }}>
                  {scanResult.warnings.map((warning: string, index: number) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#666666' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
              <p>Upload a leaf image to see identification results</p>
            </div>
          )}
        </div>
      </div>

      {/* Add loading animation */}
      <style>
        {`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default Scanner;