import React, { useState } from 'react';
import './App.css';

function App() {
  const [features, setFeatures] = useState({
    f0: '', f1: '', f2: '', f3: '', f4: '',
    f5: '', f6: '', f7: '', f8: '', f9: ''
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFeatures({ ...features, [id]: value });
  };

  const predictRain = async () => {
    const endpoint = "https://dqchn0x4k2.execute-api.us-east-1.amazonaws.com/prod/predict";
    const featureValues = Object.values(features).map(val => parseFloat(val));

    if (featureValues.some(isNaN)) {
      alert("Please enter all 10 features.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featureValues })
      });

      const data = await response.json();
      if ('prediction' in data) {
        const msg = data.prediction === 1 ? "🌧️ Rain Expected" : "☀️ No Rain Expected";
        setResult(`${msg} (Confidence: ${data.probability.toFixed(2)})`);
      } else {
        setResult("Prediction error: " + JSON.stringify(data));
      }
    } catch (err) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const placeholders = [
    "Pressure", "Max Temp", "Temperature", "Min Temp", "Dew Point",
    "Humidity", "Cloud (1=yes, 0=no)", "Sunshine", "Wind Direction", "Wind Speed"
  ];

  return (
    <div className="App">
      <div className="container">
        <h2 className="title">Rainfall Prediction</h2>
        <p className="description">Enter the feature values to predict rainfall:</p>

        <div className="input-form">
          {placeholders.map((ph, i) => (
            <input
              key={`f${i}`}
              type="number"
              step="any"
              placeholder={ph}
              id={`f${i}`}
              value={features[`f${i}`]}
              onChange={handleInputChange}
              className="input-field"
            />
          ))}
        </div>

        <div className="button-wrapper">
          <button onClick={predictRain} className="predict-btn" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>

        {result && <h3 className="result">{result}</h3>}
      </div>
    </div>
  );
}

export default App;
