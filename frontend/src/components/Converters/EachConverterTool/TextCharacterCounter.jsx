import React, { useState } from 'react';
import './TextCharacterCounter.css';
function countStats(text, { countSpaces, countNumbers, countPunctuation }) {
  const chars = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const paragraphs = text.trim() ? text.split(/\n{2,}/).length : 0;
  let charCount = 0;
  for (const c of text) {
    if ((!countSpaces && c === ' ') ||
        (!countNumbers && /\d/.test(c)) ||
        (!countPunctuation && /[.,!?]/.test(c))) continue;
    charCount++;
  }
  return { chars: charCount, words, sentences, lines, paragraphs };
}
export default function TextCharacterCounter() {
  const [text, setText] = useState('');
  const [toggles, setToggles] = useState({
    countSpaces: true, countNumbers: true, countPunctuation: true
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
    <div className="tcc-main-container">
      <h1 className="tcc-title">Text Character Counter</h1>
      <p className="tcc-desc">Count the number of characters in text</p>
      <div className="tcc-content-box">
        <textarea
          className="tcc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="tcc-count-display">{stats.chars}</div>
        <div className="tcc-count-label">CHARACTERS</div>
        <div className="tcc-stats-row">
          <div><span className="tcc-stats-value">{stats.words}</span><span className="tcc-stats-label">WORDS</span></div>
          <div><span className="tcc-stats-value">{stats.sentences}</span><span className="tcc-stats-label">SENTENCES</span></div>
          <div><span className="tcc-stats-value">{stats.lines}</span><span className="tcc-stats-label">LINES</span></div>
          <div><span className="tcc-stats-value">{stats.paragraphs}</span><span className="tcc-stats-label">PARAGRAPHS</span></div>
        </div>
        <div className="tcc-btn-row">
          <button onClick={handleClear} className="tcc-btn">Clear</button>
          <button onClick={handleCopy} className="tcc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="tcc-btn" disabled={!text}>Convert</button>
        </div>
        <br />
        <div className="tcc-toggles">
          <div>
            Count spaces as characters? <button className={`tcc-toggle-btn ${toggles.countSpaces ? 'yes' : ''}`} onClick={() => handleToggle('countSpaces')}>{toggles.countSpaces ? 'Yes' : 'No'}</button>
          </div>
          <div>
            Count numbers as characters? <button className={`tcc-toggle-btn ${toggles.countNumbers ? 'yes' : ''}`} onClick={() => handleToggle('countNumbers')}>{toggles.countNumbers ? 'Yes' : 'No'}</button>
          </div>
          <div>
            Count punctuation as characters? <button className={`tcc-toggle-btn ${toggles.countPunctuation ? 'yes' : ''}`} onClick={() => handleToggle('countPunctuation')}>{toggles.countPunctuation ? 'Yes' : 'No'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}