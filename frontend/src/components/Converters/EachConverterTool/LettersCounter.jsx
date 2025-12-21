import React, { useState } from 'react';
import './LettersCounter.css';
function countStats(text, { countSpaces, countNumbers, countPunctuation }) {
  let letters = 0;
  for (const c of text) {
    if (/[a-zA-Z]/.test(c)) letters++;
    else if (countSpaces && c === ' ') letters++;
    else if (countNumbers && /\d/.test(c)) letters++;
    else if (countPunctuation && /[.,!?]/.test(c)) letters++;
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const allChars = text.length;
  return { letters, words, sentences, lines, allChars };
}
export default function LettersCounter() {
  const [text, setText] = useState('');
  const [toggles, setToggles] = useState({
    countSpaces: false, countNumbers: false, countPunctuation: false
  });
  const [stats, setStats] = useState(countStats('', toggles));
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value, toggles));
  };
  const handleCopy = () => { if (text) navigator.clipboard.writeText(text); };
  const handleClear = () => { setText(''); setStats(countStats('', toggles)); };
  const handleConvert = () => setStats(countStats(text, toggles));
  const handleToggle = key => {
    setToggles(t => {
      const newToggles = { ...t, [key]: !t[key] };
      setStats(countStats(text, newToggles));
      return newToggles;
    });
  };
  return (
    <div className="lc-main-container">
      <h1 className="lc-title">Count Letters In Text</h1>
      <p className="lc-desc">Evaluate the letters in your text</p>
      <div className="lc-content-box">
        <textarea
          className="lc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="lc-count-display">{stats.letters}</div>
        <div className="lc-count-label">LETTERS</div>
        <div className="lc-stats-row">
          <div><span className="lc-stats-value">{stats.words}</span><span className="lc-stats-label">WORDS</span></div>
          <div><span className="lc-stats-value">{stats.sentences}</span><span className="lc-stats-label">SENTENCES</span></div>
          <div><span className="lc-stats-value">{stats.lines}</span><span className="lc-stats-label">LINES</span></div>
          <div><span className="lc-stats-value">{stats.allChars}</span><span className="lc-stats-label">ALL CHARACTERS</span></div>
        </div>
        <div className="lc-btn-row">
          <button onClick={handleClear} className="lc-btn">Clear</button>
          <button onClick={handleCopy} className="lc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="lc-btn" disabled={!text}>Convert</button>
        </div>
        <br />
        <div className="lc-toggles">
          <div>
            Count spaces as letters? <button className={`lc-toggle-btn ${toggles.countSpaces ? 'yes' : ''}`} onClick={() => handleToggle('countSpaces')}>{toggles.countSpaces ? 'Yes' : 'No'}</button>
          </div>
          <div>
            Count numbers as letters? <button className={`lc-toggle-btn ${toggles.countNumbers ? 'yes' : ''}`} onClick={() => handleToggle('countNumbers')}>{toggles.countNumbers ? 'Yes' : 'No'}</button>
          </div>
          <div>
            Count punctuation as letters? <button className={`lc-toggle-btn ${toggles.countPunctuation ? 'yes' : ''}`} onClick={() => handleToggle('countPunctuation')}>{toggles.countPunctuation ? 'Yes' : 'No'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}