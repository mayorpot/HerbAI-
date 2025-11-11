// Updated HealthAssistant.tsx with real AI integration
import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const HealthAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm HerbAI, your AI natural health assistant. I can help you understand your symptoms and suggest herbal remedies. What's bothering you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      // Call real AI API - UPDATED METHOD
      const response = await apiService.askQuestion(inputText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI API error:', err);
      setError(err.message || 'Sorry, I encountered an error. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please check your internet connection and try again. In the meantime, you can browse our herbal database for common remedies.",
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What herbs help with headaches?",
    "Natural remedies for stress and anxiety",
    "Herbs for better sleep",
    "Remedies for digestive issues",
    "Herbs for immune support",
    "Natural solutions for inflammation"
  ];

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm HerbAI, your AI natural health assistant. I can help you understand your symptoms and suggest herbal remedies. What's bothering you today?",
        sender: 'assistant',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="page-title">HerbAI Health Assistant</h1>
          <p className="page-subtitle">
            Powered by AI • Herbal Medicine Expert • Natural Solutions
          </p>
        </div>

        {/* Error Message */}
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
            ⚠️ {error}
          </div>
        )}

        {/* Chat Container */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Clear Chat Button */}
          <button
            onClick={clearConversation}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              color: '#666666',
              border: '1px solid #E0E0E0',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              zIndex: 10
            }}
          >
            Clear Chat
          </button>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%'
                }}
              >
                <div style={{
                  background: message.sender === 'user' ? '#2E7D32' : '#F8F9FA',
                  color: message.sender === 'user' ? 'white' : '#333333',
                  padding: '1rem 1.5rem',
                  borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.5'
                }}>
                  {message.text}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#666666',
                  marginTop: '0.25rem',
                  textAlign: message.sender === 'user' ? 'right' : 'left'
                }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{
                  background: '#F8F9FA',
                  color: '#333333',
                  padding: '1rem 1.5rem',
                  borderRadius: '18px 18px 18px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#666666',
                      animation: 'typing 1.4s infinite'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#666666',
                      animation: 'typing 1.4s infinite 0.2s'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#666666',
                      animation: 'typing 1.4s infinite 0.4s'
                    }}></div>
                  </div>
                  HerbAI is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #E0E0E0',
            background: '#F8F9FA'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#666666', marginBottom: '0.5rem' }}>
              Try asking about:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'white',
                    border: '1px solid #E0E0E0',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    color: '#333333'
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #E0E0E0',
            display: 'flex',
            gap: '1rem'
          }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about herbs, symptoms, or natural remedies (e.g., 'What herbs help with headaches?')"
              style={{
                flex: 1,
                padding: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                fontSize: '1rem',
                resize: 'none',
                minHeight: '60px',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              style={{
                padding: '1rem 1.5rem',
                background: inputText.trim() && !isTyping ? '#2E7D32' : '#CCCCCC',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              {isTyping ? '...' : 'Send'}
            </button>
          </div>
        </div>

        {/* AI Info */}
        <div style={{
          background: '#E8F5E8',
          border: '1px solid #2E7D32',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <strong>🤖 Powered by AI Knowledge Base</strong>
          <p style={{ color: '#666666', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
            This AI assistant provides herbal recommendations based on traditional knowledge and evidence-based practices.
          </p>
        </div>

        {/* Safety Notice */}
        <div style={{
          background: '#FFF3E0',
          border: '1px solid #FFB74D',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <strong>⚠️ Important Safety Information:</strong> HerbAI provides herbal recommendations based on traditional knowledge. 
          Always consult with a healthcare provider for proper diagnosis, especially for persistent or severe symptoms. 
          Discontinue use if any adverse reactions occur.
        </div>

        <style>
          {`
            @keyframes typing {
              0%, 60%, 100% { opacity: 0.3; }
              30% { opacity: 1; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default HealthAssistant;