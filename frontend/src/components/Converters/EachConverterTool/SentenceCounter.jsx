import React, { useState } from 'react';
import './SentenceCounter.css';
function countStats(text) {
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const paragraphs = text.trim() ? text.split(/\n{2,}/).length : 0;
  return { sentences, words, chars, lines, paragraphs };
}
export default function SentenceCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
  };
  const handleCopy = () => {
    if (text) navigator.clipboard.writeText(text);
  };
  const handleClear = () => {
    setText('');
    setStats(countStats(''));
  };
  const handleConvert = () => setStats(countStats(text));
  return (
    <div className="sc-main-container">
      <h1 className="sc-title">Sentence Counter</h1>
      <p className="sc-desc">Evaluate the sentence in your text</p>
      <div className="sc-content-box">
        <textarea
          className="sc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="sc-count-display">{stats.sentences}</div>
        <div className="sc-count-label">SENTENCES</div>
        <div className="sc-stats-row">
          <div>
            <span className="sc-stats-value">{stats.words}</span>
            <span className="sc-stats-label">WORDS</span>
          </div>
          <div>
            <span className="sc-stats-value">{stats.chars}</span>
            <span className="sc-stats-label">CHARACTERS</span>
          </div>
          <div>
            <span className="sc-stats-value">{stats.lines}</span>
            <span className="sc-stats-label">LINES</span>
          </div>
          <div>
            <span className="sc-stats-value">{stats.paragraphs}</span>
            <span className="sc-stats-label">PARAGRAPHS</span>
          </div>
        </div>
        <div className="sc-btn-row">
          <button onClick={handleClear} className="sc-btn">Clear</button>
          <button onClick={handleCopy} className="sc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="sc-btn" disabled={!text}>Convert</button>
        </div>
      </div>
    </div>
  );
}