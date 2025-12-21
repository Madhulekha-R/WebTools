import React, { useState } from "react";
import converters from "./convertersList";
import ToolCard from "./ToolCard";
import "./ConvertersPage.css";
const categories = [
  { key: "converters", label: "CONVERTERS" },
  { key: "counters", label: "COUNTERS" },
  { key: "specials", label: "SPECIAL TOOLS" },
];
function ConvertersPage() {
  const categorized = categories.map((cat) => ({
    ...cat,
    tools: converters.filter((tool) => tool.category === cat.key)
  }));
  const [input, setInput] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [output, setOutput] = useState("");
  const conversions = {
    meter: { kilometer: (v) => v / 1000, mile: (v) => v / 1609.34, meter: (v) => v },
    kilometer: { meter: (v) => v * 1000, mile: (v) => v / 1.60934, kilometer: (v) => v },
    mile: { meter: (v) => v * 1609.34, kilometer: (v) => v * 1.60934, mile: (v) => v },
  };
  const handleConvert = () => {
    const val = parseFloat(input);
    const from = fromUnit.trim().toLowerCase();
    const to = toUnit.trim().toLowerCase();
    if (isNaN(val)) {
      setOutput("Invalid input");
      return;
    }
    if (!conversions[from] || !conversions[from][to]) {
      setOutput("Unsupported conversion");
      return;
    }
    setOutput(conversions[from][to](val));
  };
  const handleReset = () => {
    setInput("");
    setFromUnit("");
    setToUnit("");
    setOutput("");
  };
  return (
    <div className="converter-page-bg">
      <div className="converter-widget-area">
        <div className="converter-main-widget">
          <div className="converter-header">Unit Converter</div>
          <div className="converter-desc">Convert from anything to anything.</div>
          <div className="converter-interactive-box">
            <div className="converter-row">
              <label className="converter-label">Convert From:</label>
              <input
                type="text"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                placeholder="Enter unit (e.g. meter)"
                className="converter-input"
                autoComplete="off"/>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter value"
                className="converter-input"
                autoComplete="off"/>
            </div>
            <div className="converter-arrow">&#8596;</div>
            <div className="converter-row">
              <label className="converter-label">Convert To:</label>
              <input
                type="text"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                placeholder="Enter unit (e.g. kilometer)"
                className="converter-input"
                autoComplete="off"/>
              <input
                type="text"
                value={output}
                disabled
                placeholder="Output"
                className="converter-input"
                autoComplete="off"/>
            </div>
            <div className="button-row">
              <button className="converter-go-btn" onClick={handleConvert}>Go</button>
              <button className="converter-reset-btn" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      </div>
      <div className="popular-title">Popular Converter Tools</div>
      <div className="tool-categories-dashboard">
        {categorized.map(({ key, label, tools }) => (
          <section key={key} className="tool-category-section">
            <h2 className="category-header">{label}</h2>
            <div className="subcategory-card-container">
              <div className="tool-cards-grid">
                {tools.map(({ name, path, icon }) => (
                  <ToolCard key={name} name={name} path={path} icon={icon} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
export default ConvertersPage;