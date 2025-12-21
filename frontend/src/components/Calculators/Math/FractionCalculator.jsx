import React, { useState } from "react";
import "./FractionCalculator.css";

function isnum(str) {
  return str !== "" && !isNaN(str);
}

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplify(n, d) {
  if (d === 0) return [n, d];
  const g = gcd(n, d);
  let sn = n / g;
  let sd = d / g;
  // Keep denominator positive
  if (sd < 0) {
    sn = -sn;
    sd = -sd;
  }
  return [sn, sd];
}

// Parse mixed number string to improper fraction (n, d)
function parseMixed(str) {
  str = str.trim();
  if (!str) return [0, 1];

  let sign = 1;
  if (str[0] === "-") {
    sign = -1;
    str = str.substring(1).trim();
  }

  // Check if it contains a space (mixed number)
  if (str.includes(" ")) {
    const [intPart, fracPart] = str.split(" ");
    const int = parseInt(intPart) || 0;
    if (fracPart && fracPart.includes("/")) {
      const [n, d] = fracPart.split("/").map(Number);
      const num = int * d + n;
      return [sign * num, d];
    }
    return [sign * int, 1];
  }

  // Check if it's a fraction
  if (str.includes("/")) {
    const [n, d] = str.split("/").map(Number);
    return [sign * n, d];
  }

  // It's just an integer
  const int = parseInt(str) || 0;
  return [sign * int, 1];
}

// Convert improper fraction to mixed number string
function toMixedString(n, d) {
  if (d === 0) return "?";
  const [sn, sd] = simplify(n, d);

  const sign = sn < 0 ? "-" : "";
  const absN = Math.abs(sn);
  const int = Math.floor(absN / sd);
  const rem = absN % sd;

  if (rem === 0) return sign + int;
  if (int === 0) return sign + rem + "/" + sd;
  return sign + int + " " + rem + "/" + sd;
}

// Convert decimal to fraction
function decimalToFraction(decimal) {
  const num = parseFloat(decimal);
  if (isNaN(num)) return [0, 1];

  const sign = num < 0 ? -1 : 1;
  const absNum = Math.abs(num);

  // Handle whole numbers
  if (absNum === Math.floor(absNum)) {
    return [sign * absNum, 1];
  }

  // Convert to fraction
  const str = absNum.toString();
  const decimalPlaces = str.split(".")[1]?.length || 0;
  const denominator = Math.pow(10, decimalPlaces);
  const numerator = Math.round(absNum * denominator);

  return simplify(sign * numerator, denominator);
}

