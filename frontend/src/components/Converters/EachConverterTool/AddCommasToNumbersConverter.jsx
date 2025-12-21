import React, { useState } from 'react';
import './AddCommasToNumbersConverter.css';
function addCommas(num) {
  if (!num || isNaN(num)) return '';
  return Number(num).toLocaleString();
}
export default function AddCommasToNumbersConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setInput(val);
    setOutput(addCommas(val));
  };
  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };
  const handleClear = () => {
    setInput('');
    setOutput('');
  };
  return (
    <div className="commas-converter-container">
      <h1 className="commas-title">Add Commas to Numbers</h1>
      <p className="commas-desc">Type a number in the box below to add commas</p>
      <textarea
        className="commas-input"
        placeholder="Enter number"
        value={input}
        onChange={handleInputChange}
        rows={3}/>
      <div className="commas-arrow">&#8595;</div>
      <textarea
        className="commas-output"
        placeholder="Formatted number"
        value={output}
        readOnly
        rows={3}/>
      <div className="commas-actions">
        <button type="button" onClick={handleCopy} disabled={!output}>Copy Text</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}