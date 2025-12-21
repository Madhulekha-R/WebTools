import React, { useState } from "react";
import "./ShotgunGaugeConverter.css";
export default function ShotgunGaugeConverter() {
  const [gauge, setGauge] = useState("");
  const [boreInches, setBoreInches] = useState("");
  const [boreMM, setBoreMM] = useState("");
  const [error, setError] = useState("");
  const calculateBore = (value) => {
    const g = Number(value);
    if (!value) {
      setBoreInches("");
      setBoreMM("");
      setError("");
      return;
    }
    if (isNaN(g) || g <= 0) {
      setError("Please enter a positive numeric value.");
      setBoreInches("");
      setBoreMM("");
      return;
    }
    if (g > 911) {
      setError("Maximum valid gauge is 911.");
      setBoreInches("");
      setBoreMM("");
      return;
    }
    setError("");
    const boreInch = 1.66992 * Math.pow(1 / g, 1 / 3);
    setBoreInches(boreInch.toFixed(3));
    setBoreMM((boreInch * 25.4).toFixed(2));
  };
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*$/.test(val)) {
      setGauge(val);
      calculateBore(val);
    }
  };
  const handleClear = () => {
    setGauge("");
    setBoreInches("");
    setBoreMM("");
    setError("");
  };
  return (
    <div className="sgc-container">
      <h1 className="sgc-title">Shotgun Gauge to Bore Diameter Converter</h1>
      <p>Enter a shotgun gauge number to see its bore diameter</p>
      <div className="sgc-input-container">
        <input
          type="text"
          placeholder="Enter gauge (e.g., 12)"
          value={gauge}
          onChange={handleChange}
          aria-label="Shotgun gauge number"/>
        <button onClick={handleClear} disabled={!gauge}>
          Clear
        </button>
      </div>
      {error && <div className="sgc-error">{error}</div>}
      {(boreInches && boreMM && !error) && (
        <div className="sgc-result">
          <p>Bore diameter: <strong>{boreInches} inches</strong> / <strong>{boreMM} mm</strong></p>
        </div>
      )}
    </div>
  );
}