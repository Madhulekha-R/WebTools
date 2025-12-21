import React, { useState } from "react";
import "./BMRCalculator.css";

export default function BMRCalculator() {
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState("male");
    const [height, setHeight] = useState(180);
    const [weight, setWeight] = useState(60);
    const [result, setResult] = useState(null);

    const activityLevels = [
        { label: "Sedentary: little or no exercise", multiplier: 1.2 },
        { label: "Exercise 1-3 times/week", multiplier: 1.375 },
        { label: "Exercise 4-5 times/week", multiplier: 1.55 },
        { label: "Daily exercise or intense exercise 3-4 times/week", multiplier: 1.725 },
        { label: "Intense exercise 6-7 times/week", multiplier: 1.9 },
        { label: "Very intense exercise daily, or physical job", multiplier: 2.0 }
    ];

    function handleCalculate(e) {
        e.preventDefault();
        if (!age || !height || !weight) return;

        // Mifflin-St Jeor Equation
        let bmr;
        if (gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Calculate calories for each activity level
        const activityCalories = activityLevels.map(level => ({
            label: level.label,
            calories: Math.round(bmr * level.multiplier)
        }));

        setResult({
            bmr: Math.round(bmr),
            activityCalories
        });
    }

    function handleClear() {
        setAge(25);
        setGender("male");
        setHeight(180);
        setWeight(60);
        setResult(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">BMR CALCULATOR</h2>
                <div className="age-calc-subheading">
                    The Basal Metabolic Rate (BMR) Calculator estimates your basal metabolic rate—the amount of energy expended while at rest
                </div>
            </div>

            <form className={`age-calc-card bmr-expanded${result !== null ? " with-results" : ""}`} onSubmit={handleCalculate}>
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

                    <button type="submit" className="age-calc-btn" style={{ marginTop: 10 }}>Calculate</button>
                    <button type="button" className="age-calc-btn" style={{ marginTop: 10, background: "#6c757d", color: "#fff", marginLeft: "7px" }} onClick={handleClear}>Clear</button>
                </div>

                {result !== null && (
                    <div className="bmr-results">
                        <div className="bmr-main-result">
                            <h3 className="bmr-result-title">BMR = {result.bmr} Calories/day</h3>
                        </div>

                        <div className="bmr-activity-section">
                            <h4 className="bmr-section-subtitle">Daily calorie needs based on activity level</h4>
                            <table className="bmr-activity-table">
                                <thead>
                                    <tr>
                                        <th>Activity Level</th>
                                        <th>Calorie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.activityCalories.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.label}</td>
                                            <td className="bmr-calorie-value">{item.calories.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="bmr-exercise-note">
                                <p><b>Exercise:</b> 15-30 minutes of elevated heart rate activity.</p>
                                <p><b>Intense exercise:</b> 45-120 minutes of elevated heart rate activity.</p>
                                <p><b>Very intense exercise:</b> 2+ hours of elevated heart rate activity.</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: "#00ff94", marginBottom: "1rem" }}>About BMR</h3>
                <p>
                    Basal Metabolic Rate (BMR) is the number of calories your body burns at rest to maintain vital functions such as breathing, circulation, and cell production. This calculator uses the <b>Mifflin-St Jeor Equation</b>, which is considered the most accurate BMR formula.
                </p>
                <p style={{ marginTop: "1rem" }}>
                    The results table shows your daily calorie needs based on different activity levels. To maintain your current weight, consume the number of calories corresponding to your activity level. To lose weight, consume fewer calories; to gain weight, consume more.
                </p>
            </div>
        </div>
    );
}
