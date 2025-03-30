import React, { useState, useEffect } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import './MedicationAdvice.css';

const MedicationAdvice = ({ conditions, onBack }) => {
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    medications: true,
    dosage: true,
    warnings: true,
    alternatives: true
  });
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (conditions && conditions.length > 0) {
      setSelectedCondition(conditions[0]);
      
      // Reset loading states when condition changes
      setLoadingStates({
        medications: true,
        dosage: true,
        warnings: true,
        alternatives: true
      });
      
      // Stagger the "AI thinking" times for each section with longer durations
      const timers = [
        setTimeout(() => setLoadingStates(prev => ({ ...prev, medications: false })), 10000),
        setTimeout(() => setLoadingStates(prev => ({ ...prev, dosage: false })), 12000),
        setTimeout(() => setLoadingStates(prev => ({ ...prev, warnings: false })), 14000),
        setTimeout(() => setLoadingStates(prev => ({ ...prev, alternatives: false })), 16000)
      ];
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [conditions]);

  // Animate the dots
  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some(state => state);
    if (!anyLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [loadingStates]);

  if (!selectedCondition) {
    return <div>No conditions available</div>;
  }

  return (
    <Container className="medication-advice-container">
      <Button 
        variant="outline-primary" 
        onClick={onBack} 
        className="back-button mb-4"
      >
        <i className="fas fa-arrow-left"></i> Back to Results
      </Button>
      
      <div className="disclaimer-box mb-4">
        <p className="mb-0">
          <strong>Important:</strong> The information provided is for educational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider before taking any medication.
        </p>
      </div>
      
      <div className="medication-cards">
        <Card className="medication-card">
          <Card.Header className="medication-card-header">
            <div className="d-flex justify-content-between align-items-center">
              <span>{selectedCondition.name}</span>
              <span className="condition-probability">
                {Math.round(selectedCondition.probability * 100)}%
              </span>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="medication-section">
              <div className="section-row">
                <h6>Recommended Medications:</h6>
                {loadingStates.medications && <div className="thinking-indicator">AI is thinking{dots}</div>}
              </div>
              {!loadingStates.medications && (
                <div className="section-content fade-in">
                  <ul className="medication-list">
                    <li>Consult with your doctor for appropriate medications</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="medication-section">
              <div className="section-row">
                <h6>Dosage Information:</h6>
                {loadingStates.dosage && <div className="thinking-indicator">AI is thinking{dots}</div>}
              </div>
              {!loadingStates.dosage && (
                <div className="section-content fade-in">
                  <p>As prescribed by your doctor</p>
                </div>
              )}
            </div>
            
            <div className="medication-section">
              <div className="section-row">
                <h6>Important Warnings:</h6>
                {loadingStates.warnings && <div className="thinking-indicator">AI is thinking{dots}</div>}
              </div>
              {!loadingStates.warnings && (
                <div className="section-content fade-in">
                  <p>Always consult with a healthcare professional before taking any medication.</p>
                </div>
              )}
            </div>
            
            <div className="medication-section">
              <div className="section-row">
                <h6>Alternative Treatments:</h6>
                {loadingStates.alternatives && <div className="thinking-indicator">AI is thinking{dots}</div>}
              </div>
              {!loadingStates.alternatives && (
                <div className="section-content fade-in">
                  <ul className="alternatives-list">
                    <li>Consult with your doctor for alternative treatments</li>
                  </ul>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default MedicationAdvice;