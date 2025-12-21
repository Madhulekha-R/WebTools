import React, { useState } from 'react';
import './CountCommas.css';
function countStats(text) {
  const commas = (text.match(/,/g) || []).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { commas, words, chars, sentences, lines };
}
export default function CountCommas() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
  };
  const handleCopy = () => text && navigator.clipboard.writeText(text);
  const handleClear = () => { setText(''); setStats(countStats('')); };
  const handleConvert = () => setStats(countStats(text));
  return (
    <div className="cc-main-container">
      <h1 className="cc-title">Count Commas in Text</h1>
      <p className="cc-desc">
        Find the number of commas in your text
      </p>
      <div className="cc-content-box">
        <textarea
          className="cc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="cc-count-display">{stats.commas}</div>
        <div className="cc-count-label">COMMAS</div>
        <div className="cc-stats-row">
          <div><span className="cc-stats-value">{stats.words}</span><span className="cc-stats-label">WORDS</span></div>
          <div><span className="cc-stats-value">{stats.chars}</span><span className="cc-stats-label">CHARACTERS</span></div>
          <div><span className="cc-stats-value">{stats.sentences}</span><span className="cc-stats-label">SENTENCES</span></div>
          <div><span className="cc-stats-value">{stats.lines}</span><span className="cc-stats-label">LINES</span></div>
        </div>
        <div className="cc-btn-row">
          <button onClick={handleClear} className="cc-btn">Clear</button>
          <button onClick={handleCopy} className="cc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="cc-btn" disabled={!text}>Convert</button>
        </div>
      </div>
    </div>
  );
}