export default function FractionCalculator() {
  // Basic Fraction Calculator
  const [num1, setNum1] = useState("");
  const [den1, setDen1] = useState("");
  const [num2, setNum2] = useState("");
  const [den2, setDen2] = useState("");
  const [op, setOp] = useState("+");
  const [resNum, setResNum] = useState("");
  const [resDen, setResDen] = useState("");

  // Mixed Numbers Calculator
  const [mn1, setMn1] = useState("");
  const [op2, setOp2] = useState("+");
  const [mn2, setMn2] = useState("");
  const [mixedResult, setMixedResult] = useState("");

  // Simplify Fractions Calculator
  const [simpNum, setSimpNum] = useState("");
  const [simpDen, setSimpDen] = useState("");
  const [simpResNum, setSimpResNum] = useState("");
  const [simpResDen, setSimpResDen] = useState("");

  // Decimal to Fraction Calculator
  const [decimal, setDecimal] = useState("");
  const [d2fResNum, setD2fResNum] = useState("");
  const [d2fResDen, setD2fResDen] = useState("");

  // Fraction to Decimal Calculator
  const [f2dNum, setF2dNum] = useState("");
  const [f2dDen, setF2dDen] = useState("");
  const [f2dResult, setF2dResult] = useState("");

  // Big Number Fraction Calculator
  const [bigNum1, setBigNum1] = useState("");
  const [bigDen1, setBigDen1] = useState("");
  const [bigOp, setBigOp] = useState("+");
  const [bigNum2, setBigNum2] = useState("");
  const [bigDen2, setBigDen2] = useState("");
  const [bigResNum, setBigResNum] = useState("");
  const [bigResDen, setBigResDen] = useState("");

  // Basic Fraction Calculator Functions
  function calcFraction() {
    const n1 = parseInt(num1);
    const d1 = parseInt(den1);
    const n2 = parseInt(num2);
    const d2 = parseInt(den2);

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) return;
    if (d1 === 0 || d2 === 0) return;

    let rn, rd;
    if (op === "+") {
      rn = n1 * d2 + n2 * d1;
      rd = d1 * d2;
    } else if (op === "-") {
      rn = n1 * d2 - n2 * d1;
      rd = d1 * d2;
    } else if (op === "*") {
      rn = n1 * n2;
      rd = d1 * d2;
    } else if (op === "/") {
      rn = n1 * d2;
      rd = d1 * n2;
    }

    const [sn, sd] = simplify(rn, rd);
    setResNum(sn);
    setResDen(sd);
  }

  function clearFraction() {
    setNum1("");
    setDen1("");
    setNum2("");
    setDen2("");
    setOp("+");
    setResNum("");
    setResDen("");
  }

  // Mixed Numbers Calculator Functions
  function calcMixed() {
    if (!mn1.trim() || !mn2.trim()) return;

    const [n1, d1] = parseMixed(mn1);
    const [n2, d2] = parseMixed(mn2);

    let rn, rd;
    if (op2 === "+") {
      rn = n1 * d2 + n2 * d1;
      rd = d1 * d2;
    } else if (op2 === "-") {
      rn = n1 * d2 - n2 * d1;
      rd = d1 * d2;
    } else if (op2 === "*") {
      rn = n1 * n2;
      rd = d1 * d2;
    } else if (op2 === "/") {
      rn = n1 * d2;
      rd = d1 * n2;
    }

    setMixedResult(toMixedString(rn, rd));
  }

  function clearMixed() {
    setMn1("");
    setMn2("");
    setOp2("+");
    setMixedResult("");
  }

  // Simplify Fractions Calculator Functions
  function calcSimplify() {
    const n = parseInt(simpNum);
    const d = parseInt(simpDen);

    if (isNaN(n) || isNaN(d) || d === 0) return;

    const [sn, sd] = simplify(n, d);
    setSimpResNum(sn);
    setSimpResDen(sd);
  }

  function clearSimplify() {
    setSimpNum("");
    setSimpDen("");
    setSimpResNum("");
    setSimpResDen("");
  }

  // Decimal to Fraction Calculator Functions
  function calcDecimalToFraction() {
    if (!isnum(decimal)) return;

    const [n, d] = decimalToFraction(decimal);
    setD2fResNum(n);
    setD2fResDen(d);
  }

  function clearDecimalToFraction() {
    setDecimal("");
    setD2fResNum("");
    setD2fResDen("");
  }

  // Fraction to Decimal Calculator Functions
  function calcFractionToDecimal() {
    const n = parseInt(f2dNum);
    const d = parseInt(f2dDen);

    if (isNaN(n) || isNaN(d) || d === 0) return;

    const result = (n / d).toFixed(10).replace(/\.?0+$/, "");
    setF2dResult(result);
  }

  function clearFractionToDecimal() {
    setF2dNum("");
    setF2dDen("");
    setF2dResult("");
  }

  // Big Number Fraction Calculator Functions
  function calcBigFraction() {
    const n1 = BigInt(bigNum1 || "0");
    const d1 = BigInt(bigDen1 || "1");
    const n2 = BigInt(bigNum2 || "0");
    const d2 = BigInt(bigDen2 || "1");

    if (d1 === 0n || d2 === 0n) return;

    let rn, rd;
    if (bigOp === "+") {
      rn = n1 * d2 + n2 * d1;
      rd = d1 * d2;
    } else if (bigOp === "-") {
      rn = n1 * d2 - n2 * d1;
      rd = d1 * d2;
    } else if (bigOp === "*") {
      rn = n1 * n2;
      rd = d1 * d2;
    } else if (bigOp === "/") {
      rn = n1 * d2;
      rd = d1 * n2;
    }

    // Simplify using BigInt GCD
    function gcdBig(a, b) {
      a = a < 0n ? -a : a;
      b = b < 0n ? -b : b;
      while (b !== 0n) {
        const t = b;
        b = a % b;
        a = t;
      }
      return a;
    }

    const g = gcdBig(rn, rd);
    let sn = rn / g;
    let sd = rd / g;

    if (sd < 0n) {
      sn = -sn;
      sd = -sd;
    }

    setBigResNum(sn.toString());
    setBigResDen(sd.toString());
  }

  function clearBigFraction() {
    setBigNum1("");
    setBigDen1("");
    setBigNum2("");
    setBigDen2("");
    setBigOp("+");
    setBigResNum("");
    setBigResDen("");
  }

  return (
    <div className="age-calc-root percent-bg">
      <div className="age-calc-heading-wrapper">
        <h2 className="age-calc-heading">FRACTION CALCULATOR</h2>
      </div>

      {/* Basic Fraction Calculator */}
      <div className="fraction-intro">
        Below are multiple fraction calculators capable of addition, subtraction, multiplication, division,
        simplification, and conversion between fractions and decimals. Fields above the solid black line
        represent the numerator, while fields below represent the denominator.
      </div>

      <div className="age-calc-card percent-card">
        <div className="frac-input-grp">
          <div className="frac-hor">
            <input className="frac-num" value={num1} onChange={e => setNum1(e.target.value)} />
            <select className="frac-op" value={op} onChange={e => setOp(e.target.value)}>
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
            <input className="frac-num" value={num2} onChange={e => setNum2(e.target.value)} />
            <span className="frac-eq">=</span>
            <input className="frac-num frac-res" readOnly value={resNum} />
          </div>
          <div className="frac-hor frac-under">
            <input className="frac-den" value={den1} onChange={e => setDen1(e.target.value)} />
            <span style={{ width: 46 }}></span>
            <input className="frac-den" value={den2} onChange={e => setDen2(e.target.value)} />
            <span className="frac-eq"></span>
            <input className="frac-den frac-res" readOnly value={resDen} />
          </div>
        </div>
        <div className="percent-btn-row">
          <button className="age-calc-btn percent-main-btn" onClick={calcFraction}>Calculate</button>
          <button className="age-calc-btn percent-clear-btn" onClick={clearFraction}>Clear</button>
        </div>
      </div>

      {/* Mixed Numbers Calculator */}
      <h2 className="age-calc-heading percent-section-title">MIXED NUMBERS CALCULATOR</h2>
      <div className="age-calc-card percent-card">
        <div className="mixed-input-row">
          <input className="age-input percent-input mixed-inp" value={mn1} onChange={e => setMn1(e.target.value)} placeholder="-2 3/4" />
          <select className="frac-op" value={op2} onChange={e => setOp2(e.target.value)}>
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>
          <input className="age-input percent-input mixed-inp" value={mn2} onChange={e => setMn2(e.target.value)} placeholder="3 5/7" />
          <span className="percent-eq-lbl">=</span>
          <input className="age-input percent-input mixed-inp mixed-res" readOnly value={mixedResult} />
        </div>
        <div className="percent-btn-row">
          <button className="age-calc-btn percent-main-btn" onClick={calcMixed}>Calculate</button>
          <button className="age-calc-btn percent-clear-btn" onClick={clearMixed}>Clear</button>
        </div>
      </div>

      {/* Simplify Fractions Calculator */}
      <h2 className="age-calc-heading percent-section-title">SIMPLIFY FRACTIONS CALCULATOR</h2>
      <div className="age-calc-card percent-card">
        <div className="simplify-grp">
          <div className="frac-hor">
            <input className="frac-num" value={simpNum} onChange={e => setSimpNum(e.target.value)} placeholder="21" />
            <span className="frac-eq" style={{ marginLeft: 20, marginRight: 20 }}>=</span>
            <input className="frac-num frac-res" readOnly value={simpResNum} />
          </div>
          <div className="frac-hor frac-under">
            <input className="frac-den" value={simpDen} onChange={e => setSimpDen(e.target.value)} placeholder="98" />
            <span className="frac-eq" style={{ width: 60 }}></span>
            <input className="frac-den frac-res" readOnly value={simpResDen} />
          </div>
        </div>
        <div className="percent-btn-row">
          <button className="age-calc-btn percent-main-btn" onClick={calcSimplify}>Calculate</button>
          <button className="age-calc-btn percent-clear-btn" onClick={clearSimplify}>Clear</button>
        </div>
      </div>

      {/* Decimal to Fraction Calculator */}
      <h2 className="age-calc-heading percent-section-title">DECIMAL TO FRACTION CALCULATOR</h2>
      <div className="age-calc-card percent-card">
        <div className="decimal-conv-row">
          <input className="age-input percent-input" style={{ width: 150 }} value={decimal} onChange={e => setDecimal(e.target.value)} placeholder="1.375" />
          <span className="percent-eq-lbl">=</span>
          <div className="frac-display">
            <div className="frac-display-num">{d2fResNum || "?"}</div>
            <div className="frac-display-line"></div>
            <div className="frac-display-den">{d2fResDen || "?"}</div>
          </div>
        </div>
        <div className="percent-btn-row">
          <button className="age-calc-btn percent-main-btn" onClick={calcDecimalToFraction}>Calculate</button>
          <button className="age-calc-btn percent-clear-btn" onClick={clearDecimalToFraction}>Clear</button>
        </div>
      </div>

      {/* Fraction to Decimal Calculator */}
      <h2 className="age-calc-heading percent-section-title">FRACTION TO DECIMAL CALCULATOR</h2>
      <div className="age-calc-card percent-card">
        <div className="decimal-conv-row">
          <div className="frac-display">
            <input className="frac-num" style={{ width: 80 }} value={f2dNum} onChange={e => setF2dNum(e.target.value)} placeholder="2" />
            <div className="frac-display-line"></div>
            <input className="frac-den" style={{ width: 80 }} value={f2dDen} onChange={e => setF2dDen(e.target.value)} placeholder="7" />
          </div>
          <span className="percent-eq-lbl">=</span>
          <input className="age-input percent-input" style={{ width: 150 }} readOnly value={f2dResult} />
        </div>
        <div className="percent-btn-row">
          <button className="age-calc-btn percent-main-btn" onClick={calcFractionToDecimal}>Calculate</button>
          <button className="age-calc-btn percent-clear-btn" onClick={clearFractionToDecimal}>Clear</button>
        </div>
      </div>

      {/* Big Number Fraction Calculator */}
      <h2 className="age-calc-heading percent-section-title">BIG NUMBER FRACTION CALCULATOR</h2>
      <div className="big-number-desc">
        Use this calculator if the numerators or denominators are very big integers.
      </div>
      <div className="age-calc-card percent-card">
        <div className="big-frac-grp">
          <div className="frac-hor">
            <input className="big-frac-input" value={bigNum1} onChange={e => setBigNum1(e.target.value)} placeholder="1234" />
            <select className="frac-op" value={bigOp} onChange={e => setBigOp(e.target.value)}>
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
            <input className="big-frac-input" value={bigNum2} onChange={e => setBigNum2(e.target.value)} placeholder="334344211322322343333" />
            <span className="frac-eq">=</span>
            <input className="big-frac-input frac-res" readOnly value={bigResNum} />
          </div>
          <div className="frac-hor frac-under">
            <input className="big-frac-input" value={bigDen1} onChange={e => setBigDen1(e.target.value)} placeholder="748892928829" />
            <span style={{ width: 46 }}></span>
            <input className="big-frac-input" value={bigDen2} onChange={e => setBigDen2(e.target.value)} placeholder="887727738828828288288" />
            <span className="frac-eq"></span>
            <input className="big-frac-input frac-res" readOnly value={bigResDen} />
          </div>
        </div>
        <div className="percent-btn-row">
          <button className="age-calc-btn percent-main-btn" onClick={calcBigFraction}>Calculate</button>
          <button className="age-calc-btn percent-clear-btn" onClick={clearBigFraction}>Clear</button>
        </div>
      </div>

      {/* Educational Content */}
      <div className="age-content percent-description" style={{ maxWidth: 900, marginBottom: '40px' }}>
        <h2>What is a fraction?</h2>
        <p>
          In mathematics, a fraction is a number that represents a part of a whole. It consists of a numerator and a denominator.
          The numerator represents the number of equal parts of a whole, while the denominator is the total number of parts that
          make up said whole. For example, in the fraction <sup>3</sup>/<sub>8</sub>, the numerator is 3, and the denominator is 8.
          A more illustrative example could involve a pie with 8 slices. 1 of those 8 slices would constitute the numerator of a
          fraction, while the total of 8 slices that comprises the whole pie would be the denominator. If a person were to eat 3 slices,
          the remaining fraction of the pie would therefore be <sup>5</sup>/<sub>8</sub> as shown in the image to the right. Note that
          the denominator of a fraction cannot be 0, as it would make the fraction undefined. Fractions can undergo many different
          operations, some of which are mentioned below.
        </p>

        <h2>Addition and Subtraction</h2>
        <p>
          Unlike adding and subtracting integers such as 2 and 8, fractions require a common denominator to undergo these operations.
          One method for finding a common denominator involves multiplying the numerators and denominators of all of the fractions
          involved by the product of the denominators of each fraction.
        </p>
        <div style={{ margin: "10px 0", fontFamily: 'monospace', fontSize: "1.15rem" }}>
          <sup>a</sup>/<sub>b</sub> + <sup>c</sup>/<sub>d</sub> = <sup>ad + bc</sup>/<sub>bd</sub>
        </div>

        <h2>Multiplication</h2>
        <p>
          Multiplying fractions is fairly straightforward. Unlike adding and subtracting, it is not necessary to compute a common
          denominator in order to multiply fractions. Simply, the numerators and denominators of each fraction are multiplied, and
          the result forms a new numerator and denominator.
        </p>
        <div style={{ margin: "10px 0", fontFamily: 'monospace', fontSize: "1.15rem" }}>
          <sup>a</sup>/<sub>b</sub> × <sup>c</sup>/<sub>d</sub> = <sup>ac</sup>/<sub>bd</sub>
        </div>

        <h2>Division</h2>
        <p>
          The process for dividing fractions is similar to that for multiplying fractions. In order to divide fractions, the fraction
          in the numerator is multiplied by the reciprocal of the fraction in the denominator.
        </p>
        <div style={{ margin: "10px 0", fontFamily: 'monospace', fontSize: "1.15rem" }}>
          <sup>a</sup>/<sub>b</sub> ÷ <sup>c</sup>/<sub>d</sub> = <sup>a</sup>/<sub>b</sub> × <sup>d</sup>/<sub>c</sub> = <sup>ad</sup>/<sub>bc</sub>
        </div>

        <h2>Simplification</h2>
        <p>
          It is often easier to work with simplified fractions. As such, fraction solutions are commonly expressed in their simplified
          forms. For example, <sup>3</sup>/<sub>6</sub> can be simplified to <sup>1</sup>/<sub>2</sub>. To simplify a fraction,
          divide both the numerator and denominator by their greatest common divisor (GCD).
        </p>
      </div>
    </div>
  );
}
