import React, { useState } from "react";
import "./PasswordGenerator.css";

// Helper functions for password generation features
function getRandomFrom(str) {
  return str[Math.floor(Math.random() * str.length)];
}
function shuffleString(str) {
  return str.split('').sort(() => Math.random() - 0.5).join('');
}
function calcEntropy(charsetLen, length) {
  return Math.round(length * Math.log2(charsetLen) * 10) / 10;
}
function getStrength(entropy) {
  if (entropy < 30) return { text: "Weak", color: "#e74c3c", bar: 0.25 };
  if (entropy < 50) return { text: "Moderate", color: "#f7c948", bar: 0.5 };
  if (entropy < 70) return { text: "Strong", color: "#31d267", bar: 0.75 };
  return { text: "Very Strong", color: "#1abc9c", bar: 1 };
}
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMS = "0123456789";
const SYMBOLS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const AMBIGUOUS = "il1Lo0O`~:;,.'\"";
const BRACKETS = "<>[]{}()";

export default function PasswordGenerator() {
  const [length, setLength] = useState(10);
  const [hasLower, setHasLower] = useState(true);
  const [hasUpper, setHasUpper] = useState(true);
  const [hasNumber, setHasNumber] = useState(true);
  const [hasSymbols, setHasSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [excludeBrackets, setExcludeBrackets] = useState(true);
  const [noRepeat, setNoRepeat] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  function buildCharset() {
    let charset = "";
    if (hasLower) charset += LOWER;
    if (hasUpper) charset += UPPER;
    if (hasNumber) charset += NUMS;
    if (hasSymbols) charset += SYMBOLS;
    if (excludeAmbiguous) charset = charset.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
    if (excludeBrackets) charset = charset.split('').filter(c => !BRACKETS.includes(c)).join('');
    return charset;
  }

  function handleGenerate(e) {
    if (e) e.preventDefault();
    let charset = buildCharset();
    if (!charset.length) {
      setPassword("⚠️ Choose at least one option!");
      return;
    }
    let pwd = "";
    // Guarantee at least one of each selected type if possible
    let required = [];
    if (hasLower) required.push(getRandomFrom(LOWER));
    if (hasUpper) required.push(getRandomFrom(UPPER));
    if (hasNumber) required.push(getRandomFrom(NUMS));
    if (hasSymbols) required.push(getRandomFrom(SYMBOLS));
    pwd = [...required];
    let chars = charset.split("");
    for (let i = pwd.length; i < length; i++) {
      let next = getRandomFrom(chars);
      if (noRepeat) {
        while (pwd.includes(next) && pwd.length < chars.length) {
          next = getRandomFrom(chars);
        }
      }
      pwd.push(next);
    }
    setPassword(shuffleString(pwd.join("")).slice(0, length));
    setCopied(false);
  }

  React.useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line
  }, [length, hasLower, hasUpper, hasNumber, hasSymbols, excludeAmbiguous, excludeBrackets, noRepeat]);

  function handleCopy() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Strength and entropy display
  const charsetLen = buildCharset().length;
  const entropy = calcEntropy(charsetLen, length);
  const { text: strengthText, color: strengthColor, bar: strengthBar } = getStrength(entropy);

  return (
    <div className="calculator-dashboard-root">
            <h2 className="calculator-dashboard-heading">Random Password Generator</h2>
            <div
            className="calculator-dashboard-subheading1"
            style={{
                maxWidth: "900px",
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                color: "#b0b3b8",
                fontSize: "1.1rem",
                textAlign: "center",
                marginBottom: "2.2rem",
            }}
            >
            This tool can generate secure, strong, random passwords. The password is generated completely in your browser and never leaves your device.
            </div>
      <div className="pwgen-output">
        <div className="pwgen-box">
          <strong className="pwgen-password">{password}</strong>
        </div>
        <div className="pwgen-status-row">
          <span className="pwgen-strength-label">Password Strength:</span>
          <span style={{color: strengthColor, fontWeight: 700, marginLeft: 6, marginRight: 12}}>{strengthText}</span>
          <div className="pwgen-strength-bar-bg">
            <div className="pwgen-strength-bar" style={{background: strengthColor, width: `${strengthBar * 100}%`}} />
          </div>
          <span className="pwgen-entropy">Password Entropy: {entropy} bits</span>
        </div>
        <div className="pwgen-actions">
          <button onClick={handleCopy} className="pwgen-copy-btn">{copied ? "Copied!" : "Copy Password"}</button>
          <button onClick={handleGenerate} className="pwgen-reload-btn" title="Regenerate">⟳ Regenerate</button>
        </div>
      </div>
      <form className="pwgen-controls" onSubmit={handleGenerate}>
        <div className="pwgen-row">
          <label>Password Length:</label>
          <input
            type="number"
            min="6"
            max="40"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="pwgen-length"
          />
          <input
            type="range"
            min="6"
            max="40"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="pwgen-slider"
          />
        </div>
        <div className="pwgen-row">
          <label><input type="checkbox" checked={hasLower} onChange={e => setHasLower(e.target.checked)} />
            Include Lower Case (a-z)</label>
        </div>
        <div className="pwgen-row">
          <label><input type="checkbox" checked={hasUpper} onChange={e => setHasUpper(e.target.checked)} />
            Include Upper Case (A-Z)</label>
        </div>
        <div className="pwgen-row">
          <label><input type="checkbox" checked={hasNumber} onChange={e => setHasNumber(e.target.checked)} />
            Include Numbers (0-9)</label>
        </div>
        <div className="pwgen-row">
          <label><input type="checkbox" checked={hasSymbols} onChange={e => setHasSymbols(e.target.checked)} />
            Include Symbols (!"#$%&...)</label>
        </div>
        <div className="pwgen-row">
          <label><input type="checkbox" checked={excludeAmbiguous} onChange={e => setExcludeAmbiguous(e.target.checked)} />
            Exclude Ambiguous Characters (il1Lo0O etc.)</label>
        </div>
        <div className="pwgen-row">
          <label><input type="checkbox" checked={excludeBrackets} onChange={e => setExcludeBrackets(e.target.checked)} />
            Exclude Brackets (&lt;&gt;()[]&#123;&#125;)</label>
        </div>
        <div className="pwgen-row">
          <label><input type="checkbox" checked={noRepeat} onChange={e => setNoRepeat(e.target.checked)} />
            No Repeated Characters</label>
        </div>
        <div style={{marginTop: 18}}>
          <button className="pwgen-generate-btn" type="submit">Generate</button>
        </div>
      </form>
    </div>
  );
}
