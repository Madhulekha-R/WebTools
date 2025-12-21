import React, { useState, useEffect } from 'react';
import './LengthDistance.css';
const units = [
  { label: 'Meter [m]', value: 'meter' },
  { label: 'Kilometer [km]', value: 'kilometer' },
  { label: 'Mile [mi]', value: 'mile' },
  { label: 'Centimeter [cm]', value: 'centimeter' },
  { label: 'Millimeter [mm]', value: 'millimeter' },
  { label: 'Cubit [cubit]', value: 'cubit' },
  { label: 'Micrometer [µm]', value: 'micrometer' },
  { label: 'Yard [yd]', value: 'yard' },
  { label: 'Furlong [fur]', value: 'furlong' },
  { label: 'Light Year [ly]', value: 'lightyear' },
  { label: 'Gigaparsec [Gpc]', value: 'gigaparsec' },
  { label: 'Atom [atom]', value: 'atom' },
  { label: 'Ångström [Å]', value: 'angstrom' },
  { label: 'Chain [ch]', value: 'chain' },
  { label: 'League [lea]', value: 'league' },
  { label: 'Hectometer [hm]', value: 'hectometer' },
  { label: 'Inch [in]', value: 'inch' },
  { label: 'Decimeter [dm]', value: 'decimeter' },
  { label: 'Planck Length [ℓₚ]', value: 'plancklength' },
  { label: 'Foot [ft]', value: 'foot' },
  { label: 'Nanometer [nm]', value: 'nanometer' },
  { label: 'Picometer [pm]', value: 'picometer' },
  { label: 'Football Field [ff]', value: 'footballfield' },
  { label: 'Parsec [pc]', value: 'parsec' },
  { label: 'Step [step]', value: 'step' },
  { label: 'Nautical Mile [nmi]', value: 'nauticalmile' },
  { label: 'Fathom [ftm]', value: 'fathom' },
  { label: 'Rod [rd]', value: 'rod' },
  { label: 'Microinch [µin]', value: 'microinch' },
  { label: 'Megameter [Mm]', value: 'megameter' },
];
const ratesToMeter = {
  meter: 1,
  kilometer: 1000,
  mile: 1609.344,
  centimeter: 0.01,
  millimeter: 0.001,
  cubit: 0.4572,
  micrometer: 1e-6,
  yard: 0.9144,
  furlong: 201.168,
  lightyear: 9.4607e15,
  gigaparsec: 3.0856776e25,
  atom: 1e-10,
  angstrom: 1e-10,
  chain: 20.1168,
  league: 4828,
  hectometer: 100,
  inch: 0.0254,
  decimeter: 0.1,
  plancklength: 1.616255e-35,
  foot: 0.3048,
  nanometer: 1e-9,
  picometer: 1e-12,
  footballfield: 91.44,
  parsec: 3.0856776e16,
  step: 0.762,
  nauticalmile: 1852,
  fathom: 1.8288,
  rod: 5.0292,
  microinch: 2.54e-8,
  megameter: 1e6,
};
function convertDistance(value, from, to, decimals = 3) {
  if (!ratesToMeter[from] || !ratesToMeter[to] || isNaN(value) || value === '') return '';
  let meters = parseFloat(value) * ratesToMeter[from];
  let output = meters / ratesToMeter[to];
  return output.toFixed(decimals);
}
export default function LengthDistance() {
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [decimals, setDecimals] = useState(3);
  const getUnitLabel = (val) => units.find(u => u.value === val)?.label || val;
  useEffect(() => {
    setOutputValue(convertDistance(inputValue, fromUnit, toUnit, decimals));
  }, [inputValue, fromUnit, toUnit, decimals]);
  const handleClear = () => {
    setInputValue('');
    setOutputValue('');
  };
  const handleCopy = () => {
    if (outputValue) navigator.clipboard.writeText(outputValue);
  };
  return (
    <div className="ld-bg">
      <header className="ld-header">
        <span className="ld-logo">Length & Distance Converter</span>
      </header>
      <div className="ld-desc">
        Swap between any unit of distance and length
      </div>
      <div className="ld-main-box">
        <div className="ld-title-row">
          <span className="ld-title-label">
            ({getUnitLabel(fromUnit)} → {getUnitLabel(toUnit)})
          </span>
          <div className="ld-rate-with-select">
            <span className="ld-rate">
              1 {getUnitLabel(fromUnit)} = {convertDistance(1, fromUnit, toUnit, decimals)} {getUnitLabel(toUnit)}
            </span>
            <select
              className="ld-panel-select"
              value={decimals}
              onChange={e => setDecimals(parseInt(e.target.value) || 0)}>
              {[0, 1, 2, 3, 4, 5].map(n =>
                <option key={n} value={n}>{n} Decimals</option>
              )}
            </select>
          </div>
        </div>
        <div className="ld-converter-panels">
          <div className="ld-panel">
            <label className="ld-panel-label">From</label>
            <input
              className="ld-panel-input"
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter Value"/>
            <div className="ld-unit-btns-slim">
              {units.map(u => (
                <button
                  key={u.value}
                  className={`ld-unit-btn${fromUnit === u.value ? " selected" : ""}`}
                  onClick={() => setFromUnit(u.value)}
                  type="button">
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <div className="ld-arrow">&#8646;</div>
          <div className="ld-panel">
            <label className="ld-panel-label">To</label>
            <input
              className="ld-panel-input"
              type="text"
              value={outputValue}
              readOnly
              placeholder="Output"/>
            <div className="ld-unit-btns-slim">
              {units.map(u => (
                <button
                  key={u.value + '-to'}
                  className={`ld-unit-btn${toUnit === u.value ? " selected" : ""}`}
                  onClick={() => setToUnit(u.value)}
                  type="button">
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="ld-panel-btns">
          <button className="ld-panel-btn-main" onClick={handleClear}>Clear</button>
          <button className="ld-panel-btn-main" onClick={handleCopy}>Copy</button>
        </div>
      </div>
      <div className="ld-howto">
        <h2>How to use our free length &amp; distance converter:</h2>
        <ol>
          <li>Select the measurement unit to convert from on the left side of the converter.</li>
          <li>Select the measurement unit to convert to on the right side of the converter.</li>
          <li>Enter the number you want to convert in the left box, where it says "Enter Value".</li>
          <li>Check or copy the result that appears in the right text box.</li>
        </ol>
        <p><b>Decimal Places:</b> To change the amount of decimal places, use the button at the top right under the conversion rate.</p>
        <p><b>Conversion Rate:</b> You can view the conversion rate in the top row of the converter.</p>
        <p><b>Clearing Numbers:</b> To clear your numbers and start again, press the "Clear" button.</p>
      </div>
    </div>
  );
}