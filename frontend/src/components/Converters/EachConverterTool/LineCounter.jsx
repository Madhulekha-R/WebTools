import React, { useState } from 'react';
import './LineCounter.css';
function countStats(text, countEmptyLines) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const rawLines = text.split(/\r?\n/);
  const lines = countEmptyLines
    ? rawLines.length
    : rawLines.filter(line => line.trim().length > 0).length;
  const paragraphs = text.trim() ? text.split(/\n{2,}/).length : 0;
  return { lines, words, chars, sentences, paragraphs };
}
export default function LineCounter() {
  const [text, setText] = useState('');
  const [countEmpty, setCountEmpty] = useState(true);
  const [stats, setStats] = useState(countStats('', countEmpty));
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value, countEmpty));
  };
  const handleToggle = () => {
    setCountEmpty(prev => {
      const newVal = !prev;
      setStats(countStats(text, newVal));
      return newVal;
    });
  };
  const handleCopy = () => {
    if (text) navigator.clipboard.writeText(text);
  };
  const handleClear = () => {
    setText('');
    setStats(countStats('', countEmpty));
  };
  const handleConvert = () => setStats(countStats(text, countEmpty));
  return (
    <div className="lc-outer-box">
      <div className="lc-main-container">
        <h1 className="lc-title">Line Counter</h1>
        <p className="lc-desc">Count the amount of lines in text</p>
        <div className="lc-content-box">
          <textarea
            className="lc-input"
            placeholder="Type or paste your text here…"
            rows={6}
            value={text}
            onChange={handleInput}/>
          <div className="lc-count-display">{stats.lines}</div>
          <div className="lc-count-label">LINES</div>
          <div className="lc-stats-row">
            <div>
              <span className="lc-stats-value">{stats.words}</span>
              <span className="lc-stats-label">WORDS</span>
            </div>
            <div>
              <span className="lc-stats-value">{stats.chars}</span>
              <span className="lc-stats-label">CHARACTERS</span>
            </div>
            <div>
              <span className="lc-stats-value">{stats.sentences}</span>
              <span className="lc-stats-label">SENTENCES</span>
            </div>
            <div>
              <span className="lc-stats-value">{stats.paragraphs}</span>
              <span className="lc-stats-label">PARAGRAPHS</span>
            </div>
          </div>
          <div className="lc-btn-row">
            <button onClick={handleClear} className="lc-btn">
              Clear
            </button>
            <button onClick={handleCopy} className="lc-btn" disabled={!text}>
              Copy Text
            </button>
            <button onClick={handleConvert} className="lc-btn" disabled={!text}>
              Convert
            </button>
          </div>
          <br />
          <div className="lc-toggle-row">
            <label className="lc-toggle-label">
              Count empty lines in the total? 
              <span className="lc-switch">
                <input type="checkbox" checked={countEmpty} onChange={handleToggle} />
                <span className="lc-slider" />
              </span>
              <span className="lc-toggle-status">{countEmpty ? 'Yes' : 'No'}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}