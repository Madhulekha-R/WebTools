import React, { useState } from "react";
import "./BodyFatCalculator.css";

export default function BodyFatCalculator() {
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState("male");
    const [height, setHeight] = useState(178);
    const [weight, setWeight] = useState(70);
    const [neck, setNeck] = useState(37);
    const [waist, setWaist] = useState(85);
    const [hip, setHip] = useState(95);
    const [result, setResult] = useState(null);

    function getBodyFatCategory(bf, isMale) {
        if (isMale) {
            if (bf < 6) return { category: "Essential Fat", color: "#8B0000" };
            if (bf < 14) return { category: "Athletes", color: "#FF6B6B" };
            if (bf < 18) return { category: "Fitness", color: "#4CAF50" };
            if (bf < 25) return { category: "Average", color: "#FFA726" };
            return { category: "Obese", color: "#D32F2F" };
        } else {
            if (bf < 14) return { category: "Essential Fat", color: "#8B0000" };
            if (bf < 21) return { category: "Athletes", color: "#FF6B6B" };
            if (bf < 25) return { category: "Fitness", color: "#4CAF50" };
            if (bf < 32) return { category: "Average", color: "#FFA726" };
            return { category: "Obese", color: "#D32F2F" };
        }
    }

    function getIdealBodyFat(age, isMale) {
        // Jackson & Pollock ideal body fat percentages
        const idealTable = {
            male: {
                20: 8.5, 25: 10.5, 30: 12.7, 35: 13.7, 40: 15.3,
                45: 16.4, 50: 18.9, 55: 20.9
            },
            female: {
                20: 17.7, 25: 18.4, 30: 19.3, 35: 21.5, 40: 22.2,
                45: 22.9, 50: 25.2, 55: 26.3
            }
        };

        const table = isMale ? idealTable.male : idealTable.female;

        // Find closest age
        let closestAge = 20;
        let minDiff = Math.abs(age - 20);

        for (let ageKey in table) {
            const diff = Math.abs(age - parseInt(ageKey));
            if (diff < minDiff) {
                minDiff = diff;
                closestAge = parseInt(ageKey);
            }
        }

        return table[closestAge];
    }

    function calculateBMIBodyFat(bmi, age, isMale) {
        // Deurenberg formula for body fat from BMI
        if (isMale) {
            return 1.20 * bmi + 0.23 * age - 16.2;
        } else {
            return 1.20 * bmi + 0.23 * age - 5.4;
        }
    }

    function handleCalculate(e) {
        e.preventDefault();
        if (!height || !weight || !neck || !waist) return;
        if (gender === "female" && !hip) return;

        // US Navy Method
        let bodyFatNavy;
        if (gender === "male") {
            bodyFatNavy = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            bodyFatNavy = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }

        const categoryInfo = getBodyFatCategory(bodyFatNavy, gender === "male");
        const fatMass = (bodyFatNavy / 100) * weight;
        const leanMass = weight - fatMass;

        // Calculate ideal body fat
        const idealBodyFat = getIdealBodyFat(age, gender === "male");
        const bodyFatToLose = Math.max(0, fatMass - (weight * idealBodyFat / 100));

        // Calculate BMI method body fat
        const bmi = weight / ((height / 100) ** 2);
        const bodyFatBMI = calculateBMIBodyFat(bmi, age, gender === "male");

        setResult({
            bodyFat: bodyFatNavy.toFixed(1),
            category: categoryInfo.category,
            categoryColor: categoryInfo.color,
            fatMass: fatMass.toFixed(1),
            leanMass: leanMass.toFixed(1),
            idealBodyFat: idealBodyFat.toFixed(1),
            bodyFatToLose: bodyFatToLose.toFixed(1),
            bodyFatBMI: bodyFatBMI.toFixed(1)
        });
    }

    function handleClear() {
        setAge(25);
        setGender("male");
        setHeight(178);
        setWeight(70);
        setNeck(37);
        setWaist(85);
        setHip(95);
        setResult(null);
    }

    // Calculate position for indicator on the bar
    const getIndicatorPosition = () => {
        if (!result) return 0;
        const bf = parseFloat(result.bodyFat);
        const isMale = gender === "male";

        if (isMale) {
            if (bf < 2) return 2;
            if (bf > 32) return 98;
            return ((bf - 2) / 30) * 100;
        } else {
            if (bf < 10) return 2;
            if (bf > 40) return 98;
            return ((bf - 10) / 30) * 100;
        }
    };

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">BODY FAT CALCULATOR</h2>
                <div className="age-calc-subheading">
                    Estimate your body fat percentage using the U.S. Navy method
                </div>
            </div>

            <form className={`age-calc-card bodyfat-expanded${result !== null ? " with-results" : ""}`} onSubmit={handleCalculate}>
                <div className="age-calc-card-content">
                    <label className="age-label">Age</label>
                    <input className="age-input" type="number" value={age} min={15} max={80} onChange={e => setAge(e.target.value)} />

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

                    <label className="age-label">Weight (kg)</label>
                    <input className="age-input" type="number" value={weight} min={30} max={300} onChange={e => setWeight(e.target.value)} />

                    <label className="age-label">Neck (cm)</label>
                    <input className="age-input" type="number" value={neck} min={20} max={60} onChange={e => setNeck(e.target.value)} />

                    <label className="age-label">Waist (cm)</label>
                    <input className="age-input" type="number" value={waist} min={40} max={200} onChange={e => setWaist(e.target.value)} />

                    {gender === "female" && (
                        <>
                            <label className="age-label">Hip (cm)</label>
                            <input className="age-input" type="number" value={hip} min={50} max={200} onChange={e => setHip(e.target.value)} />
                        </>
                    )}

                    <button type="submit" className="age-calc-btn" style={{ marginTop: 10 }}>Calculate</button>
                    <button type="button" className="age-calc-btn" style={{ marginTop: 10, background: "#6c757d", color: "#fff", marginLeft: "7px" }} onClick={handleClear}>Clear</button>
                </div>

                {result !== null && (
                    <div className="bodyfat-results">
                        <div className="bodyfat-main-result">
                            <h3 className="bodyfat-result-title">Body Fat: {result.bodyFat}%</h3>

                            <div className="bodyfat-bar">
                                <div className="bodyfat-bar-segment essential"></div>
                                <div className="bodyfat-bar-segment athletes"></div>
                                <div className="bodyfat-bar-segment fitness"></div>
                                <div className="bodyfat-bar-segment average"></div>
                                <div className="bodyfat-bar-segment obese"></div>
                                <div className="bodyfat-indicator" style={{ left: `${getIndicatorPosition()}%` }}>
                                    <div className="bodyfat-indicator-arrow"></div>
                                </div>
                            </div>

                            <div className="bodyfat-bar-labels">
                                <span>Essential</span>
                                <span>Athletes</span>
                                <span>Fitness</span>
                                <span>Average</span>
                                <span>Obese</span>
                            </div>
                        </div>

                        <div className="bodyfat-details">
                            <table className="bodyfat-table">
                                <tbody>
                                    <tr>
                                        <td>Body Fat (U.S. Navy Method)</td>
                                        <td className="bodyfat-value">{result.bodyFat}%</td>
                                    </tr>
                                    <tr>
                                        <td>Body Fat Category</td>
                                        <td className="bodyfat-value">{result.category}</td>
                                    </tr>
                                    <tr>
                                        <td>Body Fat Mass</td>
                                        <td className="bodyfat-value">{result.fatMass} kg</td>
                                    </tr>
                                    <tr>
                                        <td>Lean Body Mass</td>
                                        <td className="bodyfat-value">{result.leanMass} kg</td>
                                    </tr>
                                    <tr>
                                        <td>Ideal Body Fat for Given Age (Jackson & Pollock)</td>
                                        <td className="bodyfat-value">{result.idealBodyFat}%</td>
                                    </tr>
                                    <tr>
                                        <td>Body Fat to Lose to Reach Ideal</td>
                                        <td className="bodyfat-value">{result.bodyFatToLose} kg</td>
                                    </tr>
                                    <tr>
                                        <td>Body Fat (BMI method)</td>
                                        <td className="bodyfat-value">{result.bodyFatBMI}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </form>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: "#00ff94", marginBottom: "1rem" }}>Body Fat Categorization</h3>

                <h4 style={{ color: "#00cfff", marginTop: "1.5rem", marginBottom: "0.8rem" }}>The American Council on Exercise Body Fat Categorization</h4>
                <table className="reference-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Women</th>
                            <th>Men</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Essential fat</td><td>10-13%</td><td>2-5%</td></tr>
                        <tr><td>Athletes</td><td>14-20%</td><td>6-13%</td></tr>
                        <tr><td>Fitness</td><td>21-24%</td><td>14-17%</td></tr>
                        <tr><td>Average</td><td>25-31%</td><td>18-24%</td></tr>
                        <tr><td>Obese</td><td>32%+</td><td>25%+</td></tr>
                    </tbody>
                </table>

                <h4 style={{ color: "#00cfff", marginTop: "2rem", marginBottom: "0.8rem" }}>Jackson & Pollock Ideal Body Fat Percentages</h4>
                <table className="reference-table">
                    <thead>
                        <tr>
                            <th>Age</th>
                            <th>Women</th>
                            <th>Men</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>20</td><td>17.7%</td><td>8.5%</td></tr>
                        <tr><td>25</td><td>18.4%</td><td>10.5%</td></tr>
                        <tr><td>30</td><td>19.3%</td><td>12.7%</td></tr>
                        <tr><td>35</td><td>21.5%</td><td>13.7%</td></tr>
                        <tr><td>40</td><td>22.2%</td><td>15.3%</td></tr>
                        <tr><td>45</td><td>22.9%</td><td>16.4%</td></tr>
                        <tr><td>50</td><td>25.2%</td><td>18.9%</td></tr>
                        <tr><td>55</td><td>26.3%</td><td>20.9%</td></tr>
                    </tbody>
                </table>

                <h3 style={{ color: "#00ff94", marginTop: "2rem", marginBottom: "1rem" }}>About This Calculator</h3>
                <p>
                    This calculator uses the <b>U.S. Navy Circumference Method</b> to estimate body fat percentage. It requires measurements of your neck, waist, and (for females) hip circumferences along with your height. This method has been shown to be reasonably accurate for most people.
                </p>
                <p style={{ marginTop: "1rem" }}>
                    The calculator also provides a comparison using the <b>BMI method</b> (Deurenberg formula), which estimates body fat based on BMI and age. While less accurate than the Navy method, it provides a useful reference point.
                </p>
            </div>
        </div>
    );
}
