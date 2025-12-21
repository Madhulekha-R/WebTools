import React, { useState } from "react";
import "./ApothecariesWeightConverter.css";
const UNITS = [
  { label: "Grains (gr)", value: "gr", maxLength: 10, rate: 1 },
  { label: "Scruples (s)", value: "s", maxLength: 5, rate: 20 },
  { label: "Drams (dr)", value: "dr", maxLength: 5, rate: 60 },
  { label: "Ounces (oz)", value: "oz", maxLength: 4, rate: 480 },
  { label: "Pounds (lb)", value: "lb", maxLength: 3, rate: 5760 },
];
export default function ApothecariesWeightConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("gr");
  const [outputUnit, setOutputUnit] = useState("lb");
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState("");
  const validateInput = (value, unit) => {
    const unitObj = UNITS.find((u) => u.value === unit);
    if (!unitObj) return false;
    const numericValue = value.replace(/[^0-9.]/g, "");
    if (numericValue.length > unitObj.maxLength) {
      setError(
        `Input exceeds maximum length of ${unitObj.maxLength} digits for ${unitObj.label}`
      );
      return false;
    }
    setError("");
    return true;
  };
  const convertWeight = (val, fromUnit, toUnit) => {
    if (!val || isNaN(val)) return "";
    const fromRate = UNITS.find((u) => u.value === fromUnit)?.rate ?? 1;
    const toRate = UNITS.find((u) => u.value === toUnit)?.rate ?? 1;
    const baseGrains = parseFloat(val) * fromRate;
    const result = baseGrains / toRate;
    return result.toFixed(6);
  };
  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (validateInput(val, inputUnit)) {
      setInputValue(val);
      const res = convertWeight(val, inputUnit, outputUnit);
      setOutputValue(res);
    } else {
      setInputValue(val);
      setOutputValue("");
    }
  };
  const handleInputUnitChange = (e) => {
    const selectedUnit = e.target.value;
    setInputUnit(selectedUnit);
    if (validateInput(inputValue, selectedUnit)) {
      const res = convertWeight(inputValue, selectedUnit, outputUnit);
      setOutputValue(res);
      setError("");
    } else {
      setOutputValue("");
    }
  };
  const handleOutputUnitChange = (e) => {
    const selectedUnit = e.target.value;
    setOutputUnit(selectedUnit);
    if (validateInput(inputValue, inputUnit)) {
      const res = convertWeight(inputValue, inputUnit, selectedUnit);
      setOutputValue(res);
    } else {
      setOutputValue("");
    }
  };
  const handleClear = () => {
    setInputValue("");
    setOutputValue("");
    setError("");
    setInputUnit("gr");
    setOutputUnit("lb");
  };
  const handleCopy = () => {
    if (outputValue) {
      navigator.clipboard.writeText(outputValue);
    }
  };
  return (
    <div className="awc-container">
      <h1 className="awc-title">Apothecaries Weight Converter</h1>
      <p className="awc-desc">
        Convert weights between grains, scruples, drams, ounces & pounds
      </p>
      <div className="awc-row">
        <input
          type="text"
          className="awc-input"
          placeholder="Enter value"
          value={inputValue}
          onChange={handleInputChange}/>
        <select
          className="awc-select"
          value={inputUnit}
          onChange={handleInputUnitChange}>
          {UNITS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="awc-row">
        <select
          className="awc-select"
          value={outputUnit}
          onChange={handleOutputUnitChange}>
          {UNITS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="awc-result">
          {outputValue && (
            <>
              <span>Result: </span>
              <strong>
                {outputValue} {UNITS.find((u) => u.value === outputUnit)?.label}
              </strong>
            </>
          )}
        </div>
      </div>
      {error && <div className="awc-error">{error}</div>}
      <button
        className="awc-button"
        disabled={!inputValue || !!error}
        onClick={() => {
          if (inputValue && !error) {
            const res = convertWeight(inputValue, inputUnit, outputUnit);
            setOutputValue(res);
          }
        }}>
        Convert
      </button>
      <br/>
      <button className="awc-button clear-button" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
}