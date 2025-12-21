import React, { useState } from 'react';
import './LeetTextConverter.css';
const leetMap = {a: '4', A: '4', e: '3', E: '3', l: '1', L: '1', t: '7', T: '7', s: '5', S: '5', o: '0', O: '0', b: '8', B: '8', g: '9', G: '9',
  z: '2', Z: '2', i: '!', I: '!', h: '#', H: '#', f: 'ƒ', F: 'ƒ',
};
function toLeetSpeak(str) {
  return [...str].map(c => leetMap[c] || c).join('');
}
export default function LeetTextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setOutput(toLeetSpeak(val));
  };
  const handleConvert = () => setOutput(toLeetSpeak(input));
  const handleClear = () => { setInput(''); setOutput(''); };
  const handleCopy = () => { if (output) navigator.clipboard.writeText(output); };
  return (
    <div className="leet-converter-container">
      <h1 className="leet-title">Leet Text Converter</h1>
      <p className="leet-desc">
        Create Leet Speak (1337) number style text
      </p>
      <textarea
        className="leet-input"
        placeholder="Enter your text here"
        value={input}
        onChange={handleInputChange}
        rows={5}/>
      <div className="leet-arrow">&#8595;</div>
      <textarea
        className="leet-output"
        placeholder="Output text here"
        value={output}
        readOnly
        rows={5}/>
      <div className="leet-actions">
        <button type="button" onClick={handleConvert}>Convert</button>
        <button type="button" onClick={handleCopy} disabled={!output}>Copy Text</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}