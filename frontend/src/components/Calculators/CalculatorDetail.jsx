import React from "react";
import { useParams } from "react-router-dom";

export default function CalculatorDetail() {
  const { topic, calculatorId } = useParams();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#18191c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: "70px",
      color: "#fff"
    }}>
      <h2 style={{
        fontFamily: "'Montserrat','Poppins',Arial,sans-serif",
        fontSize: "2.2rem",
        fontWeight: "700",
        background: "linear-gradient(90deg, #00cfff 0%, #1976d2 35%, #21cbf3 100%)",
        backgroundClip: "text",
        color: "transparent",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "2px",
        marginBottom: "0.9rem"
      }}>
        {calculatorId.replace(/^\w/, c => c.toUpperCase()).replace(/-/g, " ")}
      </h2>
      <p style={{ color: "#8ba7ff", fontSize: "1.13rem" }}>
        [Put your calculator UI here for <b>{calculatorId}</b>]
      </p>
    </div>
  );
}
