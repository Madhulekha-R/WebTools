import React, { useState } from 'react';
import './WordCounter.css';
function countStats(text) {
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const paragraphs = text.trim() ? text.split(/\n{2,}/).length : 0;
  return { chars, words, sentences, lines, paragraphs };
}
export default function WordCounter() {
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
    <div className="wc-outer-box">
      <div className="wc-main-container">
        <h1 className="wc-title">Word Counter</h1>
        <p className="wc-desc">Count the number of words in your text</p>
        <div className="wc-content-box">
          <textarea
            className="wc-input"
            placeholder="Type or paste your text here…"
            rows={6}
            value={text}
            onChange={handleInput}/>
          <div className="wc-count-display">{stats.words}</div>
          <div className="wc-count-label">WORDS</div>
          <div className="wc-stats-row">
            <div>
              <span className="wc-stats-value">{stats.chars}</span>
              <span className="wc-stats-label">CHARACTERS</span>
            </div>
            <div>
              <span className="wc-stats-value">{stats.sentences}</span>
              <span className="wc-stats-label">SENTENCES</span>
            </div>
            <div>
              <span className="wc-stats-value">{stats.lines}</span>
              <span className="wc-stats-label">LINES</span>
            </div>
            <div>
              <span className="wc-stats-value">{stats.paragraphs}</span>
              <span className="wc-stats-label">PARAGRAPHS</span>
            </div>
          </div>
          <div className="wc-btn-row">
            <button onClick={handleClear} className="wc-btn">Clear</button>
            <button onClick={handleCopy} className="wc-btn" disabled={!text}>Copy Text</button>
            <button onClick={handleConvert} className="wc-btn" disabled={!text}>Convert</button>
          </div>
        </div>
      </div>
    </div>
  );
}