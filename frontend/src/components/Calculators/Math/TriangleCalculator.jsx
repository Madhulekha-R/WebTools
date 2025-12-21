import React, { useState } from "react";
import "./TriangleCalculator.css";

export default function TriangleCalculator() {
    const [angleC, setAngleC] = useState("60");
    const [sideA, setSideA] = useState("1");
    const [sideB, setSideB] = useState("1");
    const [angleA, setAngleA] = useState("");
    const [angleB, setAngleB] = useState("");
    const [sideC, setSideC] = useState("");
    const [angleUnit, setAngleUnit] = useState("degree");
    const [results, setResults] = useState(null);

    const toRadians = (deg) => (deg * Math.PI) / 180;
    const toDegrees = (rad) => (rad * 180) / Math.PI;

    const calculate = () => {
        // Collect all inputs
        let inputs = {
            angleC: parseFloat(angleC) || null,
            sideA: parseFloat(sideA) || null,
            sideB: parseFloat(sideB) || null,
            angleA: parseFloat(angleA) || null,
            angleB: parseFloat(angleB) || null,
            sideC: parseFloat(sideC) || null,
        };

        // Count non-null values
        const count = Object.values(inputs).filter(v => v !== null).length;
        if (count < 3) {
            alert("Please provide at least 3 values");
            return;
        }

        // Convert angles to radians if in degrees
        let aC = inputs.angleC;
        let aA = inputs.angleA;
        let aB = inputs.angleB;

        if (angleUnit === "degree") {
            if (aC !== null) aC = toRadians(aC);
            if (aA !== null) aA = toRadians(aA);
            if (aB !== null) aB = toRadians(aB);
        }

        let a = inputs.sideA;
        let b = inputs.sideB;
        let c = inputs.sideC;

        // Simple triangle solver (basic cases)
        try {
            // If we have all three sides
            if (a && b && c) {
                // Use law of cosines to find angles
                aC = Math.acos((a * a + b * b - c * c) / (2 * a * b));
                aA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
                aB = Math.PI - aC - aA;
            }
            // If we have two sides and included angle
            else if (a && b && aC !== null) {
                c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(aC));
                aA = Math.asin(a * Math.sin(aC) / c);
                aB = Math.PI - aC - aA;
            }
            else if (b && c && aA !== null) {
                a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(aA));
                aB = Math.asin(b * Math.sin(aA) / a);
                aC = Math.PI - aA - aB;
            }
            else if (a && c && aB !== null) {
                b = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(aB));
                aA = Math.asin(a * Math.sin(aB) / b);
                aC = Math.PI - aA - aB;
            }
            // If we have one side and two angles
            else if (a && aC !== null && aB !== null) {
                aA = Math.PI - aC - aB;
                b = a * Math.sin(aB) / Math.sin(aA);
                c = a * Math.sin(aC) / Math.sin(aA);
            }
            else if (b && aC !== null && aA !== null) {
                aB = Math.PI - aC - aA;
                a = b * Math.sin(aA) / Math.sin(aB);
                c = b * Math.sin(aC) / Math.sin(aB);
            }
            else if (c && aA !== null && aB !== null) {
                aC = Math.PI - aA - aB;
                a = c * Math.sin(aA) / Math.sin(aC);
                b = c * Math.sin(aB) / Math.sin(aC);
            }

            // Convert back to degrees if needed
            let finalAngleC = angleUnit === "degree" ? toDegrees(aC) : aC;
            let finalAngleA = angleUnit === "degree" ? toDegrees(aA) : aA;
            let finalAngleB = angleUnit === "degree" ? toDegrees(aB) : aB;

            setResults({
                sideA: a?.toFixed(4),
                sideB: b?.toFixed(4),
                sideC: c?.toFixed(4),
                angleA: finalAngleA?.toFixed(4),
                angleB: finalAngleB?.toFixed(4),
                angleC: finalAngleC?.toFixed(4),
            });
        } catch (error) {
            alert("Invalid triangle configuration");
        }
    };

    const clear = () => {
        setAngleC("60");
        setSideA("1");
        setSideB("1");
        setAngleA("");
        setAngleB("");
        setSideC("");
        setResults(null);
    };

    return (
        <div className="age-calc-root percent-bg">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">TRIANGLE CALCULATOR</h2>
            </div>

            <div className="age-calc-card percent-card triangle-card">
                <p className="triangle-description-text">
                    Please provide 3 values including at least one side to the following 6 fields, and click the "Calculate" button.
                    When radians are selected as the angle unit, it can take values such as pi/2, pi/4, etc.
                </p>

                <div className="triangle-diagram">
                    <svg viewBox="0 0 400 300" className="triangle-svg">
                        {/* Triangle */}
                        <polygon points="200,50 100,250 300,250" fill="none" stroke="#00ff94" strokeWidth="2" />

                        {/* Vertices labels */}
                        <text x="200" y="40" fill="#00cfff" fontSize="20" fontWeight="bold" textAnchor="middle">C</text>
                        <text x="85" y="265" fill="#00cfff" fontSize="20" fontWeight="bold" textAnchor="middle">A</text>
                        <text x="315" y="265" fill="#00cfff" fontSize="20" fontWeight="bold" textAnchor="middle">B</text>

                        {/* Side labels */}
                        <text x="150" y="160" fill="#21cbca" fontSize="16" textAnchor="middle">side b</text>
                        <text x="250" y="160" fill="#21cbca" fontSize="16" textAnchor="middle">side a</text>
                        <text x="200" y="275" fill="#21cbca" fontSize="16" textAnchor="middle">side c</text>
                    </svg>

                    <div className="triangle-inputs-overlay">
                        <input
                            className="triangle-angle-input triangle-input-c"
                            value={angleC}
                            onChange={(e) => setAngleC(e.target.value)}
                            placeholder="60"
                        />
                        <input
                            className="triangle-side-input triangle-input-b"
                            value={sideB}
                            onChange={(e) => setSideB(e.target.value)}
                            placeholder="1"
                        />
                        <input
                            className="triangle-side-input triangle-input-a"
                            value={sideA}
                            onChange={(e) => setSideA(e.target.value)}
                            placeholder="1"
                        />
                        <input
                            className="triangle-angle-input triangle-input-angle-a"
                            value={angleA}
                            onChange={(e) => setAngleA(e.target.value)}
                            placeholder=""
                        />
                        <input
                            className="triangle-angle-input triangle-input-angle-b"
                            value={angleB}
                            onChange={(e) => setAngleB(e.target.value)}
                            placeholder=""
                        />
                        <input
                            className="triangle-side-input triangle-input-side-c"
                            value={sideC}
                            onChange={(e) => setSideC(e.target.value)}
                            placeholder=""
                        />
                    </div>
                </div>

                <div className="triangle-angle-unit">
                    <label className="rng-label">Angle Unit:</label>
                    <select
                        className="age-input percent-input triangle-select"
                        value={angleUnit}
                        onChange={(e) => setAngleUnit(e.target.value)}
                    >
                        <option value="degree">degree °</option>
                        <option value="radian">radian</option>
                    </select>
                </div>

                {results && (
                    <div className="triangle-results">
                        <h3 className="triangle-results-title">Results:</h3>
                        <div className="triangle-results-grid">
                            <div className="triangle-result-item">
                                <span className="result-label">Side a:</span> {results.sideA}
                            </div>
                            <div className="triangle-result-item">
                                <span className="result-label">Side b:</span> {results.sideB}
                            </div>
                            <div className="triangle-result-item">
                                <span className="result-label">Side c:</span> {results.sideC}
                            </div>
                            <div className="triangle-result-item">
                                <span className="result-label">Angle A:</span> {results.angleA}{angleUnit === "degree" ? "°" : " rad"}
                            </div>
                            <div className="triangle-result-item">
                                <span className="result-label">Angle B:</span> {results.angleB}{angleUnit === "degree" ? "°" : " rad"}
                            </div>
                            <div className="triangle-result-item">
                                <span className="result-label">Angle C:</span> {results.angleC}{angleUnit === "degree" ? "°" : " rad"}
                            </div>
                        </div>
                    </div>
                )}

                <div className="percent-btn-row">
                    <button className="age-calc-btn percent-main-btn" onClick={calculate}>
                        Calculate
                    </button>
                    <button className="age-calc-btn percent-clear-btn" onClick={clear}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}
