import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import MedicationAdvice from './MedicationAdvice';
import './Results.css';

const Results = ({ conditions, triage, onRestart }) => {
  const [showMedicationAdvice, setShowMedicationAdvice] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Immediately show results without thinking animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 100); // Small delay to ensure smooth render
    return () => clearTimeout(timer);
  }, []);

  // Handle medication advice button click without animation
  const handleMedicationAdviceClick = () => {
    setShowMedicationAdvice(true); // Transition directly to MedicationAdvice
  };

  const filteredConditions = conditions
    ? conditions
        .filter(condition => condition.probability > 0)
        .sort((a, b) => b.probability - a.probability)
    : [];

  return (
    <div className="results-container">
      {showMedicationAdvice ? (
        <MedicationAdvice
          conditions={filteredConditions}
          onBack={() => setShowMedicationAdvice(false)}
        />
      ) : (
        <div className="results-content">
          {showResults && (
            <>
              <h2 className="text-center mb-4 fade-in" style={{ animationDelay: '0s' }}>
                Diagnosis Results
              </h2>

              {triage && (
                <Alert
                  variant={triage.color || 'info'}
                  className="mb-4 fade-in"
                  style={{ animationDelay: '0.5s' }}
                >
                  <strong>{triage.label}:</strong> {triage.description}
                </Alert>
              )}

              {filteredConditions.length > 0 ? (
                <>
                  <div className="conditions-list">
                    {filteredConditions.map((condition, index) => (
                      <div
                        key={index}
                        className="condition-item fade-in"
                        style={{ animationDelay: `${0.7 + index * 0.3}s` }}
                      >
                        <span className="condition-name">{condition.name}</span>
                        <span className="condition-probability">
                          {Math.round(condition.probability * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="disclaimer mb-4 fade-in"
                    style={{ animationDelay: `${0.7 + filteredConditions.length * 0.3}s` }}
                  >
                    <p>
                      <strong>Disclaimer:</strong> This tool provides general information and is not a substitute for professional medical advice. Always consult with a healthcare provider for medical concerns.
                    </p>
                  </div>

                  <div
                    className="text-center mt-4 mb-3 fade-in"
                    style={{ animationDelay: `${1 + filteredConditions.length * 0.3}s` }}
                  >
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleMedicationAdviceClick}
                      className="medication-advice-button"
                    >
                      <i className="fas fa-pills mr-2"></i> Get AI Medication Advice
                    </Button>
                    <p className="mt-2 text-muted">
                      Get personalized medication suggestions based on your symptoms
                    </p>
                  </div>

                  <div
                    className="text-center mt-4 fade-in"
                    style={{ animationDelay: `${1.3 + filteredConditions.length * 0.3}s` }}
                  >
                    <Button variant="outline-secondary" onClick={onRestart} className="restart-button">
                      Start Over
                    </Button>
                  </div>
                </>
              ) : (
                <Alert
                  variant="warning"
                  className="fade-in"
                  style={{ animationDelay: '0.5s' }}
                >
                  No conditions could be determined based on the provided symptoms.
                </Alert>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;