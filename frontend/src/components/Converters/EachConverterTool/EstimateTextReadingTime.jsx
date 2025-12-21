import React, { useState } from 'react';
import './EstimateTextReadingTime.css';
export default function EstimateTextReadingTime() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);
  const [readingTime, setReadingTime] = useState('');
  const calculateReadingTime = (txt, rate) => {
    const words = txt.trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return '0 min';
    const minutes = words / rate;
    if (minutes < 1) {
      return `${Math.ceil(minutes * 60)} sec`;
    } else {
      return `${minutes.toFixed(2)} minutes`;
    }
  };
  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    setReadingTime(calculateReadingTime(val, wpm));
  };
  const handleWpmChange = (e) => {
    let val = Math.max(50, Math.min(1000, Number(e.target.value)));
    setWpm(val);
    setReadingTime(calculateReadingTime(text, val));
  };
  const handleClear = () => {
    setText('');
    setReadingTime('');
  };
  return (
    <div className="etr-container">
      <h1 className="etr-title">Estimate Text Reading Time</h1>
      <p className="etr-desc">
        Enter your text and set average words per minute to estimate reading duration
      </p>
      <textarea
        className="etr-input"
        placeholder="Enter text here..."
        rows={6}
        value={text}
        onChange={handleTextChange}/>
      <div className="etr-controls">
        <label htmlFor="wpm-input" className="etr-label">
          Average reading speed (WPM):
        </label>
        <input
          id="wpm-input"
          type="number"
          min="50"
          max="1000"
          className="etr-wpm-input"
          value={wpm}
          onChange={handleWpmChange}/>
      </div>
      <div className="etr-result">
        {readingTime && <p>Estimated reading time: <strong>{readingTime}</strong></p>}
      </div>
      <div className="etr-actions">
        <button onClick={handleClear} disabled={!text}>Clear</button>
      </div>
    </div>
  );
}