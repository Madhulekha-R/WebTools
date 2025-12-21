import React, { useState } from 'react';
import './ParagraphCounter.css';
function countStats(text) {
  const paragraphs = text.trim() ? text.split(/\n{2,}/).filter(p => p.trim().length > 0).length : 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const chars = text.length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { paragraphs, words, sentences, chars, lines };
}
export default function ParagraphCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
  };
  const handleCopy = () => { if (text) navigator.clipboard.writeText(text); };
  const handleClear = () => { setText(''); setStats(countStats('')); };
  const handleConvert = () => setStats(countStats(text));
  return (
    <div className="pc-main-container">
      <h1 className="pc-title">Paragraph Counter</h1>
      <p className="pc-desc">Count paragraphs in your text</p>
      <div className="pc-content-box">
        <textarea
          className="pc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="pc-count-display">{stats.paragraphs}</div>
        <div className="pc-count-label">PARAGRAPHS</div>
        <div className="pc-stats-row">
          <div>
            <span className="pc-stats-value">{stats.words}</span>
            <span className="pc-stats-label">WORDS</span>
          </div>
          <div>
            <span className="pc-stats-value">{stats.chars}</span>
            <span className="pc-stats-label">CHARACTERS</span>
          </div>
          <div>
            <span className="pc-stats-value">{stats.sentences}</span>
            <span className="pc-stats-label">SENTENCES</span>
          </div>
          <div>
            <span className="pc-stats-value">{stats.lines}</span>
            <span className="pc-stats-label">LINES</span>
          </div>
        </div>
        <div className="pc-btn-row">
          <button onClick={handleClear} className="pc-btn">Clear</button>
          <button onClick={handleCopy} className="pc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="pc-btn" disabled={!text}>Convert</button>
        </div>
      </div>
    </div>
  );
}