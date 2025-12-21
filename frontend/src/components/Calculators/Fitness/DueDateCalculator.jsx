import React, { useState } from "react";
import "./DueDateCalculator.css";

export default function DueDateCalculator() {
    const [calcMethod, setCalcMethod] = useState("Last Period");
    const [inputDate, setInputDate] = useState("");
    const [cycleLength, setCycleLength] = useState("28");
    const [dueDate, setDueDate] = useState("");
    const [weeksPregnant, setWeeksPregnant] = useState("");
    const [daysUntilDue, setDaysUntilDue] = useState("");
    const [trimester, setTrimester] = useState("");

    // Format date to readable string
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Calculate due date based on selected method
    function calculateDueDate() {
        if (!inputDate) return;

        const selectedDate = new Date(inputDate);
        let calculatedDueDate = new Date(selectedDate);
        const today = new Date();

        switch (calcMethod) {
            case "Last Period":
                // Add 280 days (40 weeks) from LMP
                calculatedDueDate.setDate(selectedDate.getDate() + 280);
                break;

            case "Ultrasound":
                // For ultrasound, we assume the date given is the ultrasound date
                // and we need to add remaining weeks (this is simplified)
                calculatedDueDate.setDate(selectedDate.getDate() + 280);
                break;

            case "Conception Date":
                // Add 266 days (38 weeks) from conception
                calculatedDueDate.setDate(selectedDate.getDate() + 266);
                break;

            case "IVF Transfer":
                // For 3-day embryo: add 263 days
                // For 5-day embryo: add 261 days
                // Using 3-day as default
                calculatedDueDate.setDate(selectedDate.getDate() + 263);
                break;

            default:
                break;
        }

        // Calculate weeks pregnant
        const daysSinceLMP = Math.floor((today - selectedDate) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(daysSinceLMP / 7);
        const days = daysSinceLMP % 7;

        // Calculate days until due
        const daysRemaining = Math.floor((calculatedDueDate - today) / (1000 * 60 * 60 * 24));

        // Determine trimester
        let currentTrimester = "";
        if (weeks < 13) {
            currentTrimester = "First Trimester";
        } else if (weeks < 27) {
            currentTrimester = "Second Trimester";
        } else {
            currentTrimester = "Third Trimester";
        }

        setDueDate(formatDate(calculatedDueDate));
        setWeeksPregnant(`${weeks} weeks, ${days} days`);
        setDaysUntilDue(daysRemaining > 0 ? `${daysRemaining} days` : "Baby is due or overdue!");
        setTrimester(currentTrimester);
    }

    function clearCalculator() {
        setInputDate("");
        setCycleLength("28");
        setDueDate("");
        setWeeksPregnant("");
        setDaysUntilDue("");
        setTrimester("");
    }

    return (
        <div className="age-calc-root percent-bg">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">DUE DATE CALCULATOR</h2>
            </div>

            <div className="due-date-intro">
                The Due Date Calculator estimates the delivery date of a pregnant woman based on her last menstrual
                period (LMP), ultrasound, conception date, or IVF transfer date. The due date, also known as the
                estimated date of confinement, is an estimation of when a pregnant woman will deliver her baby.
            </div>

            <div className="age-calc-card percent-card">
                <div className="due-date-instruction">
                    <div className="instruction-icon">▼</div>
                    <div className="instruction-text">
                        Modify the values and click the Calculate button to use
                    </div>
                </div>

                <form className="due-date-form" onSubmit={e => { e.preventDefault(); calculateDueDate(); }}>
                    <div className="due-date-row">
                        <label className="due-date-label">Estimate Based On:</label>
                        <select
                            className="due-date-select"
                            value={calcMethod}
                            onChange={e => setCalcMethod(e.target.value)}
                        >
                            <option>Last Period</option>
                            <option>Ultrasound</option>
                            <option>Conception Date</option>
                            <option>IVF Transfer</option>
                        </select>
                    </div>

                    <div className="due-date-row">
                        <label className="due-date-label">
                            {calcMethod === "Last Period" ? "First Day of Your Last Period:" :
                                calcMethod === "Ultrasound" ? "Ultrasound Date:" :
                                    calcMethod === "Conception Date" ? "Conception Date:" :
                                        "IVF Transfer Date:"}
                        </label>
                        <input
                            type="date"
                            className="age-input percent-input due-date-date-input"
                            value={inputDate}
                            onChange={e => setInputDate(e.target.value)}
                        />
                    </div>

                    {calcMethod === "Last Period" && (
                        <div className="due-date-row">
                            <label className="due-date-label">Average Length of Your Cycles:</label>
                            <select
                                className="due-date-select"
                                value={cycleLength}
                                onChange={e => setCycleLength(e.target.value)}
                            >
                                <option value="20">20 days</option>
                                <option value="21">21 days</option>
                                <option value="22">22 days</option>
                                <option value="23">23 days</option>
                                <option value="24">24 days</option>
                                <option value="25">25 days</option>
                                <option value="26">26 days</option>
                                <option value="27">27 days</option>
                                <option value="28">28 days</option>
                                <option value="29">29 days</option>
                                <option value="30">30 days</option>
                                <option value="31">31 days</option>
                                <option value="32">32 days</option>
                                <option value="33">33 days</option>
                                <option value="34">34 days</option>
                                <option value="35">35 days</option>
                                <option value="36">36 days</option>
                                <option value="37">37 days</option>
                                <option value="38">38 days</option>
                                <option value="39">39 days</option>
                                <option value="40">40 days</option>
                            </select>
                        </div>
                    )}

                    <div className="percent-btn-row">
                        <button className="age-calc-btn percent-main-btn due-date-calc-btn" type="button" onClick={calculateDueDate}>
                            Calculate ▶
                        </button>
                        <button className="age-calc-btn due-date-clear-btn" type="button" onClick={clearCalculator}>
                            Clear
                        </button>
                    </div>
                </form>

                {dueDate && (
                    <div className="due-date-results">
                        <h3 className="result-heading">Your Pregnancy Details</h3>
                        <div className="due-date-result-grid">
                            <div className="due-date-result-item">
                                <div className="result-item-label">Estimated Due Date</div>
                                <div className="result-item-value">{dueDate}</div>
                            </div>
                            <div className="due-date-result-item">
                                <div className="result-item-label">Weeks Pregnant</div>
                                <div className="result-item-value">{weeksPregnant}</div>
                            </div>
                            <div className="due-date-result-item">
                                <div className="result-item-label">Days Until Due</div>
                                <div className="result-item-value">{daysUntilDue}</div>
                            </div>
                            <div className="due-date-result-item">
                                <div className="result-item-label">Current Trimester</div>
                                <div className="result-item-value">{trimester}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Educational Content */}
            <div className="age-content percent-description" style={{ maxWidth: 900, marginBottom: '40px' }}>
                <h2>Estimation of Due Date</h2>
                <p>
                    The due date, also known as the estimated date of confinement, is an estimation of when a pregnant
                    woman will deliver her baby. While the due date is often estimated as a single date, it can be helpful to
                    consider a range of due dates, since only 4% of births occur on the estimated due date.
                </p>
                <p>
                    Due dates can be estimated using a number of different methods, including the last menstrual period,
                    ultrasound, conception date, and IVF transfer date.
                </p>

                <h2>Last Menstrual Period</h2>
                <p>
                    The default for this calculator bases the calculation on a woman's last menstrual period (LMP), under
                    the assumption that childbirth on average occurs at a gestational age (age of a pregnancy calculated
                    from the woman's last menstrual period) of 280 days, or 40 weeks. Although there is some debate
                    regarding when pregnancy technically begins, whether at fertilization of the egg (conception), or when
                    the egg adheres to the uterus (implantation), gestational age does not vary based on different
                    definitions of pregnancy since it is based on LMP. In terms of gestational age, pregnancies typically
                    last between 37 and 42 weeks, with 40 weeks often being used as an estimate in calculations. Thus,
                    the due date is usually estimated by calculating the date that is 40 weeks from the start of a woman's
                    LMP.
                </p>

                <h2>Ultrasound</h2>
                <p>
                    Estimating due date based on ultrasound involves the use of soundwaves to look inside the body and
                    compare the growth of the fetus to typical growth rates of babies around the world. It is a simple
                    process that can be performed quickly and easily, that has no known risk to babies, and can be an
                    accurate estimate of the due date early in the pregnancy.
                </p>

                <h2>Conception Date</h2>
                <p>
                    Using conception date to estimate due date is similar to using the last menstrual period. There is a
                    difference of about two weeks between using these two methods that is based on the timing between
                    the last menstrual period and the date of conception.
                </p>

                <h2>In Vitro Fertilization (IVF)</h2>
                <p>
                    When using in vitro fertilization, the estimation of the due date is generally more precise than
                    calculating the due date based on natural conception, since the exact transfer date is known. It still
                    uses the average gestational age at birth of 40 weeks from a woman's last menstrual period, as do the
                    other methods. In the case of IVF, however, the due date estimate can be made based on LMP, day of
                    ovulation, egg retrieval, insemination, as well as the date of the 3-day or 5-day embryo transfer. In this
                    calculator, the embryo transfer date is used.
                </p>

                <h2>Due Date as a Reference Point</h2>
                <p>
                    Generally, the point within the 37 to 42-week window at which the baby is born is not a cause for
                    concern. Babies born between 37-39 weeks, 39-41 weeks, and 41-42 weeks are considered early
                    term, full-term, and late-term, respectively. Under normal circumstances, babies born within any of
                    these ranges can be healthy, though full-term babies generally have better outcomes. Babies born
                    before 37 weeks are considered preterm, or premature, while those born after 42 weeks are postterm.
                    These ranges are important as a reference for doctors to determine whether or not any action is
                    necessary. For example, if a woman goes into labor too early at 33 weeks, doctors may stop labor to
                    avoid a preterm baby that can have a host of health issues due to underdevelopment. Conversely, if a
                    woman has not gone into labor after 42 weeks, doctors may induce labor. One possible complication of
                    allowing the pregnancy to proceed beyond 42 weeks is that the placenta, which is responsible for
                    providing nutrition and oxygen to the baby, can stop functioning properly, while the baby continues
                    growing (requiring more nutrients and oxygen), which would eventually lead to a point in the pregnancy
                    where the baby can no longer be adequately supported.
                </p>
            </div>
        </div>
    );
}
