// src/pages/HerbalStore.tsx
import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  benefits: string[];
  usage: string;
}

const HerbalStore: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Ginger Powder',
      description: '100% pure dried ginger root powder for digestive health',
      price: 12.99,
      image: '🫚',
      category: 'Digestive Health',
      rating: 4.8,
      inStock: true,
      benefits: ['Relieves nausea', 'Improves digestion', 'Anti-inflammatory'],
      usage: 'Add 1/2 tsp to tea, smoothies, or meals'
    },
    {
      id: '2',
      name: 'Chamomile Flowers',
      description: 'Dried chamomile flowers for relaxation and sleep',
      price: 8.99,
      image: '🌼',
      category: 'Mental Wellness',
      rating: 4.6,
      inStock: true,
      benefits: ['Promotes relaxation', 'Aids sleep', 'Calms nerves'],
      usage: 'Steep 2-3 tsp in hot water for 5-10 minutes'
    },
    {
      id: '3',
      name: 'Turmeric Curcumin',
      description: 'High-potency turmeric with black pepper for absorption',
      price: 18.99,
      image: '🟡',
      category: 'Anti-inflammatory',
      rating: 4.9,
      inStock: true,
      benefits: ['Powerful anti-inflammatory', 'Joint support', 'Antioxidant'],
      usage: 'Take 1 capsule daily with food'
    },
    {
      id: '4',
      name: 'Peppermint Leaves',
      description: 'Dried peppermint leaves for digestive comfort',
      price: 7.99,
      image: '🌿',
      category: 'Digestive Health',
      rating: 4.7,
      inStock: false,
      benefits: ['Relieves bloating', 'Soothes stomach', 'Fresh breath'],
      usage: 'Steep 1-2 tsp in hot water for 5-7 minutes'
    },
    {
      id: '5',
      name: 'Ashwagandha Root Powder',
      description: 'Traditional adaptogen for stress relief',
      price: 14.99,
      image: '🍃',
      category: 'Mental Wellness',
      rating: 4.5,
      inStock: true,
      benefits: ['Reduces stress', 'Improves sleep', 'Boosts energy'],
      usage: 'Mix 1/2 tsp in warm milk or water'
    },
    {
      id: '6',
      name: 'Echinacea Tincture',
      description: 'Alcohol-free immune support extract',
      price: 16.99,
      image: '💜',
      category: 'Immune Health',
      rating: 4.4,
      inStock: true,
      benefits: ['Immune booster', 'Cold prevention', 'Antioxidant'],
      usage: 'Take 1 dropperful daily or as needed'
    }
  ];

  const categories = ['All', 'Digestive Health', 'Mental Wellness', 'Anti-inflammatory', 'Immune Health'];

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="page-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="page-title">Herbal Store</h1>
          <p className="page-subtitle">
            Premium quality herbs and natural products for your wellness journey
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
          {/* Products Section */}
          <div>
            {/* Categories */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: selectedCategory === category ? '#2E7D32' : '#F8F9FA',
                      color: selectedCategory === category ? 'white' : '#666666',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: '#FFFFFF',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '2px solid transparent'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{product.image}</div>
                    <span style={{ 
                      background: '#E8F5E8', 
                      color: '#2E7D32', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {product.category}
                    </span>
                  </div>

                  <h3 style={{ color: '#333333', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {product.description}
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#333333' }}>Benefits:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                      {product.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#F8F9FA',
                            color: '#666666',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem'
                          }}
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#333333' }}>Usage:</strong>
                    <p style={{ color: '#666666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {product.usage}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2E7D32' }}>
                        ${product.price}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666666', fontSize: '0.875rem' }}>
                        ⭐ {product.rating} • {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: product.inStock ? '#2E7D32' : '#CCCCCC',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: product.inStock ? 'pointer' : 'not-allowed',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333333', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛒 Shopping Cart ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <p style={{ color: '#666666', textAlign: 'center', padding: '1rem' }}>
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem 0',
                          borderBottom: '1px solid #F0F0F0'
                        }}
                      >
                        <div style={{ fontSize: '1.5rem' }}>{item.image}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333333' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#2E7D32', fontWeight: '600' }}>
                            ${item.price}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#666666',
                            cursor: 'pointer',
                            fontSize: '1.25rem'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '2px solid #E0E0E0', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <strong style={{ color: '#333333' }}>Total:</strong>
                      <strong style={{ color: '#2E7D32', fontSize: '1.25rem' }}>${getCartTotal().toFixed(2)}</strong>
                    </div>

                    <button
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#2E7D32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}
                    >
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={() => setCart([])}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        color: '#666666',
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Store Info */}
            <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
              <h4 style={{ color: '#333333', marginBottom: '0.5rem' }}>🌟 Why Choose ALBA Herbs?</h4>
              <ul style={{ color: '#666666', fontSize: '0.875rem', paddingLeft: '1rem', lineHeight: '1.5' }}>
                <li>100% Organic & Natural</li>
                <li>Third-Party Tested</li>
                <li>Sustainably Sourced</li>
                <li>Free Shipping Over $50</li>
                <li>30-Day Money Back Guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HerbalStore;