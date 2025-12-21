import React, { useState } from 'react';
import './PunctuationCounter.css';
const PUNCTUATION_DISPLAY = {
  "'": "Apostrophe (')",
  ";": "Semicolon (;)",
  "(": "Left Bracket (",
  ")": "Right Bracket )",
  ",": "Comma (,)",
  ".": "Full Stop (.)",
  "!": "Exclamation (!)",
  "?": "Question (?)",
  ":": "Colon (:)",
  "-": "Hyphen (-)",
  '"': 'Quotation (")',
  "[": "Left Square Bracket [",
  "]": "Right Square Bracket ]",
  "{": "Left Curly Bracket {",
  "}": "Right Curly Bracket }",
};
function getPunctuationSummary(text) {
  const summary = {};
  const matches = text.match(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g) || [];
  for (const char of matches) {
    summary[char] = (summary[char] || 0) + 1;
  }
  return summary;
}
function countStats(text) {
  const punctuation = (text.match(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g) || []).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { punctuation, words, chars, sentences, lines };
}
export default function PunctuationCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const [summary, setSummary] = useState({});
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
    setSummary(getPunctuationSummary(value));
  };
  const handleCopy = () => text && navigator.clipboard.writeText(text);
  const handleClear = () => { setText(''); setStats(countStats('')); setSummary({}); };
  const handleConvert = () => { setStats(countStats(text)); setSummary(getPunctuationSummary(text)); };
  return (
    <div className="pc-main-container">
      <h1 className="pc-title">Punctuation Counter in Text</h1>
      <p className="pc-desc">
        Count the punctuation in your text
      </p>
      <div className="pc-content-box">
        <textarea
          className="pc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="pc-count-display">{stats.punctuation}</div>
        <div className="pc-count-label">PUNCTUATION</div>
        <div className="pc-stats-row">
          <div><span className="pc-stats-value">{stats.words}</span><span className="pc-stats-label">WORDS</span></div>
          <div><span className="pc-stats-value">{stats.chars}</span><span className="pc-stats-label">CHARACTERS</span></div>
          <div><span className="pc-stats-value">{stats.sentences}</span><span className="pc-stats-label">SENTENCES</span></div>
          <div><span className="pc-stats-value">{stats.lines}</span><span className="pc-stats-label">LINES</span></div>
        </div>
        <div className="pc-btn-row">
          <button onClick={handleClear} className="pc-btn">Clear</button>
          <button onClick={handleCopy} className="pc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="pc-btn" disabled={!text}>Convert</button>
        </div>
        <br />
        <div className="pc-summary-label">Punctuation Summary will appear below</div>
        <div className="pc-summary-table">
          {Object.keys(summary).length === 0 && <em style={{ color: "#b3b3b3" }}>No punctuation found</em>}
          <ul>
            {Object.entries(summary).map(([char, count]) => (
              <li key={char}>
                {PUNCTUATION_DISPLAY[char] || `U+${char.charCodeAt(0).toString(16).toUpperCase()} (${char})`}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}