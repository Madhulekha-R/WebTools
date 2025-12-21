import React, { useState } from 'react';
import './MonospaceTextConverter.css';
function toMonospace(text) {
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
export default function MonospaceTextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleConvert = () => {
    setOutput(toMonospace(input));
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };
  return (
    <div className="monospace-converter-container">
      <h1 className="monospace-title">Monospace Text Converter</h1>
      <p className="monospace-desc">Convert to and from Monospaced Text</p>
      <textarea
        className="monospace-input"
        placeholder="Enter text"
        value={input}
        onChange={handleInputChange}
        rows={5}/>
      <div className="monospace-arrow">&#8595;</div>
      <textarea
        className="monospace-output"
        placeholder="Output text here"
        value={output}
        readOnly
        rows={5}/>
      <div className="monospace-actions">
        <button type="button" onClick={handleConvert} disabled={!input}>Convert</button>
        <button type="button" onClick={handleCopy} disabled={!output}>Copy Text</button>
      </div>
    </div>
  );
}