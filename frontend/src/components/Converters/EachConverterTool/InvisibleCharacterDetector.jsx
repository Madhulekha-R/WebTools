import React, { useState } from 'react';
import './InvisibleCharacterDetector.css';
const INVISIBLE_CHARS = {
  '\u200B': 'Zero Width Space (U+200B)',
  '\u200C': 'Zero Width Non-Joiner (U+200C)',
  '\u200D': 'Zero Width Joiner (U+200D)',
  '\u2060': 'Word Joiner (U+2060)',
  '\u00A0': 'No-Break Space (U+00A0)',
  '\u202F': 'Narrow No-Break Space (U+202F)',
  '\uFEFF': 'Byte Order Mark (U+FEFF)',
  '\u200E': 'Left-To-Right Mark (U+200E)',
  '\u200F': 'Right-To-Left Mark (U+200F)'
};
function getInvisibleSummary(text) {
  const summary = {};
  for (let char of text) {
    if (INVISIBLE_CHARS[char]) {
      summary[char] = (summary[char] || 0) + 1;
    }
  }
  return summary;
}
function countStats(text) {
  const invisible = Array.from(text).filter(c => INVISIBLE_CHARS[c]).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { invisible, words, chars, sentences, lines };
}
export default function InvisibleCharacterDetector() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const [summary, setSummary] = useState({});
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
    setSummary(getInvisibleSummary(value));
  };
  const handleCopy = () => text && navigator.clipboard.writeText(text);
  const handleClear = () => { setText(''); setStats(countStats('')); setSummary({}); };
  const handleConvert = () => { setStats(countStats(text)); setSummary(getInvisibleSummary(text)); };
  return (
    <div className="icd-main-container">
      <h1 className="icd-title">Invisible Character Detector</h1>
      <p className="icd-desc">
        Summarize invisible (zero-width, non-printing) Unicode characters in text
      </p>
      <div className="icd-content-box">
        <textarea
          className="icd-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="icd-count-display">{stats.invisible}</div>
        <div className="icd-count-label">INVISIBLE CHARACTERS</div>
        <div className="icd-stats-row">
          <div><span className="icd-stats-value">{stats.words}</span><span className="icd-stats-label">WORDS</span></div>
          <div><span className="icd-stats-value">{stats.chars}</span><span className="icd-stats-label">CHARACTERS</span></div>
          <div><span className="icd-stats-value">{stats.sentences}</span><span className="icd-stats-label">SENTENCES</span></div>
          <div><span className="icd-stats-value">{stats.lines}</span><span className="icd-stats-label">LINES</span></div>
        </div>
        <div className="icd-btn-row">
          <button onClick={handleClear} className="icd-btn">Clear</button>
          <button onClick={handleCopy} className="icd-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="icd-btn" disabled={!text}>Convert</button>
        </div>
        <br/>
        <div className="icd-summary-label">
          Invisible Character Summary will appear below
        </div>
        <div className="icd-summary-table">
          {Object.keys(summary).length === 0 ? (
            <em style={{ color: "#b3b3b3" }}>No invisible characters found</em>
          ) : (
            <table className="icd-table">
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Name</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary).map(([char, count]) => (
                  <tr key={char}>
                    <td style={{ fontFamily: "monospace" }}>
                      U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                    </td>
                    <td>{INVISIBLE_CHARS[char]}</td>
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