import React, { useState } from "react";
import "./App.css";
import HomePage from "./components/HomePage";
import Results from "./components/Results";

function App() {
  const [showResults, setShowResults] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [triage, setTriage] = useState(null);

  const handleShowResults = (diseaseList) => {
    // Transform disease list to the format expected by Results component
    const formattedConditions = diseaseList.map(disease => ({
      name: disease.name,
      probability: parseFloat(disease.possibility) / 100
    }));
    
    setConditions(formattedConditions);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
  };

  return (
    <div>
      {showResults ? (
        <Results 
          conditions={conditions}
          triage={triage}
          onRestart={handleRestart}
        />
      ) : (
        <HomePage onShowResults={handleShowResults} />
      )}
    </div>
  );
}

export default App;
