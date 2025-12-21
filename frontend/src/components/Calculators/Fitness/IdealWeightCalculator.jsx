import React, { useState } from "react";
import "./IdealWeightCalculator.css";

export default function IdealWeightCalculator() {
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState("male");
    const [height, setHeight] = useState(180);
    const [result, setResult] = useState(null);

    function handleCalculate(e) {
        e.preventDefault();
        if (!height) return;

        const heightInches = height / 2.54;

        let robinson, miller, devine, hamwi;

        if (gender === "male") {
            robinson = 52 + 1.9 * (heightInches - 60);
            miller = 56.2 + 1.41 * (heightInches - 60);
            devine = 50 + 2.3 * (heightInches - 60);
            hamwi = 48 + 2.7 * (heightInches - 60);
        } else {
            robinson = 49 + 1.7 * (heightInches - 60);
            miller = 53.1 + 1.36 * (heightInches - 60);
            devine = 45.5 + 2.3 * (heightInches - 60);
            hamwi = 45.5 + 2.2 * (heightInches - 60);
        }

        // Calculate healthy BMI range (18.5 - 25)
        const heightMeters = height / 100;
        const minHealthyWeight = 18.5 * (heightMeters ** 2);
        const maxHealthyWeight = 25 * (heightMeters ** 2);

        setResult({
            robinson: robinson.toFixed(1),
            miller: miller.toFixed(1),
            devine: devine.toFixed(1),
            hamwi: hamwi.toFixed(1),
            healthyRange: `${minHealthyWeight.toFixed(1)} - ${maxHealthyWeight.toFixed(1)}`
        });
    }

    function handleClear() {
        setAge(25);
        setGender("male");
        setHeight(180);
        setResult(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">IDEAL WEIGHT CALCULATOR</h2>
                <div className="age-calc-subheading">
                    The Ideal Weight Calculator computes ideal body weight (IBW) ranges based on height, gender, and age
                </div>
            </div>

            <form className={`age-calc-card idealweight-expanded${result !== null ? " with-results" : ""}`} onSubmit={handleCalculate}>
                <div className="age-calc-card-content">
                    <label className="age-label">Age</label>
                    <input className="age-input" type="number" value={age} min={2} max={80} onChange={e => setAge(e.target.value)} />

                    <label className="age-label" style={{ marginTop: 12 }}>Gender</label>
                    <div style={{ marginBottom: 19 }}>
                        <label style={{ color: "#b0b3b8", marginRight: 14 }}>
                            <input type="radio" checked={gender === "male"} onChange={() => setGender("male")} /> Male
                        </label>
                        <label style={{ color: "#b0b3b8" }}>
                            <input type="radio" checked={gender === "female"} onChange={() => setGender("female")} /> Female
                        </label>
                    </div>

                    <label className="age-label">Height (cm)</label>
                    <input className="age-input" type="number" value={height} min={120} max={250} onChange={e => setHeight(e.target.value)} />

                    <button type="submit" className="age-calc-btn" style={{ marginTop: 10 }}>Calculate</button>
                    <button type="button" className="age-calc-btn" style={{ marginTop: 10, background: "#6c757d", color: "#fff", marginLeft: "7px" }} onClick={handleClear}>Clear</button>
                </div>

                {result !== null && (
                    <div className="idealweight-results">
                        <div className="idealweight-main-result">
                            <h3 className="idealweight-result-title">The ideal weight based on popular formulas:</h3>
                        </div>

                        <div className="idealweight-formula-section">
                            <table className="idealweight-formula-table">
                                <thead>
                                    <tr>
                                        <th>Formula</th>
                                        <th>Ideal Weight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Robinson (1983)</td>
                                        <td className="idealweight-value">{result.robinson} kg</td>
                                    </tr>
                                    <tr>
                                        <td>Miller (1983)</td>
                                        <td className="idealweight-value">{result.miller} kg</td>
                                    </tr>
                                    <tr>
                                        <td>Devine (1974)</td>
                                        <td className="idealweight-value">{result.devine} kg</td>
                                    </tr>
                                    <tr>
                                        <td>Hamwi (1964)</td>
                                        <td className="idealweight-value">{result.hamwi} kg</td>
                                    </tr>
                                    <tr className="idealweight-highlight">
                                        <td><b>Healthy BMI Range</b></td>
                                        <td className="idealweight-value"><b>{result.healthyRange} kg</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </form>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: "#00ff94", marginBottom: "1rem" }}>About Ideal Weight</h3>
                <p>
                    The idea of finding the IBW using a formula has been sought after by many experts for a long time. Currently, there persist several popular formulas, and our Ideal Weight Calculator provides their results for side-to-side comparisons.
                </p>

                <h4 style={{ color: "#00cfff", marginTop: "1.5rem", marginBottom: "0.8rem" }}>The Formulas</h4>
                <p>
                    <b>Robinson Formula (1983):</b> One of the most widely used formulas, developed for estimating drug dosages.<br />
                    <b>Miller Formula (1983):</b> A modification of the Devine formula.<br />
                    <b>Devine Formula (1974):</b> Originally developed for medicinal dosage purposes.<br />
                    <b>Hamwi Formula (1964):</b> Initially used for meal planning purposes.
                </p>
                <p style={{ marginTop: "1rem" }}>
                    The <b>Healthy BMI Range</b> shows the weight range that corresponds to a BMI between 18.5 and 25, which is considered healthy for most adults.
                </p>
            </div>
        </div>
    );
}
