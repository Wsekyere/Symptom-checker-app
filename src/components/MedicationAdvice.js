import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import "./MedicationAdvice.css";

// 🔹 Define keyword lists for filtering warnings & dosages
const warningKeywords = ["risk", "allergy", "avoid", "caution", "side effect", "danger", "interaction"];
const dosageKeywords = ["take", "dosage", "administer", "consume", "amount", "limit", "frequency"];

const MedicationAdvice = ({ conditions, onBack }) => {
  const [medicationAdvice, setMedicationAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const phrases = [
    "Analysing results...",
    "AI is thinking...",
    "Recommending medication...",
    "Recommending alternatives..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 5000); // 🔹 Increased to 5 seconds per phrase
    }

    const fetchMedicationAdvice = async () => {
      setLoading(true);
      const filteredConditions = conditions.filter(condition => condition.probability > 0);

      const advicePromises = filteredConditions.map(async (condition) => {
        try {
          let adviceData = await fetchFromOpenFDA(condition.name);
          if (!adviceData) {
            adviceData = getDefaultAdvice(condition.name);
          } else {
            adviceData.warnings = summarizeText(adviceData.warnings || "No warnings found", warningKeywords);
            adviceData.dosage = summarizeText(adviceData.dosage || "Refer to doctor", dosageKeywords);
          }
          adviceData.probability = condition.probability;
          return adviceData;
        } catch (error) {
          console.error(`Error fetching advice for ${condition.name}:`, error);
          return getDefaultAdvice(condition.name);
        }
      });

      const adviceResults = await Promise.all(advicePromises);
      setMedicationAdvice(adviceResults);
      setLoading(false);
    };

    if (conditions && conditions.length > 0) {
      fetchMedicationAdvice();
    }

    return () => clearInterval(interval);
  }, [conditions]);

  const fetchFromOpenFDA = async (conditionName) => {
    try {
      const response = await fetch(`https://api.fda.gov/drug/label.json?search=indications_and_usage:"${conditionName}"&limit=5`);
      const data = await response.json();

      if (data.results) {
        return {
          condition: conditionName,
          medications: data.results.map((item) => item.openfda.brand_name?.[0] || item.openfda.generic_name?.[0] || "Brand name unavailable"),
          dosage: data.results[0]?.dosage_and_administration?.[0] || "Refer to doctor",
          warnings: data.results[0]?.warnings?.[0] || "No warnings found",
          alternatives: getAlternativeTreatments(conditionName),
        };
      }
      throw new Error("No medication found for this condition");
    } catch (error) {
      console.error(`OpenFDA API error for ${conditionName}:`, error);
      return null;
    }
  };

  const summarizeText = (text, keywords) => {
    const sentences = text.toLowerCase().split(/[.!?]+\s+/).filter(Boolean);
    const keySentences = sentences.filter(sentence => 
      keywords.some(keyword => sentence.includes(keyword.toLowerCase()))
    ).slice(0, 15);
    const summary = keySentences.join(". ");
    return summary.length > 350 ? `${summary.slice(0, 350)}...` : `${summary}.`;
  };

  const getDefaultAdvice = (conditionName) => ({
    condition: conditionName,
    probability: 0,
    medications: ["Consult with a doctor"],
    dosage: "As prescribed by your doctor",
    warnings: "Always consult a healthcare professional before taking any medication.",
    alternatives: getAlternativeTreatments(conditionName),
  });

  const getAlternativeTreatments = (conditionName) => {
    const alternativesMap = {
      "Common cold": ["Rest", "Hydration", "Humidifier", "Saline nasal spray"],
      "Hypertension": ["Low sodium diet", "Regular exercise", "Stress reduction"],
      "Diabetes": ["Balanced diet", "Regular exercise", "Weight management"],
    };
    return alternativesMap[conditionName] || ["Consult with your doctor for alternative treatments"];
  };

  return (
    <div className="medication-advice-container">
      <h2 className="text-center mb-4">AI Medication Advice</h2>
      <div className="disclaimer-box mb-4">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute for professional medical advice.
      </div>
      {loading ? (
        <div className="thinking-container">
          <span className="thinking-text">{phrases[currentPhraseIndex]}</span>
          <div className="loader"></div>
        </div>
      ) : (
        <div className="medication-cards">
          {medicationAdvice.map((advice, index) => (
            <Card key={index} className="medication-card mb-4">
              <Card.Header className="medication-card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{advice.condition}</h5>
                  <span className="condition-probability">
                    {Math.round(advice.probability * 100)}%
                  </span>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="medication-section">
                  <h6 className="section-title">Recommended Medications</h6>
                  <ul className="medication-list">
                    {advice.medications.map((med, idx) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </div>
                <div className="medication-section">
                  <h6 className="section-title">Dosage Information</h6>
                  <p className="section-content">{advice.dosage}</p>
                </div>
                <div className="medication-section">
                  <h6 className="section-title">Important Warnings</h6>
                  <p className="section-content warning-text">{advice.warnings}</p>
                </div>
                <div className="medication-section">
                  <h6 className="section-title">Alternative Treatments</h6>
                  <ul className="alternatives-list">
                    {advice.alternatives.map((alt, idx) => (
                      <li key={idx}>{alt}</li>
                    ))}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <div className="text-center mt-4">
        <Button variant="outline-primary" onClick={onBack} className="back-button">
          <i className="fas fa-arrow-left mr-2"></i> Back to Results
        </Button>
      </div>
    </div>
  );
};

export default MedicationAdvice;
