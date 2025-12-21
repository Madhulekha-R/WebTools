import React, { useState } from "react";
import "./PregnancyConceptionCalculator.css";

export default function PregnancyConceptionCalculator() {
    const [calcMethod, setCalcMethod] = useState("Due Date");
    const [inputDate, setInputDate] = useState("");
    const [conceptionDate, setConceptionDate] = useState("");
    const [dateRangeStart, setDateRangeStart] = useState("");
    const [dateRangeEnd, setDateRangeEnd] = useState("");

    // Format date to readable string
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Calculate conception date based on selected method
    function calculateConception() {
        if (!inputDate) return;

        const selectedDate = new Date(inputDate);
        let conception = new Date(selectedDate);

        switch (calcMethod) {
            case "Due Date":
                // Conception is approximately 266 days (38 weeks) before due date
                conception.setDate(selectedDate.getDate() - 266);
                break;

            case "Last Period":
                // Conception is approximately 14 days after last period (ovulation)
                conception.setDate(selectedDate.getDate() + 14);
                break;

            case "Ultrasound":
                // For ultrasound, we'd need gestational age, but for simplicity
                // we'll assume a standard calculation (this can be enhanced)
                conception.setDate(selectedDate.getDate() - 14);
                break;

            default:
                break;
        }

        // Calculate date range (3-5 days before conception for sperm viability)
        const rangeStart = new Date(conception);
        rangeStart.setDate(conception.getDate() - 5);

        const rangeEnd = new Date(conception);
        rangeEnd.setDate(conception.getDate() - 3);

        setConceptionDate(formatDate(conception));
        setDateRangeStart(formatDate(rangeStart));
        setDateRangeEnd(formatDate(rangeEnd));
    }

    function clearCalculator() {
        setInputDate("");
        setConceptionDate("");
        setDateRangeStart("");
        setDateRangeEnd("");
    }

    return (
        <div className="age-calc-root percent-bg">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">PREGNANCY CONCEPTION CALCULATOR</h2>
            </div>

            <div className="conception-intro">
                The Pregnancy Conception Calculator estimates the date of conception based on the expected due
                date of the pregnancy, last period date, or ultrasound date. The date of conception is the day on which
                a person's baby is conceived. The calculator also estimates a possible range of days during which
                sexual intercourse might have led to conception based on sperm being viable for 3-5 days within a
                woman's body.
            </div>

            <div className="age-calc-card percent-card">
                <div className="conception-instruction">
                    <div className="instruction-icon">▼</div>
                    <div className="instruction-text">
                        Modify the values and click the Calculate button to use
                    </div>
                </div>

                <form className="conception-form" onSubmit={e => { e.preventDefault(); calculateConception(); }}>
                    <div className="conception-row">
                        <label className="conception-label">Calculate Based On:</label>
                        <select
                            className="conception-select"
                            value={calcMethod}
                            onChange={e => setCalcMethod(e.target.value)}
                        >
                            <option>Due Date</option>
                            <option>Last Period</option>
                            <option>Ultrasound</option>
                        </select>
                    </div>

                    <div className="conception-row">
                        <label className="conception-label">Your {calcMethod}:</label>
                        <input
                            type="date"
                            className="age-input percent-input conception-date-input"
                            value={inputDate}
                            onChange={e => setInputDate(e.target.value)}
                        />
                    </div>

                    <div className="percent-btn-row">
                        <button className="age-calc-btn percent-main-btn conception-calc-btn" type="button" onClick={calculateConception}>
                            Calculate ▶
                        </button>
                    </div>
                </form>

                {conceptionDate && (
                    <div className="conception-results">
                        <h3 className="result-heading">When Did I Conceive?</h3>
                        <div className="result-text">
                            When exactly did I get pregnant? Many women ask this question when trying to figure out the exact
                            day their pregnancy began. Often, gestational age, or the age of the baby, is calculated from the first
                            day of the mother's last menstrual period. Biologically, the baby was not conceived until ovulation and
                            the fertilization of the egg, which usually happens at least 10 days after the first day of the mother's last
                            menstrual period.
                        </div>
                        <div className="conception-date-result">
                            <strong>Estimated Conception Date:</strong> {conceptionDate}
                        </div>
                        <div className="conception-range-result">
                            <strong>Possible Range of Conception:</strong> {dateRangeStart} - {dateRangeEnd}
                        </div>
                    </div>
                )}
            </div>

            <div className="related-calculators">
                <h3 className="related-title">Related</h3>
                <div className="related-buttons">
                    <button className="related-btn">Conception Calculator</button>
                    <button className="related-btn">Pregnancy Calculator</button>
                    <button className="related-btn">Due Date Calculator</button>
                </div>
            </div>

            {/* Educational Content */}
            <div className="age-content percent-description" style={{ maxWidth: 900, marginBottom: '40px' }}>
                <h2>When Did I Conceive?</h2>
                <p>
                    When exactly did I get pregnant? Many women ask this question when trying to figure out the exact
                    day their pregnancy began. Often, gestational age, or the age of the baby, is calculated from the first
                    day of the mother's last menstrual period. Biologically, the baby was not conceived until ovulation and
                    the fertilization of the egg, which usually happens at least 10 days after the first day of the mother's last
                    menstrual period.
                </p>

                <h2>Conception Date Calculation</h2>
                <p>
                    The conception date is typically calculated by subtracting 266 days (38 weeks) from the expected due date.
                    This is because pregnancy is typically 280 days (40 weeks) from the last menstrual period, but conception
                    occurs about 14 days after the last period began.
                </p>

                <h2>Sperm Viability and Conception Window</h2>
                <p>
                    Sperm can remain viable in a woman's body for 3-5 days. This means that sexual intercourse that occurs
                    several days before ovulation can still result in pregnancy. The calculator provides a range of possible
                    conception dates to account for this biological fact.
                </p>

                <h2>Accuracy of Conception Date</h2>
                <p>
                    It's important to note that the conception date calculated is an estimate. The actual date of conception
                    can vary based on individual factors such as cycle length, ovulation timing, and sperm viability. For the
                    most accurate dating of pregnancy, ultrasound measurements in the first trimester are recommended.
                </p>
            </div>
        </div>
    );
}
