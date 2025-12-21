import React, { useState, useEffect } from 'react';
import './CapitalizationConverter.css';
function capitalizeEveryWord(str) {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function sentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function randomCase(str) {
  return [...str].map(c => (Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase())).join('');
}
function alternatingCase(str) {
  let toggle = true;
  return [...str].map(c => /[a-zA-Z]/.test(c) ? (toggle = !toggle, toggle ? c.toUpperCase() : c.toLowerCase()) : c).join('');
}
export default function CapitalizationConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedConversion, setSelectedConversion] = useState(null);
  const converters = {
    fullCaps: (text) => text.toUpperCase(),
    fullLower: (text) => text.toLowerCase(),
    invertCaps: (text) => [...text].map(c => /[a-z]/.test(c) ? c.toUpperCase() : /[A-Z]/.test(c) ? c.toLowerCase() : c).join(''),
    capitalizeWords: capitalizeEveryWord,
    sentenceCase: sentenceCase,
    randomCase: randomCase,
    alternatingCase: alternatingCase,
  };
  useEffect(() => {
    if (selectedConversion) {
      setOutput(converters[selectedConversion](input));
    } else {
      setOutput('');
    }
  }, [input, selectedConversion]);
  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };
  return (
    <div className="cap-converter-container">
      <h1 className="cap-title">Capitalization Converter</h1>
      <p className="cap-desc">Change your text to all capitals or lower case</p>
      <div className="cap-button-row">
        {Object.entries(converters).map(([key]) => (
          <button
            key={key}
            onClick={() => setSelectedConversion(key)}
            className={selectedConversion === key ? 'active' : ''}
            type="button">
            {key === 'fullCaps' ? 'Convert to full caps' :
             key === 'fullLower' ? 'Convert to full lower case' :
             key === 'invertCaps' ? 'Invert Capitalization' :
             key === 'capitalizeWords' ? 'Capitalise Every Word' :
             key === 'sentenceCase' ? 'Sentence case' :
             key === 'randomCase' ? 'Random case' :
             key === 'alternatingCase' ? 'Alternating Case' : key}
          </button>
        ))}
      </div>
      <textarea
        className="cap-input"
        placeholder="Input Text Here"
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={5}/>
      <div className="cap-arrow">&#8595;</div>
      <textarea
        className="cap-output"
        placeholder="Output Text Here"
        value={output}
        readOnly
        rows={5}/>
      <div className="cap-btn-row">
        <button
          className="cap-clear-btn"
          onClick={() => {
            setInput('');
            setOutput('');
            setSelectedConversion(null);
          }}
          type="button">
          Clear
        </button>
        <button
          className="cap-copy-btn"
          onClick={handleCopy}
          disabled={!output}
          type="button">
          Copy
        </button>
      </div>
    </div>
  );
}