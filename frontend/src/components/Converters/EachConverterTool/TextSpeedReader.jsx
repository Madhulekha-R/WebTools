import React, { useState, useEffect, useRef } from 'react';
import './TextSpeedReader.css';
export default function TextSpeedReader() {
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(150); 
  const [isReading, setIsReading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState([]);
  const utteranceRef = useRef(null);
  useEffect(() => {
    setWords(text.trim().split(/\s+/));
  }, [text]);
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  const startReading = () => {
    if (!text.trim()) return;
    if (isReading) return;
    setIsReading(true);
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = speed / 200;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const partial = text.substring(0, charIndex);
        setCurrentIndex(partial.trim().split(/\s+/).length);
      }
    };
    utterance.onend = () => {
      setIsReading(false);
      setCurrentIndex(0);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  const pauseReading = () => {
    if (isReading) {
      window.speechSynthesis.pause();
      setIsReading(false);
    }
  };
  const resumeReading = () => {
    if (!isReading) {
      window.speechSynthesis.resume();
      setIsReading(true);
    }
  };
  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setCurrentIndex(0);
  };
  const handleSpeedChange = (e) => {
    let spd = parseInt(e.target.value);
    if (spd < 50) spd = 50;
    if (spd > 300) spd = 300;
    setSpeed(spd);
    if (utteranceRef.current) {
      utteranceRef.current.rate = spd / 200;
    }
  };
  return (
    <div className="tsr-outer-box">
      <div className="tsr-container">
        <h1 className="tsr-title">Text Speed Reader</h1>
        <textarea
          className="tsr-input"
          placeholder="Enter text to read aloud..."
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isReading}/>
        <div className="tsr-btn-row">
          {!isReading ? (
            <button className="tsr-btn" onClick={startReading} disabled={!text.trim()}>
              Start Reading
            </button>
          ) : (
            <button className="tsr-btn" onClick={pauseReading}>Pause</button>
          )}
          <button className="tsr-btn" onClick={resumeReading} disabled={isReading || !text.trim()}>
            Resume
          </button>
        </div>
        <div className="tsr-btn-row-single">
          <button className="tsr-btn" onClick={stopReading} disabled={!isReading && currentIndex === 0}>
            Stop
          </button>
        </div>
        <br/>
        <label className="tsr-speed-label" htmlFor="speedRange">
          Speed: {speed} WPM
        </label>
        <input
          id="speedRange"
          type="range"
          min="50"
          max="300"
          step="10"
          value={speed}
          onChange={handleSpeedChange}
          disabled={isReading}/>
        <br/>
        <div className="tsr-progress">
          <p>
            <strong>Words read:</strong> {currentIndex} / {words.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
}