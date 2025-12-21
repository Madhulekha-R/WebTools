import React, { useState, useEffect } from 'react';
import './ScrambledTextConverter.css';
function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function scrambleWord(word) {
  return shuffle(word.split('')).join('');
}
function scrambleReadableWord(word) {
  if (word.length <= 3) return word;
  let inner = word.slice(1, -1).split('');
  let shuffled = shuffle(inner).join('');
  return word[0] + shuffled + word[word.length - 1];
}
function scrambleWordOrder(sentence) {
  return shuffle(sentence.split(' ')).join(' ');
}
export default function ScrambledTextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedType, setSelectedType] = useState('scrambleOrder');
  const converters = {
    scrambleAll: {
      label: 'Fully scramble each word',
      fn: str => str.split(/\s+/).map(scrambleWord).join(' ')
    },
    scrambleReadable: {
      label: 'Scramble each word but keep it readable',
      fn: str => str.split(/\s+/).map(scrambleReadableWord).join(' ')
    },
    scrambleOrder: {
      label: 'Scramble the order of words in a sentence',
      fn: scrambleWordOrder
    }
  };
  useEffect(() => {
    if (input) {
      setOutput(converters[selectedType].fn(input));
    } else {
      setOutput('');
    }
  }, [input, selectedType]);
  const handleConvert = () => {
    setOutput(converters[selectedType].fn(input));
  };
  const handleClear = () => {
    setInput('');
    setOutput('');
  };
  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };
  return (
    <div className="scramble-converter-container">
      <h1 className="scramble-title">Scrambled Text Converter</h1>
      <p className="scramble-desc">
        Randomize your text or word order
      </p>
      <div className="scramble-type-row">
        {Object.entries(converters).map(([key, { label }]) => (
          <button
            key={key}
            className={selectedType === key ? 'active' : ''}
            onClick={() => setSelectedType(key)}
            type="button">
            {label}
          </button>
        ))}
      </div>
      <textarea
        className="scramble-input"
        placeholder="Enter your text here"
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={5}/>
      <div className="scramble-arrow">&#8595;</div>
      <textarea
        className="scramble-output"
        placeholder="Scrambled output"
        value={output}
        readOnly
        rows={5}/>
      <div className="scramble-actions">
        <button type="button" onClick={handleConvert}>Convert</button>
        <button type="button" onClick={handleCopy} disabled={!output}>Copy Text</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}