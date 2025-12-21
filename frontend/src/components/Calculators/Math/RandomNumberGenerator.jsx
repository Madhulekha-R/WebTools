import React, { useState } from "react";
import "./RandomNumberGenerator.css";

export default function RandomNumberGenerator() {
  // Simple version state
  const [simpleLower, setSimpleLower] = useState("1");
  const [simpleUpper, setSimpleUpper] = useState("100");
  const [simpleResult, setSimpleResult] = useState("");

  // Comprehensive version state
  const [compLower, setCompLower] = useState("0.2");
  const [compUpper, setCompUpper] = useState("112.5");
  const [compCount, setCompCount] = useState("1");
  const [compType, setCompType] = useState("decimal");
  const [compPrecision, setCompPrecision] = useState("50");
  const [compResult, setCompResult] = useState("");

  const generateSimple = () => {
    const lower = parseInt(simpleLower);
    const upper = parseInt(simpleUpper);
    if (isNaN(lower) || isNaN(upper)) return;
    const random = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    setSimpleResult(random.toString());
  };

  const clearSimple = () => {
    setSimpleLower("1");
    setSimpleUpper("100");
    setSimpleResult("");
  };

  const generateComprehensive = () => {
    const lower = parseFloat(compLower);
    const upper = parseFloat(compUpper);
    const count = parseInt(compCount);
    const precision = parseInt(compPrecision);
    
    if (isNaN(lower) || isNaN(upper) || isNaN(count)) return;

    let results = [];
    for (let i = 0; i < count; i++) {
      let random;
      if (compType === "integer") {
        random = Math.floor(Math.random() * (upper - lower + 1)) + lower;
      } else {
        random = Math.random() * (upper - lower) + lower;
        random = parseFloat(random.toPrecision(Math.min(precision, 15)));
      }
      results.push(random);
    }
    setCompResult(results.join(", "));
  };

  const clearComprehensive = () => {
    setCompLower("0.2");
    setCompUpper("112.5");
    setCompCount("1");
    setCompType("decimal");
    setCompPrecision("50");
    setCompResult("");
  };

  return (
    <div className="age-calc-root percent-bg">
      <div className="age-calc-heading-wrapper">
        <h2 className="age-calc-heading">RANDOM NUMBER GENERATOR</h2>
      </div>

      {/* Simple Version */}
      <div className="age-calc-card percent-card rng-card">
        <h3 className="rng-section-subtitle">Random Number Generator</h3>
        <p className="rng-description-text">
          This version of the generator creates a random integer. It can deal with very large integers up to a few thousand digits.
        </p>
        <form className="percent-each-form" onSubmit={(e) => { e.preventDefault(); generateSimple(); }}>
          <div className="rng-input-group">
            <label className="rng-label">Lower Limit</label>
            <input 
              className="age-input percent-input rng-input" 
              type="number"
              value={simpleLower} 
              onChange={(e) => setSimpleLower(e.target.value)} 
            />
          </div>
          <div className="rng-input-group">
            <label className="rng-label">Upper Limit</label>
            <input 
              className="age-input percent-input rng-input" 
              type="number"
              value={simpleUpper} 
              onChange={(e) => setSimpleUpper(e.target.value)} 
            />
          </div>
          {simpleResult && (
            <div className="rng-result-display">
              <span className="result-label">Result:</span> {simpleResult}
            </div>
          )}
          <div className="percent-btn-row">
            <button className="age-calc-btn percent-main-btn" type="button" onClick={generateSimple}>
              Generate
            </button>
            <button className="age-calc-btn percent-clear-btn" type="button" onClick={clearSimple}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Comprehensive Version */}
      <h2 className="age-calc-heading percent-section-title">COMPREHENSIVE VERSION</h2>
      <div className="age-calc-card percent-card rng-card">
        <p className="rng-description-text">
          This version of the generator can create one or many random integers or decimals. It can deal with very large numbers with up to 999 digits of precision.
        </p>
        <form className="percent-each-form" onSubmit={(e) => { e.preventDefault(); generateComprehensive(); }}>
          <div className="rng-input-group">
            <label className="rng-label">Lower Limit</label>
            <input 
              className="age-input percent-input rng-input" 
              type="number"
              step="any"
              value={compLower} 
              onChange={(e) => setCompLower(e.target.value)} 
            />
          </div>
          <div className="rng-input-group">
            <label className="rng-label">Upper Limit</label>
            <input 
              className="age-input percent-input rng-input" 
              type="number"
              step="any"
              value={compUpper} 
              onChange={(e) => setCompUpper(e.target.value)} 
            />
          </div>
          <div className="rng-input-group rng-generate-group">
            <label className="rng-label">Generate</label>
            <input 
              className="age-input percent-input rng-input rng-small-input" 
              type="number"
              value={compCount} 
              onChange={(e) => setCompCount(e.target.value)} 
            />
            <span className="rng-label">numbers</span>
          </div>
          
          <div className="rng-radio-group">
            <label className="rng-label">Type of result to generate?</label>
            <div className="rng-radio-options">
              <label className="rng-radio-label">
                <input 
                  type="radio" 
                  name="type" 
                  value="integer"
                  checked={compType === "integer"}
                  onChange={(e) => setCompType(e.target.value)}
                />
                <span>Integer</span>
              </label>
              <label className="rng-radio-label">
                <input 
                  type="radio" 
                  name="type" 
                  value="decimal"
                  checked={compType === "decimal"}
                  onChange={(e) => setCompType(e.target.value)}
                />
                <span>Decimal</span>
              </label>
            </div>
          </div>

          {compType === "decimal" && (
            <div className="rng-input-group rng-precision-group">
              <label className="rng-label">Precision:</label>
              <input 
                className="age-input percent-input rng-input rng-small-input" 
                type="number"
                value={compPrecision} 
                onChange={(e) => setCompPrecision(e.target.value)} 
              />
              <span className="rng-label">digits</span>
            </div>
          )}

          {compResult && (
            <div className="rng-result-display">
              <span className="result-label">Result:</span> {compResult}
            </div>
          )}

          <div className="percent-btn-row">
            <button className="age-calc-btn percent-main-btn" type="button" onClick={generateComprehensive}>
              Generate
            </button>
            <button className="age-calc-btn percent-clear-btn" type="button" onClick={clearComprehensive}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
