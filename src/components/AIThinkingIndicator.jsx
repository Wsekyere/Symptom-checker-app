import React, { useEffect, useState } from 'react';
import './AIThinkingIndicator.css';

const AIThinkingIndicator = ({ isLoading, children }) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  return (
    <div className="ai-thinking-container">
      {isLoading ? (
        <div className="ai-thinking">
          <span className="ai-thinking-text">AI is thinking{dots}</span>
        </div>
      ) : (
        <div className="ai-content fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default AIThinkingIndicator;