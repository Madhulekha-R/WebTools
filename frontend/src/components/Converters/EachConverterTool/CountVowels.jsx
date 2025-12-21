import React, { useState } from 'react';
import './CountVowels.css';
const VOWEL_LABELS = {a: "A",e: "E",i: "I",o: "O",u: "U",A: "A",E: "E",I: "I",O: "O",U: "U"};
function getVowelSummary(text) {
  const summary = {};
  for (let char of text) {
    if (/[aeiouAEIOU]/.test(char)) {
      summary[char] = (summary[char] || 0) + 1;
    }
  }
  return summary;
}
function countStats(text) {
  const vowels = (text.match(/[aeiouAEIOU]/g) || []).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { vowels, words, chars, sentences, lines };
}
export default function CountVowels() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const [summary, setSummary] = useState({});
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
    setSummary(getVowelSummary(value));
  };
  const handleCopy = () => text && navigator.clipboard.writeText(text);
  const handleClear = () => { setText(''); setStats(countStats('')); setSummary({}); };
  const handleConvert = () => { setStats(countStats(text)); setSummary(getVowelSummary(text)); };
  return (
    <div className="cv-main-container">
      <h1 className="cv-title">Count Vowels in Text</h1>
      <p className="cv-desc">
        Count and summarize vowels in your text
      </p>
      <div className="cv-content-box">
        <textarea
          className="cv-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="cv-count-display">{stats.vowels}</div>
        <div className="cv-count-label">VOWELS</div>
        <div className="cv-stats-row">
          <div><span className="cv-stats-value">{stats.words}</span><span className="cv-stats-label">WORDS</span></div>
          <div><span className="cv-stats-value">{stats.chars}</span><span className="cv-stats-label">CHARACTERS</span></div>
          <div><span className="cv-stats-value">{stats.sentences}</span><span className="cv-stats-label">SENTENCES</span></div>
          <div><span className="cv-stats-value">{stats.lines}</span><span className="cv-stats-label">LINES</span></div>
        </div>
        <div className="cv-btn-row">
          <button onClick={handleClear} className="cv-btn">Clear</button>
          <button onClick={handleCopy} className="cv-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="cv-btn" disabled={!text}>Convert</button>
        </div>
        <br />
        <div className="cv-summary-label">
          Vowel Summary will appear below
        </div>
        <div className="cv-summary-table">
          {Object.keys(summary).length === 0 ? (
            <em style={{ color: "#b3b3b3" }}>No vowels found</em>
          ) : (
            <table className="cv-vowel-table">
              <thead>
                <tr>
                  <th>Vowel</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary).map(([vowel, count]) => (
                  <tr key={vowel}>
                    <td>{VOWEL_LABELS[vowel] || vowel}</td>
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