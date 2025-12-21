import React, { useState } from 'react';
import './CapitalLetterCounter.css';
function getCapitalLetterSummary(text) {
  const summary = {};
  for (let char of text) {
    if (/[A-Z]/.test(char)) {
      summary[char] = (summary[char] || 0) + 1;
    }
  }
  return summary;
}
function countStats(text) {
  const capitals = (text.match(/[A-Z]/g) || []).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { capitals, words, chars, sentences, lines };
}
export default function CapitalLetterCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const [summary, setSummary] = useState({});
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
    setSummary(getCapitalLetterSummary(value));
  };
  const handleCopy = () => text && navigator.clipboard.writeText(text);
  const handleClear = () => { setText(''); setStats(countStats('')); setSummary({}); };
  const handleConvert = () => { setStats(countStats(text)); setSummary(getCapitalLetterSummary(text)); };
  return (
    <div className="clc-main-container">
      <h1 className="clc-title">Capital Letter Counter</h1>
      <p className="clc-desc">
        Count the uppercase English letters in your text
      </p>
      <div className="clc-content-box">
        <textarea
          className="clc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="clc-count-display">{stats.capitals}</div>
        <div className="clc-count-label">CAPITAL LETTERS</div>
        <div className="clc-stats-row">
          <div><span className="clc-stats-value">{stats.words}</span><span className="clc-stats-label">WORDS</span></div>
          <div><span className="clc-stats-value">{stats.chars}</span><span className="clc-stats-label">CHARACTERS</span></div>
          <div><span className="clc-stats-value">{stats.sentences}</span><span className="clc-stats-label">SENTENCES</span></div>
          <div><span className="clc-stats-value">{stats.lines}</span><span className="clc-stats-label">LINES</span></div>
        </div>
        <div className="clc-btn-row">
          <button onClick={handleClear} className="clc-btn">Clear</button>
          <button onClick={handleCopy} className="clc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="clc-btn" disabled={!text}>Convert</button>
        </div>
        <br/>
        <div className="clc-summary-label">
          Capital Letter Summary will appear below
        </div>
        <div className="clc-summary-table">
          {Object.keys(summary).length === 0 ? (
            <em style={{ color: "#b3b3b3" }}>No capital letters found</em>
          ) : (
            <table className="clc-capital-table">
              <thead>
                <tr>
                  <th>Letter</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary).map(([letter, count]) => (
                  <tr key={letter}>
                    <td>{letter}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}