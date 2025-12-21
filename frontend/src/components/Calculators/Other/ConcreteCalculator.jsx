import React, { useState } from "react";
import "./ConcreteCalculator.css";

export default function ConcreteCalculator() {
  // Stairs Calculator
  const [stairRun, setStairRun] = useState('12');
  const [stairRise, setStairRise] = useState('6');
  const [stairWidth, setStairWidth] = useState('50');
  const [stairPlatform, setStairPlatform] = useState('5');
  const [stairSteps, setStairSteps] = useState('5');
  const [stairUnit, setStairUnit] = useState('centimeters');
  const [stairResult, setStairResult] = useState(null);

  // Slabs Calculator
  const [slabLength, setSlabLength] = useState('5');
  const [slabWidth, setSlabWidth] = useState('2.5');
  const [slabHeight, setSlabHeight] = useState('5');
  const [slabQuantity, setSlabQuantity] = useState('1');
  const [slabLengthUnit, setSlabLengthUnit] = useState('meters');
  const [slabWidthUnit, setSlabWidthUnit] = useState('meters');
  const [slabHeightUnit, setSlabHeightUnit] = useState('centimeters');
  const [slabResult, setSlabResult] = useState(null);

  // Circular/Holes Calculator
  const [circleDiameter, setCircleDiameter] = useState('2.5');
  const [circleHeight, setCircleHeight] = useState('6');
  const [circleQuantity, setCircleQuantity] = useState('1');
  const [circleDiameterUnit, setCircleDiameterUnit] = useState('meters');
  const [circleHeightUnit, setCircleHeightUnit] = useState('meters');
  const [circleResult, setCircleResult] = useState(null);

  // Circular Slab/Tube Calculator
  const [tubeOuterDiameter, setTubeOuterDiameter] = useState('5');
  const [tubeInnerDiameter, setTubeInnerDiameter] = useState('4');
  const [tubeHeight, setTubeHeight] = useState('6');
  const [tubeQuantity, setTubeQuantity] = useState('1');
  const [tubeOuterUnit, setTubeOuterUnit] = useState('meters');
  const [tubeInnerUnit, setTubeInnerUnit] = useState('meters');
  const [tubeHeightUnit, setTubeHeightUnit] = useState('centimeters');
  const [tubeResult, setTubeResult] = useState(null);

  // Curb & Gutter Calculator
  const [curbDepth, setCurbDepth] = useState('4');
  const [gutterWidth, setGutterWidth] = useState('10');
  const [curbHeight, setCurbHeight] = useState('4');
  const [flagThickness, setFlagThickness] = useState('5');
  const [curbLength, setCurbLength] = useState('10');
  const [curbQuantity, setCurbQuantity] = useState('1');
  const [curbResult, setCurbResult] = useState(null);

  function convertToMeters(value, unit) {
    if (unit === 'meters') return parseFloat(value);
    if (unit === 'centimeters') return parseFloat(value) / 100;
    return parseFloat(value);
  }

  function calculateStairs(e) {
    e.preventDefault();
    const run = convertToMeters(stairRun, stairUnit);
    const rise = convertToMeters(stairRise, stairUnit);
    const width = convertToMeters(stairWidth, stairUnit);
    const platform = convertToMeters(stairPlatform, stairUnit);
    const steps = parseInt(stairSteps);

    const volume = ((run * rise * width * steps) / 2) + (platform * width * rise);
    setStairResult(volume.toFixed(4));
  }

  function calculateSlab(e) {
    e.preventDefault();
    const length = convertToMeters(slabLength, slabLengthUnit);
    const width = convertToMeters(slabWidth, slabWidthUnit);
    const height = convertToMeters(slabHeight, slabHeightUnit);
    const quantity = parseInt(slabQuantity);

    const volume = length * width * height * quantity;
    setSlabResult(volume.toFixed(4));
  }

  function calculateCircle(e) {
    e.preventDefault();
    const diameter = convertToMeters(circleDiameter, circleDiameterUnit);
    const height = convertToMeters(circleHeight, circleHeightUnit);
    const quantity = parseInt(circleQuantity);
    const radius = diameter / 2;

    const volume = Math.PI * radius * radius * height * quantity;
    setCircleResult(volume.toFixed(4));
  }

  function calculateTube(e) {
    e.preventDefault();
    const outerD = convertToMeters(tubeOuterDiameter, tubeOuterUnit);
    const innerD = convertToMeters(tubeInnerDiameter, tubeInnerUnit);
    const height = convertToMeters(tubeHeight, tubeHeightUnit);
    const quantity = parseInt(tubeQuantity);

    const outerRadius = outerD / 2;
    const innerRadius = innerD / 2;
    const volume = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * height * quantity;
    setTubeResult(volume.toFixed(4));
  }

  function calculateCurb(e) {
    e.preventDefault();
    const depth = convertToMeters(curbDepth, 'centimeters');
    const width = convertToMeters(gutterWidth, 'centimeters');
    const height = convertToMeters(curbHeight, 'centimeters');
    const thickness = convertToMeters(flagThickness, 'centimeters');
    const length = convertToMeters(curbLength, 'meters');
    const quantity = parseInt(curbQuantity);

    const volume = ((depth * width) + (height * thickness) + (width * thickness)) * length * quantity;
    setCurbResult(volume.toFixed(4));
  }

  return (
    <div className="concrete-calc-root">
      <h2 className="concrete-calc-main-heading">Concrete Calculator</h2>
      <div className="concrete-calc-intro">
        The Concrete Calculator estimates the volume and weight of concrete necessary to cover a given area. Purchasing slightly more concrete than the estimated result can reduce the probability of having insufficient concrete
      </div>

      {/* STAIRS */}
      <div className="concrete-section">
        <h3 className="concrete-section-heading">Stairs</h3>
        <div className="concrete-calc-card">
          <div className="concrete-card-content">
            <div className="concrete-diagram">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Cpath d='M20 130 L60 130 L60 110 L100 110 L100 90 L140 90 L140 70 L180 70' fill='none' stroke='%2300cfff' stroke-width='2'/%3E%3Ctext x='90' y='20' fill='%2370f4ca' font-size='10'%3EPlatform Depth%3C/text%3E%3Ctext x='160' y='60' fill='%2370f4ca' font-size='10'%3ERun%3C/text%3E%3Ctext x='140' y='130' fill='%2370f4ca' font-size='10'%3ERise%3C/text%3E%3C/svg%3E" alt="Stairs diagram" />
            </div>
            <form onSubmit={calculateStairs} className="concrete-form">
              <div className="concrete-input-row">
                <label className="concrete-label">Run</label>
                <input type="number" step="0.1" value={stairRun} onChange={e => setStairRun(e.target.value)} className="concrete-input" required />
                <select value={stairUnit} onChange={e => setStairUnit(e.target.value)} className="concrete-select">
                  <option value="centimeters">centimeters</option>
                  <option value="meters">meters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Rise</label>
                <input type="number" step="0.1" value={stairRise} onChange={e => setStairRise(e.target.value)} className="concrete-input" required />
                <select value={stairUnit} onChange={e => setStairUnit(e.target.value)} className="concrete-select">
                  <option value="centimeters">centimeters</option>
                  <option value="meters">meters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Width</label>
                <input type="number" step="0.1" value={stairWidth} onChange={e => setStairWidth(e.target.value)} className="concrete-input" required />
                <select value={stairUnit} onChange={e => setStairUnit(e.target.value)} className="concrete-select">
                  <option value="centimeters">centimeters</option>
                  <option value="meters">meters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Platform Depth</label>
                <input type="number" step="0.1" value={stairPlatform} onChange={e => setStairPlatform(e.target.value)} className="concrete-input" required />
                <select value={stairUnit} onChange={e => setStairUnit(e.target.value)} className="concrete-select">
                  <option value="centimeters">centimeters</option>
                  <option value="meters">meters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Number of Steps</label>
                <input type="number" value={stairSteps} onChange={e => setStairSteps(e.target.value)} className="concrete-input-full" required />
              </div>
              <div className="concrete-btn-row">
                <button type="submit" className="concrete-calc-btn">Calculate</button>
                <button type="button" onClick={() => setStairResult(null)} className="concrete-clear-btn">Clear</button>
              </div>
            </form>
            {stairResult && (
              <div className="concrete-result">
                <strong>Volume: {stairResult} m³</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SLABS, SQUARE FOOTINGS, OR WALLS */}
      <div className="concrete-section">
        <h3 className="concrete-section-heading">Slabs, Square Footings, or Walls</h3>
        <div className="concrete-calc-card">
          <div className="concrete-card-content">
            <div className="concrete-diagram-small">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 100'%3E%3Crect x='30' y='30' width='90' height='50' fill='none' stroke='%2300cfff' stroke-width='2' stroke-dasharray='5,5'/%3E%3Ctext x='70' y='20' fill='%2370f4ca' font-size='10'%3El%3C/text%3E%3Ctext x='10' y='60' fill='%2370f4ca' font-size='10'%3Ew%3C/text%3E%3C/svg%3E" alt="Slab diagram" />
            </div>
            <form onSubmit={calculateSlab} className="concrete-form">
              <div className="concrete-input-row">
                <label className="concrete-label">Length (l)</label>
                <input type="number" step="0.1" value={slabLength} onChange={e => setSlabLength(e.target.value)} className="concrete-input" required />
                <select value={slabLengthUnit} onChange={e => setSlabLengthUnit(e.target.value)} className="concrete-select">
                  <option value="meters">meters</option>
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Width (w)</label>
                <input type="number" step="0.1" value={slabWidth} onChange={e => setSlabWidth(e.target.value)} className="concrete-input" required />
                <select value={slabWidthUnit} onChange={e => setSlabWidthUnit(e.target.value)} className="concrete-select">
                  <option value="meters">meters</option>
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Thickness or Height (h)</label>
                <input type="number" step="0.1" value={slabHeight} onChange={e => setSlabHeight(e.target.value)} className="concrete-input" required />
                <select value={slabHeightUnit} onChange={e => setSlabHeightUnit(e.target.value)} className="concrete-select">
                  <option value="centimeters">centimeters</option>
                  <option value="meters">meters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Quantity</label>
                <input type="number" value={slabQuantity} onChange={e => setSlabQuantity(e.target.value)} className="concrete-input-full" required />
              </div>
              <div className="concrete-btn-row">
                <button type="submit" className="concrete-calc-btn">Calculate</button>
                <button type="button" onClick={() => setSlabResult(null)} className="concrete-clear-btn">Clear</button>
              </div>
            </form>
            {slabResult && (
              <div className="concrete-result">
                <strong>Volume: {slabResult} m³</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HOLE, COLUMN, OR ROUND FOOTINGS */}
      <div className="concrete-section">
        <h3 className="concrete-section-heading">Hole, Column, or Round Footings</h3>
        <div className="concrete-calc-card">
          <div className="concrete-card-content">
            <div className="concrete-diagram-small">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'%3E%3Cellipse cx='60' cy='50' rx='40' ry='15' fill='none' stroke='%2300cfff' stroke-width='2'/%3E%3Ctext x='55' y='25' fill='%2370f4ca' font-size='10'%3Ed%3C/text%3E%3C/svg%3E" alt="Circle diagram" />
            </div>
            <form onSubmit={calculateCircle} className="concrete-form">
              <div className="concrete-input-row">
                <label className="concrete-label">Diameter (d)</label>
                <input type="number" step="0.1" value={circleDiameter} onChange={e => setCircleDiameter(e.target.value)} className="concrete-input" required />
                <select value={circleDiameterUnit} onChange={e => setCircleDiameterUnit(e.target.value)} className="concrete-select">
                  <option value="meters">meters</option>
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Depth or Height (h)</label>
                <input type="number" step="0.1" value={circleHeight} onChange={e => setCircleHeight(e.target.value)} className="concrete-input" required />
                <select value={circleHeightUnit} onChange={e => setCircleHeightUnit(e.target.value)} className="concrete-select">
                  <option value="meters">meters</option>
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Quantity</label>
                <input type="number" value={circleQuantity} onChange={e => setCircleQuantity(e.target.value)} className="concrete-input-full" required />
              </div>
              <div className="concrete-btn-row">
                <button type="submit" className="concrete-calc-btn">Calculate</button>
                <button type="button" onClick={() => setCircleResult(null)} className="concrete-clear-btn">Clear</button>
              </div>
            </form>
            {circleResult && (
              <div className="concrete-result">
                <strong>Volume: {circleResult} m³</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CIRCULAR SLAB OR TUBE */}
      <div className="concrete-section">
        <h3 className="concrete-section-heading">Circular Slab or Tube</h3>
        <div className="concrete-calc-card">
          <div className="concrete-card-content">
            <form onSubmit={calculateTube} className="concrete-form">
              <div className="concrete-input-row">
                <label className="concrete-label">Outer Diameter (d₁)</label>
                <input type="number" step="0.1" value={tubeOuterDiameter} onChange={e => setTubeOuterDiameter(e.target.value)} className="concrete-input" required />
                <select value={tubeOuterUnit} onChange={e => setTubeOuterUnit(e.target.value)} className="concrete-select">
                  <option value="meters">meters</option>
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Inner Diameter (d₂)</label>
                <input type="number" step="0.1" value={tubeInnerDiameter} onChange={e => setTubeInnerDiameter(e.target.value)} className="concrete-input" required />
                <select value={tubeInnerUnit} onChange={e => setTubeInnerUnit(e.target.value)} className="concrete-select">
                  <option value="meters">meters</option>
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Length or Height (h)</label>
                <input type="number" step="0.1" value={tubeHeight} onChange={e => setTubeHeight(e.target.value)} className="concrete-input" required />
                <select value={tubeHeightUnit} onChange={e => setTubeHeightUnit(e.target.value)} className="concrete-select">
                  <option value="centimeters">centimeters</option>
                  <option value="meters">meters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Quantity</label>
                <input type="number" value={tubeQuantity} onChange={e => setTubeQuantity(e.target.value)} className="concrete-input-full" required />
              </div>
              <div className="concrete-btn-row">
                <button type="submit" className="concrete-calc-btn">Calculate</button>
                <button type="button" onClick={() => setTubeResult(null)} className="concrete-clear-btn">Clear</button>
              </div>
            </form>
            {tubeResult && (
              <div className="concrete-result">
                <strong>Volume: {tubeResult} m³</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CURB AND GUTTER BARRIER */}
      <div className="concrete-section">
        <h3 className="concrete-section-heading">Curb and Gutter Barrier</h3>
        <div className="concrete-calc-card">
          <div className="concrete-card-content">
            <form onSubmit={calculateCurb} className="concrete-form">
              <div className="concrete-input-row">
                <label className="concrete-label">Curb Depth</label>
                <input type="number" step="0.1" value={curbDepth} onChange={e => setCurbDepth(e.target.value)} className="concrete-input" required />
                <select className="concrete-select">
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Gutter Width</label>
                <input type="number" step="0.1" value={gutterWidth} onChange={e => setGutterWidth(e.target.value)} className="concrete-input" required />
                <select className="concrete-select">
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Curb Height</label>
                <input type="number" step="0.1" value={curbHeight} onChange={e => setCurbHeight(e.target.value)} className="concrete-input" required />
                <select className="concrete-select">
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Flag Thickness</label>
                <input type="number" step="0.1" value={flagThickness} onChange={e => setFlagThickness(e.target.value)} className="concrete-input" required />
                <select className="concrete-select">
                  <option value="centimeters">centimeters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Length</label>
                <input type="number" step="0.1" value={curbLength} onChange={e => setCurbLength(e.target.value)} className="concrete-input" required />
                <select className="concrete-select">
                  <option value="meters">meters</option>
                </select>
              </div>
              <div className="concrete-input-row">
                <label className="concrete-label">Quantity</label>
                <input type="number" value={curbQuantity} onChange={e => setCurbQuantity(e.target.value)} className="concrete-input-full" required />
              </div>
              <div className="concrete-btn-row">
                <button type="submit" className="concrete-calc-btn">Calculate</button>
                <button type="button" onClick={() => setCurbResult(null)} className="concrete-clear-btn">Clear</button>
              </div>
            </form>
            {curbResult && (
              <div className="concrete-result">
                <strong>Volume: {curbResult} m³</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDUCATIONAL CONTENT */}
      <div className="concrete-content">
        <p>Concrete is a material comprised of a number of coarse aggregates (particulate materials such as sand, gravel, crushed stone, and slag) bonded with cement. Cement is a substance that is used to bind materials, such as aggregate, by adhering to said materials, then hardening over time. While there are many types of cement, Portland cement is the most commonly used cement, and is an ingredient in concrete, mortar, and plasters.</p>
        
        <p>Concrete can be purchased in multiple forms, including in 60 or 80-pound bags, or delivered in large amounts by specialized concrete mixer trucks. Proper mixing is essential for the production of strong, uniform concrete. It involves mixing water, aggregate, cement, and any desired additives. Production of concrete is time-sensitive, and the concrete must be placed before it hardens since it is usually prepared as a viscous fluid. Some concretes are even designed to harden more quickly for applications that require rapid set time. Alternatively, in some factory settings, concrete is mixed into dryer forms to manufacture precast concrete products such as concrete walls.</p>
        
        <p>The process of concrete hardening once it has been placed is called curing, and is a slow process. It typically takes concrete around four weeks to reach over 90% of its final strength, and the strengthening can continue for up to three years. Ensuring that the concrete is damp can increase the strength of the concrete during the early stages of curing. This is achieved through techniques such as spraying concrete slabs with compounds that create a film over the concrete that retains water, as well as ponding, where concrete is submerged in water and wrapped in plastic.</p>
      </div>
    </div>
  );
}
