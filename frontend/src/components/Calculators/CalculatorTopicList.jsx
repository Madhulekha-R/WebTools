import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { calculatorTopics } from "./CalculatorTopics";
import "./CalculatorDashboard.css";

// Map of topic id to custom grid class
const topicGridClass = {
  financial: "calculator-topic-grid-finance",
  fitness: "calculator-topic-grid-fitness",
  math: "calculator-topic-grid-math",
  other: "calculator-topic-grid-other",
  // add more as needed
};

export default function CalculatorTopicList() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const current = calculatorTopics.find(t => t.id === topic);
  if (!current) return <div>Topic not found.</div>;
  const gridClass = topicGridClass[topic] || "calculator-topic-grid-4"; // default to 4-column grid
  return (
    <div className="calculator-dashboard-root">
      <div className="calculator-dashboard-heading-wrapper">
        <h2 className="calculator-dashboard-heading">{current.title}</h2>
      </div>
      <div className={gridClass}>
        {current.calculators.map(calc => (
          <div
            className="calculator-dashboard-card"
            key={calc.id}
            tabIndex={0}
            onClick={() => navigate(`/calculators/${topic}/${calc.id}`)}
            role="button"
          >
            <div className="calculator-dashboard-card-content">
              <div className="calculator-dashboard-card-icon">{calc.icon}</div>
              <div className="calculator-dashboard-card-title">{calc.name}</div>
              <div className="calculator-dashboard-card-desc">{calc.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
