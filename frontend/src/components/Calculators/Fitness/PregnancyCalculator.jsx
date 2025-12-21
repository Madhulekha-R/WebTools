import React, { useState } from "react";
import "./PregnancyCalculator.css";

export default function PregnancyCalculator() {
    const [calculationMethod, setCalculationMethod] = useState("lmp");
    const [date, setDate] = useState("");
    const [result, setResult] = useState(null);

    const calculationMethods = [
        { value: "dueDate", label: "Due Date" },
        { value: "lmp", label: "Last Period" },
        { value: "ultrasound", label: "Ultrasound" },
        { value: "conception", label: "Conception Date" },
        { value: "ivf", label: "IVF Transfer Date" }
    ];

    function handleCalculate(e) {
        e.preventDefault();
        if (!date) return;

        const inputDate = new Date(date);
        const today = new Date();
        let dueDate, lmpDate, conceptionDate;

        switch (calculationMethod) {
            case "dueDate":
                dueDate = inputDate;
                lmpDate = new Date(dueDate);
                lmpDate.setDate(lmpDate.getDate() - 280);
                conceptionDate = new Date(lmpDate);
                conceptionDate.setDate(conceptionDate.getDate() + 14);
                break;

            case "lmp":
                lmpDate = inputDate;
                dueDate = new Date(lmpDate);
                dueDate.setDate(dueDate.getDate() + 280);
                conceptionDate = new Date(lmpDate);
                conceptionDate.setDate(conceptionDate.getDate() + 14);
                break;

            case "ultrasound":
                // Assuming ultrasound date is current date
                lmpDate = new Date(inputDate);
                dueDate = new Date(lmpDate);
                dueDate.setDate(dueDate.getDate() + 280);
                conceptionDate = new Date(lmpDate);
                conceptionDate.setDate(conceptionDate.getDate() + 14);
                break;

            case "conception":
                conceptionDate = inputDate;
                dueDate = new Date(conceptionDate);
                dueDate.setDate(dueDate.getDate() + 266);
                lmpDate = new Date(conceptionDate);
                lmpDate.setDate(lmpDate.getDate() - 14);
                break;

            case "ivf":
                // IVF transfer date (assuming 3-day transfer)
                const transferDate = inputDate;
                conceptionDate = new Date(transferDate);
                conceptionDate.setDate(conceptionDate.getDate() - 3);
                dueDate = new Date(conceptionDate);
                dueDate.setDate(dueDate.getDate() + 266);
                lmpDate = new Date(conceptionDate);
                lmpDate.setDate(lmpDate.getDate() - 14);
                break;

            default:
                return;
        }

        // Calculate weeks pregnant
        const daysDiff = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(daysDiff / 7);
        const days = daysDiff % 7;

        // Calculate trimester
        let trimester;
        if (weeks < 13) trimester = "First Trimester (Week 1-12)";
        else if (weeks < 27) trimester = "Second Trimester (Week 13-26)";
        else trimester = "Third Trimester (Week 27-40)";

        // Days until due date
        const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

        setResult({
            dueDate: dueDate.toLocaleDateString(),
            lmpDate: lmpDate.toLocaleDateString(),
            conceptionDate: conceptionDate.toLocaleDateString(),
            weeks: weeks > 0 ? weeks : 0,
            days: days > 0 ? days : 0,
            trimester,
            daysUntilDue: daysUntilDue > 0 ? daysUntilDue : 0,
            percentComplete: Math.min(100, ((daysDiff / 280) * 100).toFixed(1))
        });
    }

    function handleClear() {
        setCalculationMethod("lmp");
        setDate("");
        setResult(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">PREGNANCY CALCULATOR</h2>
                <div className="age-calc-subheading">
                    The Pregnancy Calculator can estimate a pregnancy schedule based on the provided due date, last period date, ultrasound date, conception date, or IVF transfer date
                </div>
            </div>

            <form className={`age-calc-card pregnancy-expanded${result !== null ? " with-results" : ""}`} onSubmit={handleCalculate}>
                <div className="age-calc-card-content">
                    <label className="age-label">Calculate Based On</label>
                    <select className="age-input" value={calculationMethod} onChange={e => setCalculationMethod(e.target.value)}>
                        {calculationMethods.map(method => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                        ))}
                    </select>

                    <label className="age-label">
                        {calculationMethods.find(m => m.value === calculationMethod)?.label}
                    </label>
                    <input className="age-input" type="date" value={date} onChange={e => setDate(e.target.value)} />

                    <button type="submit" className="age-calc-btn" style={{ marginTop: 10 }}>Calculate</button>
                    <button type="button" className="age-calc-btn" style={{ marginTop: 10, background: "#6c757d", color: "#fff", marginLeft: "7px" }} onClick={handleClear}>Clear</button>
                </div>

                {result !== null && (
                    <div className="pregnancy-results">
                        <div className="pregnancy-main-info">
                            <div className="pregnancy-info-card">
                                <div className="pregnancy-info-label">Due Date</div>
                                <div className="pregnancy-info-value">{result.dueDate}</div>
                            </div>
                            <div className="pregnancy-info-card">
                                <div className="pregnancy-info-label">Weeks Pregnant</div>
                                <div className="pregnancy-info-value">{result.weeks}w {result.days}d</div>
                            </div>
                            <div className="pregnancy-info-card">
                                <div className="pregnancy-info-label">Trimester</div>
                                <div className="pregnancy-info-value-small">{result.trimester}</div>
                            </div>
                        </div>

                        <div className="pregnancy-details">
                            <table className="pregnancy-table">
                                <tbody>
                                    <tr>
                                        <td>Last Menstrual Period</td>
                                        <td className="pregnancy-value">{result.lmpDate}</td>
                                    </tr>
                                    <tr>
                                        <td>Estimated Conception Date</td>
                                        <td className="pregnancy-value">{result.conceptionDate}</td>
                                    </tr>
                                    <tr>
                                        <td>Days Until Due Date</td>
                                        <td className="pregnancy-value">{result.daysUntilDue} days</td>
                                    </tr>
                                    <tr>
                                        <td>Pregnancy Progress</td>
                                        <td className="pregnancy-value">{result.percentComplete}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </form>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: "#00ff94", marginBottom: "1rem" }}>About Pregnancy Calculation</h3>
                <p>
                    This pregnancy calculator provides multiple methods to estimate your pregnancy schedule. The most common method uses the <b>Last Menstrual Period (LMP)</b>, which assumes a 28-day cycle with ovulation occurring on day 14.
                </p>

                <h4 style={{ color: "#00cfff", marginTop: "1.5rem", marginBottom: "0.8rem" }}>Calculation Methods</h4>
                <p>
                    <b>Last Period:</b> Adds 280 days (40 weeks) to the first day of your last period.<br />
                    <b>Conception Date:</b> Adds 266 days (38 weeks) to the estimated conception date.<br />
                    <b>Ultrasound:</b> Uses measurements from ultrasound to estimate gestational age.<br />
                    <b>IVF Transfer:</b> Calculates based on embryo transfer date (accounting for embryo age).
                </p>
                <p style={{ marginTop: "1rem" }}>
                    A typical pregnancy lasts 280 days from LMP or 266 days from conception. Only about 5% of babies are born on their exact due date, so the due date is best thought of as an estimate.
                </p>
            </div>
        </div>
    );
}
