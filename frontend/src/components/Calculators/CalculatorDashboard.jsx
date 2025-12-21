import React from "react";
import { calculatorTopics } from "./CalculatorTopics";
import { useNavigate } from "react-router-dom";
import "./CalculatorDashboard.css";

export default function CalculatorDashboard() {
  const navigate = useNavigate();
  return (
    <div className="calculator-dashboard-root">
      <div className="calculator-dashboard-heading-wrapper">
        <h2 className="calculator-dashboard-heading">Calculators</h2>
        <div className="calculator-dashboard-subheading">
          Choose the type of calculator you need from the options below
        </div>
      </div>
      <div className="calculator-dashboard-grid">
        {calculatorTopics.map(topic => (
          <div
            className="calculator-dashboard-card"
            key={topic.id}
            tabIndex={0}
            onClick={() => navigate(`/calculators/${topic.id}`)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") navigate(`/calculators/${topic.id}`);
            }}
            role="button"
          >
            <div className="calculator-dashboard-card-icon">{topic.icon}</div>
            <div className="calculator-dashboard-card-title">{topic.title}</div>
            <div className="calculator-dashboard-card-desc">{topic.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
