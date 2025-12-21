import React, { useState, useEffect, useRef } from "react";
import "./ScientificCalculator.css";

// Calculator buttons by row
const BUTTONS = [
  ["sin", "cos", "tan", "Deg", "Rad"],
  ["sin⁻¹", "cos⁻¹", "tan⁻¹", "π", "e"],
  ["xʸ", "x³", "x²", "eˣ", "10ˣ"],
  ["√", "(", ")", "%", "n!"],
  ["7", "8", "9", "+", "Back"],
  ["4", "5", "6", "-", "Ans"],
  ["1", "2", "3", "*", "/"],
  ["0", ".", "EXP", "=", "AC"]
];

// For degree/radian conversion
const toRad = deg => (deg * Math.PI) / 180;

const operators = "+-*/^";

// Expression evaluator (parser)
const evaluate = (infix, memory, ans, angleMode) => {
  let expr = infix
    .replace(/÷/g, "/")
    .replace(/×|x/g, "*")
    .replace(/π/g, Math.PI)
    .replace(/e/g, Math.E)
    .replace(/Ans/g, ans)
    .replace(/MR/g, memory);

  // Replace x^y notation
  expr = expr.replace(/([0-9.]+)\^([0-9.]+)/g, (s, a, b) => Math.pow(+a, +b));
  expr = expr.replace(/(\d+)!/g, (s, n) => factorial(Number(n)));
  expr = expr.replace(/√\(?([0-9.]+)\)?/g, (s, a) => Math.sqrt(Number(a)));
  expr = expr.replace(/([0-9.]+)%/g, (s, a) => (+a) / 100);

  // Trigonometry/scientific
  expr = expr.replace(/sin⁻¹\(?([0-9.]+)\)?/g, (s, a) =>
    angleMode === "Deg" ? (Math.asin(+a) * 180 / Math.PI) : Math.asin(+a)
  );
  expr = expr.replace(/cos⁻¹\(?([0-9.]+)\)?/g, (s, a) =>
    angleMode === "Deg" ? (Math.acos(+a) * 180 / Math.PI) : Math.acos(+a)
  );
  expr = expr.replace(/tan⁻¹\(?([0-9.]+)\)?/g, (s, a) =>
    angleMode === "Deg" ? (Math.atan(+a) * 180 / Math.PI) : Math.atan(+a)
  );
  expr = expr.replace(/ln\(?([0-9.]+)\)?/g, (s, a) => Math.log(+a));
  expr = expr.replace(/log\(?([0-9.]+)\)?/g, (s, a) => Math.log10(+a));
  expr = expr.replace(/sin\(?([0-9.]+)\)?/g, (s, a) =>
    Math.sin(angleMode === "Deg" ? toRad(+a) : +a)
  );
  expr = expr.replace(/cos\(?([0-9.]+)\)?/g, (s, a) =>
    Math.cos(angleMode === "Deg" ? toRad(+a) : +a)
  );
  expr = expr.replace(/tan\(?([0-9.]+)\)?/g, (s, a) =>
    Math.tan(angleMode === "Deg" ? toRad(+a) : +a)
  );
  expr = expr.replace(/eˣ\(?([0-9.]+)\)?/g, (s, a) => Math.exp(+a));
  expr = expr.replace(/10ˣ\(?([0-9.]+)\)?/g, (s, a) => Math.pow(10, +a));
  expr = expr.replace(/x³/g, "**3");
  expr = expr.replace(/x²/g, "**2");
  expr = expr.replace(/EXP/g, "E");

  // Fallback to safe eval (for simple arithmetic left over)
  // eslint-disable-next-line no-new-func
  return Function('"use strict";return (' + expr + ")")();
};

