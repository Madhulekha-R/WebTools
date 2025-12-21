import React from "react";
import { useNavigate } from "react-router-dom";
import "./ToolCard.css";
const ToolCard = ({ name, path, icon: Icon }) => {
  const navigate = useNavigate();
  return (
    <div
      className="tool-card"
      onClick={() => navigate(path)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && navigate(path)}>
      <span className="tool-card-icon"><Icon size={24} /></span>
      <span className="tool-card-name">{name}</span>
    </div>
  );
};
export default ToolCard;