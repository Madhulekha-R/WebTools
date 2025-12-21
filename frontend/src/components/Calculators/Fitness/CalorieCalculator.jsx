import React, { useState } from "react";
import "./CalorieCalculator.css";

export default function CalorieCalculator() {
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState("male");
    const [height, setHeight] = useState(180);
    const [weight, setWeight] = useState(70);
    const [activity, setActivity] = useState("moderate");
    const [bodyFat, setBodyFat] = useState("");
    const [formula, setFormula] = useState("mifflin");
    const [result, setResult] = useState(null);

    const activityLevels = {
        sedentary: { label: "Sedentary: little or no exercise", multiplier: 1.2 },
        light: { label: "Light: exercise 1-3 times/week", multiplier: 1.375 },
        moderate: { label: "Moderate: exercise 4-5 times/week", multiplier: 1.55 },
        active: { label: "Active: daily exercise or intense exercise 3-4 times/week", multiplier: 1.725 },
        veryActive: { label: "Very Active: intense exercise 6-7 times/week", multiplier: 1.9 }
    };

    function calculateBMR(formula) {
        let bmr;

        if (formula === "mifflin") {
            // Mifflin-St Jeor Equation (most accurate)
            if (gender === "male") {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
        } else if (formula === "harris") {
            // Revised Harris-Benedict Equation
            if (gender === "male") {
                bmr = 13.397 * weight + 4.799 * height - 5.677 * age + 88.362;
            } else {
                bmr = 9.247 * weight + 3.098 * height - 4.330 * age + 447.593;
            }
        } else if (formula === "katch") {
            // Katch-McArdle Formula (requires body fat %)
            if (!bodyFat) return null;
            const leanBodyMass = weight * (1 - bodyFat / 100);
            bmr = 370 + 21.6 * leanBodyMass;
        }

        return bmr;
    }

    function calculateZigzag(maintenance) {
        // Zigzag calorie cycling to prevent metabolic adaptation
        return {
            day1: Math.round(maintenance),           // Maintenance
            day2: Math.round(maintenance * 0.8),     // -20%
            day3: Math.round(maintenance * 0.6),     // -40%
            day4: Math.round(maintenance),           // Maintenance
            day5: Math.round(maintenance * 0.8),     // -20%
            day6: Math.round(maintenance * 0.6),     // -40%
            day7: Math.round(maintenance)            // Maintenance
        };
    }

    function calculateMacros(calories) {
        // Standard macronutrient distribution
        const protein = Math.round((calories * 0.30) / 4);  // 30% protein (4 cal/g)
        const carbs = Math.round((calories * 0.40) / 4);    // 40% carbs (4 cal/g)
        const fats = Math.round((calories * 0.30) / 9);     // 30% fats (9 cal/g)

        return { protein, carbs, fats };
    }

    function handleCalculate(e) {
        e.preventDefault();
        if (!age || !height || !weight) return;

        if (formula === "katch" && !bodyFat) {
            alert("Body fat percentage is required for Katch-McArdle formula");
            return;
        }

        const bmr = calculateBMR(formula);
        if (!bmr) return;

        const maintenance = Math.round(bmr * activityLevels[activity].multiplier);

        // Weight loss targets
        const mildWeightLoss = Math.round(maintenance - 250);      // 0.25 kg/week
        const weightLoss = Math.round(maintenance - 500);          // 0.5 kg/week
        const extremeWeightLoss = Math.round(maintenance - 1000);  // 1 kg/week

        // Weight gain targets
        const mildWeightGain = Math.round(maintenance + 250);      // 0.25 kg/week
        const weightGain = Math.round(maintenance + 500);          // 0.5 kg/week
        const extremeWeightGain = Math.round(maintenance + 1000);  // 1 kg/week

        // Zigzag calorie cycling
        const zigzag = calculateZigzag(weightLoss);

        // Macronutrient breakdown for maintenance
        const macros = calculateMacros(maintenance);

        setResult({
            bmr: Math.round(bmr),
            maintenance,
            mildWeightLoss,
            weightLoss,
            extremeWeightLoss,
            mildWeightGain,
            weightGain,
            extremeWeightGain,
            zigzag,
            macros
        });
    }

    function handleClear() {
        setAge(25);
        setGender("male");
        setHeight(180);
        setWeight(70);
        setActivity("moderate");
        setBodyFat("");
        setFormula("mifflin");
        setResult(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">CALORIE CALCULATOR</h2>
                <div className="age-calc-subheading">
                    Calculate your daily calorie requirements based on your activity level
                </div>
            </div>

            <form className={`age-calc-card calorie-expanded${result !== null ? " with-results" : ""}`} onSubmit={handleCalculate}>
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

                    <label className="age-label">BMR Formula</label>
                    <select className="age-input" value={formula} onChange={e => setFormula(e.target.value)}>
                        <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
                        <option value="harris">Revised Harris-Benedict</option>
                        <option value="katch">Katch-McArdle (requires body fat %)</option>
                    </select>

                    {formula === "katch" && (
                        <>
                            <label className="age-label">Body Fat (%)</label>
                            <input className="age-input" type="number" step="0.1" value={bodyFat} min={5} max={50} onChange={e => setBodyFat(e.target.value)} placeholder="Optional for other formulas" />
                        </>
                    )}

                    <label className="age-label">Activity Level</label>
                    <select className="age-input" value={activity} onChange={e => setActivity(e.target.value)}>
                        {Object.entries(activityLevels).map(([key, val]) => (
                            <option key={key} value={key}>{val.label}</option>
                        ))}
                    </select>

                    <button type="submit" className="age-calc-btn" style={{ marginTop: 10 }}>Calculate</button>
                    <button type="button" className="age-calc-btn" style={{ marginTop: 10, background: "#6c757d", color: "#fff", marginLeft: "7px" }} onClick={handleClear}>Clear</button>
                </div>

                {result !== null && (
                    <div className="calorie-results">
                        <div className="calorie-section">
                            <h3 className="calorie-section-title">Daily Calorie Needs</h3>
                            <div className="age-result">
                                <div><span className="result-label">BMR (Basal Metabolic Rate):</span> {result.bmr} calories/day</div>
                                <div><span className="result-label">Maintenance:</span> {result.maintenance} calories/day</div>
                            </div>
                        </div>

                        <div className="calorie-section">
                            <h3 className="calorie-section-title">Weight Loss</h3>
                            <div className="age-result">
                                <div><span className="result-label">Mild (0.25 kg/week):</span> {result.mildWeightLoss} cal/day</div>
                                <div><span className="result-label">Moderate (0.5 kg/week):</span> {result.weightLoss} cal/day</div>
                                <div><span className="result-label">Extreme (1 kg/week):</span> {result.extremeWeightLoss} cal/day</div>
                            </div>
                        </div>

                        <div className="calorie-section">
                            <h3 className="calorie-section-title">Weight Gain</h3>
                            <div className="age-result">
                                <div><span className="result-label">Mild (0.25 kg/week):</span> {result.mildWeightGain} cal/day</div>
                                <div><span className="result-label">Moderate (0.5 kg/week):</span> {result.weightGain} cal/day</div>
                                <div><span className="result-label">Extreme (1 kg/week):</span> {result.extremeWeightGain} cal/day</div>
                            </div>
                        </div>

                        <div className="calorie-section">
                            <h3 className="calorie-section-title">Macronutrient Breakdown (at Maintenance)</h3>
                            <div className="age-result">
                                <div><span className="result-label">Protein (30%):</span> {result.macros.protein}g/day</div>
                                <div><span className="result-label">Carbohydrates (40%):</span> {result.macros.carbs}g/day</div>
                                <div><span className="result-label">Fats (30%):</span> {result.macros.fats}g/day</div>
                            </div>
                        </div>

                        <div className="calorie-section">
                            <h3 className="calorie-section-title">Zigzag Calorie Cycling (for Weight Loss)</h3>
                            <p style={{ color: "#b0b3b8", fontSize: "0.95rem", marginBottom: "1rem" }}>
                                Alternating calorie intake prevents metabolic adaptation and plateaus
                            </p>
                            <table className="zigzag-table">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Calories</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>Monday</td><td>{result.zigzag.day1}</td></tr>
                                    <tr><td>Tuesday</td><td>{result.zigzag.day2}</td></tr>
                                    <tr><td>Wednesday</td><td>{result.zigzag.day3}</td></tr>
                                    <tr><td>Thursday</td><td>{result.zigzag.day4}</td></tr>
                                    <tr><td>Friday</td><td>{result.zigzag.day5}</td></tr>
                                    <tr><td>Saturday</td><td>{result.zigzag.day6}</td></tr>
                                    <tr><td>Sunday</td><td>{result.zigzag.day7}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </form>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: "#00ff94", marginBottom: "1rem" }}>About This Calculator</h3>
                <p>
                    This calorie calculator is based on several equations, and the results are based on an estimated average. The <b>Mifflin-St Jeor Equation</b> is considered the most accurate equation for calculating BMR with the exception that the Katch-McArdle Formula can be more accurate for people who are leaner and know their body fat percentage.
                </p>

                <h3 style={{ color: "#00ff94", marginTop: "2rem", marginBottom: "1rem" }}>Calorie Counting as a Means for Weight Loss</h3>
                <p>
                    Calorie counting with the intent of losing weight, on its simplest levels, can be broken down into a few general steps:
                </p>
                <ol style={{ color: "#b0b3b8", lineHeight: "1.8" }}>
                    <li>Determine your BMR using one of the provided equations</li>
                    <li>Multiply your BMR by the appropriate activity factor to determine your daily calorie needs</li>
                    <li>To lose weight, reduce your daily calories by 500-1000 (0.5-1 kg per week)</li>
                    <li>Track your food intake and adjust as necessary</li>
                </ol>

                <h3 style={{ color: "#00ff94", marginTop: "2rem", marginBottom: "1rem" }}>Zigzag Calorie Cycling</h3>
                <p>
                    Zigzag calorie cycling is a weight loss approach that involves alternating the number of calories consumed on a given day. A person on a zigzag diet should have a combination of high-calorie and low-calorie days to meet the same overall weekly calorie target. This prevents the body from adapting to a lower calorie intake and helps avoid weight loss plateaus.
                </p>

                <h3 style={{ color: "#00ff94", marginTop: "2rem", marginBottom: "1rem" }}>Important Considerations</h3>
                <p>
                    <b>It is important to remember that proper diet and exercise is largely accepted as the best way to lose weight.</b> It is inadvisable to lower calorie intake by more than 1,000 calories per day, as losing more than 2 pounds per week can be unhealthy, and can result in the opposite effect in the near future by reducing metabolism.
                </p>
                <p>
                    The body does not require many calories to simply survive. However, consuming too few calories results in the body functioning poorly. Harvard Health Publications suggests women get at least 1,200 calories and men get at least 1,500 calories a day unless supervised by doctors.
                </p>
            </div>
        </div>
    );
}
