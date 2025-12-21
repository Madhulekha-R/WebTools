import React, { useState } from 'react';
import './UnicodeMonospaceTextConverter.css';
function toUnicodeMonospace(text) {
  return [...text].map(char => {
    if (char >= 'A' && char <= 'Z')
      return String.fromCodePoint(0x1D670 + (char.charCodeAt(0) - 65));
    if (char >= 'a' && char <= 'z')
      return String.fromCodePoint(0x1D68A + (char.charCodeAt(0) - 97));
    if (char >= '0' && char <= '9')
      return String.fromCodePoint(0x1D7F6 + (char.charCodeAt(0) - 48));
    return char;
  }).join('');
}
export default function UnicodeMonospaceTextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleConvert = () => {
    setOutput(toUnicodeMonospace(input));
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };
  const handleClear = () => {
    setInput('');
    setOutput('');
  };
  return (
    <div className="umonospace-converter-container">
      <h1 className="umonospace-title">Unicode Monospace Text Converter</h1>
      <p className="umonospace-desc">
        Convert to and from Unicode Monospaced Text
      </p>
      <textarea
        className="umonospace-input"
        placeholder="Input text here"
        value={input}
        onChange={handleInputChange}
        rows={5}/>
      <div className="umonospace-arrow">&#8595;</div>
      <textarea
        className="umonospace-output"
        placeholder="Output text here"
        value={output}
        readOnly
        rows={5}/>
      <div className="umonospace-actions">
        <button type="button" onClick={handleConvert} disabled={!input}>Convert</button>
        <button type="button" onClick={handleCopy} disabled={!output}>Copy Text</button>
        <button type="button" onClick={handleClear} disabled={!input && !output}>Clear</button>
      </div>
    </div>
  );
}