function factorial(n) {
  if (n < 0) return NaN;
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState("");
  const [angleMode, setAngleMode] = useState("Deg");
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);

  const containerRef = useRef();

  function handleClick(btn) {
    if (btn === "AC") {
      setDisplay("0");
      setHistory("");
      return;
    }
    if (btn === "Back") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      return;
    }
    if (btn === "Deg") {
      setAngleMode("Deg");
      return;
    }
    if (btn === "Rad") {
      setAngleMode("Rad");
      return;
    }
    if (btn === "=") {
      try {
        let res = evaluate(history + display, memory, ans, angleMode);
        setHistory(history + display + "=");
        setDisplay(res.toString());
        setAns(res);
      } catch {
        setDisplay("Error");
      }
      return;
    }
    if (btn === "+") {
      setHistory(history + display + "+");
      setDisplay("0");
      return;
    }
    if (btn === "-") {
      setHistory(history + display + "-");
      setDisplay("0");
      return;
    }
    if (btn === "*") {
      setHistory(history + display + "*");
      setDisplay("0");
      return;
    }
    if (btn === "/") {
      setHistory(history + display + "/");
      setDisplay("0");
      return;
    }
    if (btn === ".") {
      if (!display.includes(".")) setDisplay(display + ".");
      return;
    }
    if (btn === "±") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
      return;
    }
    if (btn === "Ans") {
      setDisplay(ans.toString());
      return;
    }
    if (btn === "M+") {
      setMemory(memory + Number(display));
      return;
    }
    if (btn === "M-") {
      setMemory(memory - Number(display));
      return;
    }
    if (btn === "%") {
      setDisplay((Number(display) / 100).toString());
      return;
    }
    if (btn === "n!") {
      setDisplay(factorial(Number(display)).toString());
      return;
    }
    if (btn === "√") {
      setDisplay(Math.sqrt(Number(display)).toString());
      return;
    }
    if (["sin", "cos", "tan", "sin⁻¹", "cos⁻¹", "tan⁻¹", "ln", "log"].includes(btn)) {
      const val = Number(display);
      let result = 0;
      if (btn === "sin") result = Math.sin(angleMode === "Deg" ? toRad(val) : val);
      if (btn === "cos") result = Math.cos(angleMode === "Deg" ? toRad(val) : val);
      if (btn === "tan") result = Math.tan(angleMode === "Deg" ? toRad(val) : val);
      if (btn === "sin⁻¹") result = angleMode === "Deg" ? Math.asin(val) * 180 / Math.PI : Math.asin(val);
      if (btn === "cos⁻¹") result = angleMode === "Deg" ? Math.acos(val) * 180 / Math.PI : Math.acos(val);
      if (btn === "tan⁻¹") result = angleMode === "Deg" ? Math.atan(val) * 180 / Math.PI : Math.atan(val);
      if (btn === "ln") result = Math.log(val);
      if (btn === "log") result = Math.log10(val);
      setDisplay(result.toString());
      setHistory(history + btn + "(" + val + ")");
      return;
    }
    if (btn === "x²") {
      setDisplay((Number(display) ** 2).toString());
      return;
    }
    if (btn === "x³") {
      setDisplay((Number(display) ** 3).toString());
      return;
    }
    if (btn === "eˣ") {
      setDisplay(Math.exp(Number(display)).toString());
      return;
    }
    if (btn === "10ˣ") {
      setDisplay(Math.pow(10, Number(display)).toString());
      return;
    }
    if (btn === "xʸ") {
      setHistory(history + display + "^");
      setDisplay("");
      return;
    }
    if (btn === "EXP") {
      setDisplay(display + "E");
      return;
    }
    if ("0123456789".includes(btn)) {
      setDisplay(display === "0" ? btn : display + btn);
      return;
    }
    if (btn === "(" || btn === ")") {
      setDisplay(display === "0" ? btn : display + btn);
      return;
    }
    // Fallback to just append any misc symbol
    setDisplay(display + btn);
  }

  // Keyboard input support
  useEffect(() => {
    function onKeyDown(e) {
      const k = e.key;
      if (k === "Enter" || k === "=") handleClick("=");
      else if (k === "Backspace") handleClick("Back");
      else if ("0123456789".includes(k)) handleClick(k);
      else if ("+-*/".includes(k)) handleClick(k);
      else if (k === ".") handleClick(".");
      else if (k === "^") handleClick("xʸ");
      else if (k === "(" || k === ")") handleClick(k);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Autofocus for keyboard
  useEffect(() => { containerRef.current && containerRef.current.focus(); }, []);

  return (
    <div
      className="calculator-dashboard-root"
      tabIndex={0}
      ref={containerRef}
      style={{ outline: "none" }}>
      <div className="calculator-dashboard-heading-wrapper">
        <h2 className="calculator-dashboard-heading">Scientific Calculator</h2>
        <div className="calculator-dashboard-subheading1">
          This is an online javascript scientific calculator. You can click the buttons or type to perform calculations as you would on a physical calculator.
        </div>
      </div>
      <div className="scicalc-card">
        <div className="scicalc-display-history">{history}</div>
        <div className="scicalc-display-main">{display}</div>
        <div className="scicalc-btn-grid">
          {BUTTONS.flat().map((btn, idx) =>
            btn ? (
              <button
                key={idx}
                className="scicalc-btn"
                tabIndex={-1}
                disabled={
                  (btn === "Deg" && angleMode === "Deg") ||
                  (btn === "Rad" && angleMode === "Rad")
                }
                onClick={() => handleClick(btn)}
              >
                {btn}
              </button>
            ) : <div key={idx} />
          )}
        </div>
      </div>
    </div>
  );
}
