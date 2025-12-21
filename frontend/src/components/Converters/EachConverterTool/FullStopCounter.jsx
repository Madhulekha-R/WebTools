import React, { useState } from 'react';
import './FullStopCounter.css';
function countStats(text) {
  const fullStops = (text.match(/[.]/g) || []).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { fullStops, words, chars, sentences, lines };
}
export default function FullStopCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
  };
  const handleCopy = () => { if (text) navigator.clipboard.writeText(text); };
  const handleClear = () => { setText(''); setStats(countStats('')); };
  const handleConvert = () => setStats(countStats(text));
  return (
    <div className="fsc-main-container">
      <h1 className="fsc-title">Count Full Stops In Text</h1>
      <p className="fsc-desc">
        Count the number of full stops in your text
      </p>
      <div className="fsc-content-box">
        <textarea
          className="fsc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="fsc-count-display">{stats.fullStops}</div>
        <div className="fsc-count-label">FULL STOPS</div>
        <div className="fsc-stats-row">
          <div><span className="fsc-stats-value">{stats.words}</span><span className="fsc-stats-label">WORDS</span></div>
          <div><span className="fsc-stats-value">{stats.chars}</span><span className="fsc-stats-label">CHARACTERS</span></div>
          <div><span className="fsc-stats-value">{stats.sentences}</span><span className="fsc-stats-label">SENTENCES</span></div>
          <div><span className="fsc-stats-value">{stats.lines}</span><span className="fsc-stats-label">LINES</span></div>
        </div>
        <div className="fsc-btn-row">
          <button onClick={handleClear} className="fsc-btn">Clear</button>
          <button onClick={handleCopy} className="fsc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="fsc-btn" disabled={!text}>Convert</button>
        </div>
      </div>
    </div>
  );
}