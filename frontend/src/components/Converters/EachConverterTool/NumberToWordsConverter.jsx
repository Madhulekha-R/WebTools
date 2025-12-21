import React, { useState, useEffect } from 'react';
import './NumberToWordsConverter.css';
function numberToWords(n, useDash = false) {
  if (!/^\d+$/.test(n)) return "Invalid input";
  n = parseInt(n, 10);
  if (n === 0) return "zero";
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen","fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty","sixty", "seventy", "eighty", "ninety"];
  const thousands = ["", "thousand", "million", "billion"];
  function chunkToWords(num) {
    let str = "";
    if (num >= 100) {
      str += ones[Math.floor(num / 100)] + " hundred";
      num = num % 100;
      if (num > 0) str += " and ";
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)];
      if (num % 10) str += useDash ? "-" : " ";
      str += ones[num % 10];
    } else if (num >= 10) {
      str += teens[num - 10];
    } else if (num > 0) {
      str += ones[num];
    }
    return str.trim();
  }
  let words = [];
  let chunkCount = 0;
  while (n > 0) {
    let chunk = n % 1000;
    if (chunk !== 0) {
      let chunkWords = chunkToWords(chunk);
      if (thousands[chunkCount]) {
        chunkWords += " " + thousands[chunkCount];
      }
      words.unshift(chunkWords.trim());
    }
    n = Math.floor(n / 1000);
    chunkCount++;
  }
  let out = words.join(" ").replace(/\s+/g, " ").replace(/- /g, " ").trim();
  if (useDash) {
    out = out.replace(/\b(\w+)\s(\w+)\b/g, "$1-$2");
    out = out.replace(/ and /g, "-and-");
  }
  return out;
}
function addCommas(n) {
  if (!n || isNaN(n)) return n;
  return parseInt(n, 10).toLocaleString();
}
export default function NumberToWordsConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [useDash, setUseDash] = useState(false);
  useEffect(() => {
    if (input) {
      setOutput(numberToWords(input, useDash));
    } else {
      setOutput('');
    }
  }, [input, useDash]);
  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };
  const handleAddCommas = () => {
    if (input && !isNaN(input)) setInput(addCommas(input));
  };
  const handleClear = () => {
    setInput('');
    setOutput('');
    setUseDash(false);
  };
  return (
    <div className="numwords-converter">
      <h1 className="numwords-title">Number to Words Converter</h1>
      <div className="numwords-desc">
        Convert numbers into words
        <br />
        <span className="numwords-eg">
          For example: 123 ⇄ One hundred and twenty three
        </span>
      </div>
      <textarea
        className="numwords-input"
        placeholder="Input text here"
        value={input}
        onChange={e => setInput(e.target.value.replace(/[^\d]/g, ""))}
        rows={5}/>
      <div className="numwords-arrow">↓</div>
      <textarea
        className="numwords-output"
        placeholder="Output text here"
        value={output}
        readOnly
        rows={5}/>
      <div className="numwords-btn-section">
        <div className="numwords-buttons-row">
          <button
            type="button"
            className={!useDash ? "active" : ""}
            onClick={() => setUseDash(false)}>
            No Dashes <br /> (One Hundred)
          </button>
          <button
            type="button"
            className={useDash ? "active" : ""}
            onClick={() => setUseDash(true)}>
            Include Dashes <br /> (One-Hundred)
          </button>
          <button
            type="button"
            onClick={handleAddCommas}
            disabled={!input}>
            Add Commas to Number
          </button>
        </div>
        <div className="numwords-buttons-row">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}>
            Copy Text
          </button>
          <button
            type="button"
            onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}