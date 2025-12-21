import React, { useState } from "react";
import "./PercentageCalculator.css";

function isnum(str) {
  return str !== "" && !isNaN(str);
}

export default function PercentageCalculator() {
  // Main calculate
  const [main, setMain] = useState({ p: "", base: "", res: "" });
  // Common: what is X% of Y
  const [cx, setCx] = useState(""); const [cy, setCy] = useState(""); const [cres, setCres] = useState("");
  // Common: X is what % of Y
  const [ix, setIx] = useState(""); const [iy, setIy] = useState(""); const [ires, setIres] = useState("");
  // Common: X is Y% of what
  const [wx, setWx] = useState(""); const [wy, setWy] = useState(""); const [wres, setWres] = useState("");
  // % Difference
  const [d1, setD1] = useState(""); const [d2, setD2] = useState(""); const [dres, setDres] = useState("");

  const handleMainCalc = () => {
    let { p, base, res } = main;
    let n = [p, base, res].filter(isnum).length;
    if (n !== 2) return;
    let answer = "";
    if (p === "") answer = base === "" ? "" : (res / base * 100).toFixed(6).replace(/\.0+$/, "");
    else if (base === "") answer = p === "" ? "" : (res / (p / 100)).toFixed(6).replace(/\.0+$/, "");
    else answer = (p / 100 * base).toFixed(6).replace(/\.0+$/, "");
    setMain({ ...main, res: answer });
  };
  const handleMainClear = () => setMain({ p: "", base: "", res: "" });

  // Common phrases
  const calcCommon1 = () => setCres(isnum(cx) && isnum(cy) ? (cx / 100 * cy).toFixed(6).replace(/\.0+$/, "") : "");
  const calcCommon2 = () => setIres(isnum(ix) && isnum(iy) ? (ix / iy * 100).toFixed(6).replace(/\.0+$/, "") : "");
  const calcCommon3 = () => setWres(isnum(wx) && isnum(wy) ? (wx / (wy / 100)).toFixed(6).replace(/\.0+$/, "") : "");
  const clearCommon1 = () => { setCx(""); setCy(""); setCres(""); };
  const clearCommon2 = () => { setIx(""); setIy(""); setIres(""); };
  const clearCommon3 = () => { setWx(""); setWy(""); setWres(""); };

  // % Difference logic
  const calcDiff = () => {
    if (isnum(d1) && isnum(d2)) {
      let diff = Math.abs(d1 - d2) / ((+d1 + +d2) / 2) * 100;
      setDres(diff.toFixed(6).replace(/\.0+$/, ""));
    }
  };
  const clearDiff = () => { setD1(""); setD2(""); setDres(""); };

  return (
    <div className="age-calc-root percent-bg">
      <div className="age-calc-heading-wrapper">
        <h2 className="age-calc-heading">PERCENTAGE CALCULATOR</h2>
      </div>

      <div className="age-calc-card percent-card">
        <form className="percent-main-form" onSubmit={e=>{e.preventDefault();handleMainCalc();}}>
          <div className="percent-main-row">
            <input className="age-input percent-input" style={{width:250}} value={main.p} onChange={e=>setMain({...main, p:e.target.value})} />
            <span className="percent-of-lbl">% of</span>
            <input className="age-input percent-input" style={{width:250}} value={main.base} onChange={e=>setMain({...main, base:e.target.value})} />
            <span className="percent-eq-lbl">=</span>
            <input className="age-input percent-input" style={{width:1500}} value={main.res} onChange={e=>setMain({...main, res:e.target.value})} />
          </div>
          <div className="percent-btn-row">
            <button className="age-calc-btn percent-main-btn" onClick={handleMainCalc} type="button">Calculate</button>
            <button className="age-calc-btn percent-clear-btn" onClick={handleMainClear} type="button">Clear</button>
          </div>
        </form>
      </div>

      <h2 className="age-calc-heading percent-section-title">PERCENTAGE CALCULATOR IN COMMON PHRASES</h2>
      <div className="age-calc-card percent-card">
        <form className="percent-each-form" onSubmit={e=>{e.preventDefault();calcCommon1();}}>
          <div className="percent-common-row">
            <span className="percent-label-phrase">What is</span>
            <input className="age-input percent-input" value={cx} onChange={e=>setCx(e.target.value)} />
            <span className="percent-label-phrase">% of</span>
            <input className="age-input percent-input" value={cy} onChange={e=>setCy(e.target.value)} />
            <span className="percent-label-phrase">=</span>
            <input className="age-input percent-input" readOnly value={cres}/>
          </div>
          <div className="percent-btn-row">
            <button className="age-calc-btn percent-main-btn" type="button" onClick={calcCommon1}>Calculate</button>
            <button className="age-calc-btn percent-clear-btn" type="button" onClick={clearCommon1}>Clear</button>
          </div>
        </form>
        <form className="percent-each-form" onSubmit={e=>{e.preventDefault();calcCommon2();}}>
          <div className="percent-common-row">
            <input className="age-input percent-input" value={ix} onChange={e=>setIx(e.target.value)} />
            <span className="percent-label-phrase">is what % of</span>
            <input className="age-input percent-input" value={iy} onChange={e=>setIy(e.target.value)} />
            <span className="percent-label-phrase">=</span>
            <input className="age-input percent-input" readOnly value={ires}/>
          </div>
          <div className="percent-btn-row">
            <button className="age-calc-btn percent-main-btn" type="button" onClick={calcCommon2}>Calculate</button>
            <button className="age-calc-btn percent-clear-btn" type="button" onClick={clearCommon2}>Clear</button>
          </div>
        </form>
        <form className="percent-each-form" onSubmit={e=>{e.preventDefault();calcCommon3();}}>
          <div className="percent-common-row">
            <input className="age-input percent-input" value={wx} onChange={e=>setWx(e.target.value)} />
            <span className="percent-label-phrase">is</span>
            <input className="age-input percent-input" value={wy} onChange={e=>setWy(e.target.value)} />
            <span className="percent-label-phrase">% of what =</span>
            <input className="age-input percent-input" readOnly value={wres}/>
          </div>
          <div className="percent-btn-row">
            <button className="age-calc-btn percent-main-btn" type="button" onClick={calcCommon3}>Calculate</button>
            <button className="age-calc-btn percent-clear-btn" type="button" onClick={clearCommon3}>Clear</button>
          </div>
        </form>
      </div>

      <h2 className="age-calc-heading percent-section-title">PERCENTAGE DIFFERENCE CALCULATOR</h2>
      <div className="age-calc-card percent-card">
        <form className="percent-each-form" onSubmit={e=>{e.preventDefault();calcDiff();}}>
          <div className="percent-common-row">
            <span className="percent-label-phrase">Value 1</span>
            <input className="age-input percent-input" value={d1} onChange={e=>setD1(e.target.value)} />
            <span className="percent-label-phrase">Value 2</span>
            <input className="age-input percent-input" value={d2} onChange={e=>setD2(e.target.value)} />
          </div>
          <div className="percent-btn-row">
            <button className="age-calc-btn percent-main-btn" type="button" onClick={calcDiff}>Calculate</button>
            <button className="age-calc-btn percent-clear-btn" type="button" onClick={clearDiff}>Clear</button>
          </div>
          {dres !== "" && (
            <div style={{marginTop:8}}>
              <span className="age-result"><span className="result-label">Result:</span> {dres}%</span>
            </div>
          )}
        </form>
      </div>

      {/* DESCRIPTION/THEORY BLOCK */}
      <div className="age-content percent-description" style={{maxWidth:900,marginBottom:'40px'}}>
        <h2>What is a percentage?</h2>
        <p>
          In mathematics, a percentage is a number or ratio that represents a fraction of 100. It is one of the ways to represent a dimensionless relationship between two numbers; other methods include ratios, fractions, and decimals.
          Percentages are often denoted by the symbol "%" written after the number. They can also be denoted by writing "percent" or "pct" after the number. For example, 35% is equivalent to decimal 0.35, or the fractions 35/100 and 7/20.
        </p>
        <p>
          Percentages are computed by multiplying the value of a ratio by 100. For example, if 25 out of 50 students in a classroom are male, <br/>
          25/50 = 1/2 = 0.5. The value of the ratio is therefore 0.5, and multiplying by 100 yields:<br/>
          0.5 × 100 = 50<br/>
          In other words, the ratio of 25 males to students in the classroom is equivalent to 50% of students being male.
        </p>
        <h2>Percentage formula</h2>
        <p>
          Although the percentage formula can be written in different forms, it is essentially an algebraic equation involving three values.
        </p>
        <div style={{margin:"10px 0", fontFamily:'monospace',fontSize:"1.18rem"}}>
          P × V<sub>1</sub> = V<sub>2</sub>
        </div>
        <p>
          <b>P</b> is the percentage, <b>V<sub>1</sub></b> is the first value that the percentage will modify, and <b>V<sub>2</sub></b> is the result of the percentage operating on <b>V<sub>1</sub></b>.
        </p>
        <div style={{margin:"4px 0", fontFamily:'monospace',fontSize:"1.13rem"}}>
          P = V<sub>2</sub> / V<sub>1</sub> × 100
        </div>
        <p>
          For example, if P × 30 = 1.5, then P = 1.5 / 30 = 0.05 × 100 = 5%
        </p>
        <p>
          If solving manually, convert the percentage to decimal form to use in the formula. If solving for the percentage, multiply the solution by 100 to convert to percent. 
        </p>
        <h2>Percentage difference formula</h2>
        <div style={{margin:"10px 0", fontFamily:'monospace',fontSize:"1.15rem"}}>
          Percentage Difference = |V₁ – V₂| / [(V₁ + V₂) / 2] × 100
        </div>
        <div>
          EX: |10 - 6| / (10 + 6)/2 × 100 = 50%
        </div>
        <h2>Percentage change formula</h2>
        <p>
          Percentage increase and decrease are calculated by comparing the difference between two values and comparing to the initial value. The formula is:<br/>
        </p>
        <div style={{margin:"7px 0", fontFamily:'monospace',fontSize:"1.15rem"}}>
          Change = (New Value - Old Value) / Old Value × 100
        </div>
        <p>
          Example: 500 increased by 10%: 500 × (1 + 0.1) = 550<br/>
          Example: 500 decreased by 10%: 500 × (1 – 0.1) = 450
        </p>
      </div>
    </div>
  );
}
