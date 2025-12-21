import React, { useState } from "react";
import "./BMICalculator.css";

function getBmiCategory(bmi) {
  if (bmi < 16) return "Severe Thinness";
  if (bmi < 17) return "Moderate Thinness";
  if (bmi < 18.5) return "Mild Thinness";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese Class I";
  if (bmi < 40) return "Obese Class II";
  return "Obese Class III";
}

export default function BMICalculator() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(65);
  const [bmi, setBmi] = useState(null);

  function handleCalculate(e) {
    e.preventDefault();
    if (!height || !weight) return;
    const h = height / 100;
    const value = weight / (h * h);
    setBmi(value);
  }

  function handleClear() {
    setAge(25); setGender("male"); setHeight(""); setWeight(""); setBmi(null);
  }

  let category = bmi ? getBmiCategory(bmi) : "";
  let healthyMin = height ? (18.5 * ((height / 100) ** 2)).toFixed(1) : "";
  let healthyMax = height ? (25 * ((height / 100) ** 2)).toFixed(1) : "";

  return (
    <div className="age-calc-root">
      <div className="age-calc-heading-wrapper">
        <h2 className="age-calc-heading">BMI Calculator</h2>
        <div className="age-calc-subheading">
          The Body Mass Index (BMI) Calculator can be used to calculate your BMI and assess your weight category.
        </div>
      </div>
      <form className={`age-calc-card${bmi!==null ? " expanded" : ""}`} onSubmit={handleCalculate}>
        <div className="age-calc-card-content">
          <label className="age-label">Age</label>
          <input className="age-input" type="number" value={age} min={2} max={120} onChange={e=>setAge(e.target.value)} />
          <label className="age-label" style={{marginTop:12}}>Gender</label>
          <div style={{marginBottom:19}}>
            <label style={{color:"#b0b3b8",marginRight:14}}>
              <input type="radio" checked={gender==="male"} onChange={()=>setGender("male")} /> Male
            </label>
            <label style={{color:"#b0b3b8"}}>
              <input type="radio" checked={gender==="female"} onChange={()=>setGender("female")} /> Female
            </label>
          </div>
          <label className="age-label">Height</label>
          <input className="age-input" type="number" value={height} min={50} max={250} onChange={e=>setHeight(e.target.value)} placeholder="cm" />
          <label className="age-label">Weight</label>
          <input className="age-input" type="number" value={weight} min={10} max={250} onChange={e=>setWeight(e.target.value)} placeholder="kg" />
          <button type="submit" className="age-calc-btn" style={{marginTop:10}}>Calculate</button>
          <button type="button" className="age-calc-btn" style={{marginTop:10,background:"#6c757d",color:"#fff",marginLeft:"7px"}} onClick={handleClear}>Clear</button>
        </div>
        {bmi !== null && (
          <div className="age-result" style={{marginTop:22}}>
            <div>
              <span className="result-label">BMI:</span> {bmi.toFixed(1)} kg/m²
            </div>
            <div>
              <span className="result-label">Category:</span> {category}
            </div>
            <div>
              <span className="result-label">Healthy BMI range:</span> 18.5 – 25 kg/m²
            </div>
            <div>
              <span className="result-label">Healthy weight for this height:</span> {healthyMin} kg – {healthyMax} kg
            </div>
          </div>
        )}
      </form>
      <div className="age-content" style={{marginTop:"2.3rem"}}>
        The Body Mass Index (BMI) Calculator can be used to calculate BMI value and corresponding weight status while taking age into consideration. Use the "Metric Units" tab for the International System of Units or the "Other Units" tab to convert units into either US or metric units. Note that the calculator also computes the Ponderal Index in addition to BMI, both of which are discussed below in detail.
      </div>
    </div>
  );
}
