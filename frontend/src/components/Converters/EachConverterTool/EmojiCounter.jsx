import React, { useState } from 'react';
import './EmojiCounter.css';
const emojiRegex = /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
function getEmojiSummary(text) {
  const emojis = text.match(emojiRegex) || [];
  const summary = {};
  for (let emoji of emojis) {
    summary[emoji] = (summary[emoji] || 0) + 1;
  }
  return summary;
}
function countStats(text) {
  const emojis = (text.match(emojiRegex) || []).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  return { emojis, words, chars, sentences, lines };
}
export default function EmojiCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(countStats(''));
  const [summary, setSummary] = useState({});
  const handleInput = e => {
    const value = e.target.value;
    setText(value);
    setStats(countStats(value));
    setSummary(getEmojiSummary(value));
  };
  const handleCopy = () => text && navigator.clipboard.writeText(text);
  const handleClear = () => { setText(''); setStats(countStats('')); setSummary({}); };
  const handleConvert = () => { setStats(countStats(text)); setSummary(getEmojiSummary(text)); };
  return (
    <div className="emc-main-container">
      <h1 className="emc-title">Emoji Counter</h1>
      <p className="emc-desc">
        Calculate the number of emojis in text
      </p>
      <div className="emc-content-box">
        <textarea
          className="emc-input"
          placeholder="Type or paste your text here…"
          rows={6}
          value={text}
          onChange={handleInput}/>
        <div className="emc-count-display">{stats.emojis}</div>
        <div className="emc-count-label">EMOJIS</div>
        <div className="emc-stats-row">
          <div><span className="emc-stats-value">{stats.words}</span><span className="emc-stats-label">WORDS</span></div>
          <div><span className="emc-stats-value">{stats.chars}</span><span className="emc-stats-label">CHARACTERS</span></div>
          <div><span className="emc-stats-value">{stats.sentences}</span><span className="emc-stats-label">SENTENCES</span></div>
          <div><span className="emc-stats-value">{stats.lines}</span><span className="emc-stats-label">LINES</span></div>
        </div>
        <div className="emc-btn-row">
          <button onClick={handleClear} className="emc-btn">Clear</button>
          <button onClick={handleCopy} className="emc-btn" disabled={!text}>Copy Text</button>
          <button onClick={handleConvert} className="emc-btn" disabled={!text}>Convert</button>
        </div>
        <br/>
        <div className="emc-summary-label">
          Emoji Summary will appear below
        </div>
        <div className="emc-summary-table">
          {Object.keys(summary).length === 0 ? (
            <em style={{ color: "#b3b3b3" }}>No emojis found</em>
          ) : (
            <table className="emc-emoji-table">
              <thead>
                <tr>
                  <th>Emoji</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary).map(([emoji, count]) => (
                  <tr key={emoji}>
                    <td style={{ fontSize: "1.45em" }}>{emoji}</td>
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