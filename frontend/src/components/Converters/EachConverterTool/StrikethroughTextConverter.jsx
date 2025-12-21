import React, { useState } from 'react';
import './StrikethroughTextConverter.css';
function toStrikethrough(text) {
  return [...text].map(char =>
    char === ' ' ? ' ' : char + '\u0336'
  ).join('');
}
export default function StrikethroughTextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setOutput(toStrikethrough(val));
  };
  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };
  const handleClear = () => {
    setInput('');
    setOutput('');
  };
  return (
    <div className="strike-converter-container">
      <h1 className="strike-title">Strikethrough Text Converter</h1>
      <p className="strike-desc">
        Convert to <span className="crossed-out">crossed out text</span>
      </p>
      <textarea
        className="strike-input"
        placeholder="Input text here"
        value={input}
        onChange={handleInputChange}
        rows={5}/>
      <div className="strike-arrow">&#8595;</div>
      <div className="strike-output">
        {output}
      </div>
      <div className="strike-actions">
        <button
          type="button"
          onClick={handleClear}>
          Clear
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!output}>
          Copy Text
        </button>
      </div>
    </div>
  );
}