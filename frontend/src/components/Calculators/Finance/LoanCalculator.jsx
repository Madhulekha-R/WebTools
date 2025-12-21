import React, { useState } from "react";
import "./LoanCalculator.css";

export default function LoanCalculator() {
    // Mode selection
    const [calculatorMode, setCalculatorMode] = useState("amortized");

    // Common inputs
    const [loanAmount, setLoanAmount] = useState(100000);
    const [loanTermYears, setLoanTermYears] = useState(10);
    const [loanTermMonths, setLoanTermMonths] = useState(0);
    const [interestRate, setInterestRate] = useState(6);
    const [compound, setCompound] = useState("monthly");

    // Amortized loan specific
    const [payBack, setPayBack] = useState("monthly");

    // Bond specific
    const [predeterminedAmount, setPredeterminedAmount] = useState(100000);

    // Results
    const [results, setResults] = useState(null);

    const compoundOptions = [
        { value: "monthly", label: "Monthly (APR)", periodsPerYear: 12 },
        { value: "semimonthly", label: "Semi-Monthly", periodsPerYear: 24 },
        { value: "biweekly", label: "Bi-Weekly", periodsPerYear: 26 },
        { value: "weekly", label: "Weekly", periodsPerYear: 52 },
        { value: "daily", label: "Daily", periodsPerYear: 365 },
        { value: "continuously", label: "Continuously", periodsPerYear: Infinity },
        { value: "annually", label: "Annually (APY)", periodsPerYear: 1 },
        { value: "semiannually", label: "Semi-Annually", periodsPerYear: 2 },
        { value: "quarterly", label: "Quarterly", periodsPerYear: 4 }
    ];

    const payBackOptions = [
        { value: "monthly", label: "Every Month", periodsPerYear: 12 },
        { value: "quarterly", label: "Every Quarter", periodsPerYear: 4 },
        { value: "semiannually", label: "Every 6 Months", periodsPerYear: 2 },
        { value: "annually", label: "Every Year", periodsPerYear: 1 }
    ];

    function getPeriodsPerYear(type) {
        const option = compoundOptions.find(opt => opt.value === type) ||
            payBackOptions.find(opt => opt.value === type);
        return option ? option.periodsPerYear : 12;
    }

    function calculateAmortizedLoan() {
        const totalMonths = parseInt(loanTermYears) * 12 + parseInt(loanTermMonths);
        const compoundPerYear = getPeriodsPerYear(compound);
        const payBackPerYear = getPeriodsPerYear(payBack);

        // Convert annual rate to period rate
        const r = interestRate / 100;
        const periodicRate = compound === "continuously"
            ? Math.exp(r / payBackPerYear) - 1
            : r / compoundPerYear * (compoundPerYear / payBackPerYear);

        const numPayments = totalMonths / (12 / payBackPerYear);

        // Calculate payment using amortization formula
        const payment = loanAmount * (periodicRate * Math.pow(1 + periodicRate, numPayments)) /
            (Math.pow(1 + periodicRate, numPayments) - 1);

        const totalPayments = payment * numPayments;
        const totalInterest = totalPayments - loanAmount;

        const principalPercent = (loanAmount / totalPayments) * 100;
        const interestPercent = (totalInterest / totalPayments) * 100;

        return {
            payment,
            totalPayments,
            totalInterest,
            numPayments: Math.round(numPayments),
            principalPercent,
            interestPercent,
            payBackLabel: payBackOptions.find(opt => opt.value === payBack)?.label || "Every Month"
        };
    }

    function calculateDeferredPayment() {
        const totalMonths = parseInt(loanTermYears) * 12 + parseInt(loanTermMonths);
        const totalYears = totalMonths / 12;
        const compoundPerYear = getPeriodsPerYear(compound);

        const r = interestRate / 100;

        // Calculate future value with compound interest
        let futureValue;
        if (compound === "continuously") {
            futureValue = loanAmount * Math.exp(r * totalYears);
        } else {
            const n = compoundPerYear;
            futureValue = loanAmount * Math.pow(1 + r / n, n * totalYears);
        }

        const totalInterest = futureValue - loanAmount;

        const principalPercent = (loanAmount / futureValue) * 100;
        const interestPercent = (totalInterest / futureValue) * 100;

        return {
            amountDue: futureValue,
            totalInterest,
            principalPercent,
            interestPercent
        };
    }

    function calculateBond() {
        const totalMonths = parseInt(loanTermYears) * 12 + parseInt(loanTermMonths);
        const totalYears = totalMonths / 12;
        const compoundPerYear = getPeriodsPerYear(compound);

        const r = interestRate / 100;

        // Calculate present value (amount received when loan starts)
        let presentValue;
        if (compound === "continuously") {
            presentValue = predeterminedAmount / Math.exp(r * totalYears);
        } else {
            const n = compoundPerYear;
            presentValue = predeterminedAmount / Math.pow(1 + r / n, n * totalYears);
        }

        const totalInterest = predeterminedAmount - presentValue;

        const principalPercent = (presentValue / predeterminedAmount) * 100;
        const interestPercent = (totalInterest / predeterminedAmount) * 100;

        return {
            amountReceived: presentValue,
            totalInterest,
            principalPercent,
            interestPercent
        };
    }

    function handleCalculate(e) {
        e.preventDefault();

        let calculationResults;

        if (calculatorMode === "amortized") {
            calculationResults = calculateAmortizedLoan();
        } else if (calculatorMode === "deferred") {
            calculationResults = calculateDeferredPayment();
        } else if (calculatorMode === "bond") {
            calculationResults = calculateBond();
        }

        setResults({ ...calculationResults, mode: calculatorMode });
    }

    function handleClear() {
        setLoanAmount(100000);
        setLoanTermYears(10);
        setLoanTermMonths(0);
        setInterestRate(6);
        setCompound("monthly");
        setPayBack("monthly");
        setPredeterminedAmount(100000);
        setResults(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Loan Calculator</h2>
                <div className="age-calc-subheading">
                    A loan is a contract between a borrower and a lender in which the borrower receives an amount of money (principal) that they are obligated to pay back in the future.
                </div>
            </div>

            {/* Mode Selector */}
            <div className="loan-mode-selector">
                <button
                    className={`loan-mode-btn ${calculatorMode === "amortized" ? "active" : ""}`}
                    onClick={() => { setCalculatorMode("amortized"); setResults(null); }}
                >
                    Amortized Loan
                </button>
                <button
                    className={`loan-mode-btn ${calculatorMode === "deferred" ? "active" : ""}`}
                    onClick={() => { setCalculatorMode("deferred"); setResults(null); }}
                >
                    Deferred Payment Loan
                </button>
                <button
                    className={`loan-mode-btn ${calculatorMode === "bond" ? "active" : ""}`}
                    onClick={() => { setCalculatorMode("bond"); setResults(null); }}
                >
                    Bond
                </button>
            </div>

            <div className="mortgage-container">
                <form className="mortgage-input-section" onSubmit={handleCalculate}>
                    <div className="mortgage-card">
                        <h3 className="mortgage-section-title">
                            {calculatorMode === "amortized" && "Amortized Loan: Paying Back a Fixed Amount Periodically"}
                            {calculatorMode === "deferred" && "Deferred Payment Loan: Paying Back a Lump Sum Due at Maturity"}
                            {calculatorMode === "bond" && "Bond: Paying Back a Predetermined Amount Due at Loan Maturity"}
                        </h3>

                        {calculatorMode === "bond" ? (
                            <>
                                <label className="age-label">Predetermined Due Amount ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={predeterminedAmount}
                                    onChange={e => setPredeterminedAmount(parseFloat(e.target.value) || 0)}
                                    step="1000"
                                />
                            </>
                        ) : (
                            <>
                                <label className="age-label">Loan Amount ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={loanAmount}
                                    onChange={e => setLoanAmount(parseFloat(e.target.value) || 0)}
                                    step="1000"
                                />
                            </>
                        )}

                        <label className="age-label">Loan Term</label>
                        <div className="mortgage-date-inputs">
                            <div>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={loanTermYears}
                                    onChange={e => setLoanTermYears(e.target.value)}
                                    min="0"
                                    placeholder="years"
                                />
                                <span style={{ color: '#b0b3b8', fontSize: '0.9rem', marginLeft: '5px' }}>years</span>
                            </div>
                            <div>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={loanTermMonths}
                                    onChange={e => setLoanTermMonths(e.target.value)}
                                    min="0"
                                    max="11"
                                    placeholder="months"
                                />
                                <span style={{ color: '#b0b3b8', fontSize: '0.9rem', marginLeft: '5px' }}>months</span>
                            </div>
                        </div>

                        <label className="age-label">Interest Rate (%)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={interestRate}
                            onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                        />

                        <label className="age-label">Compound</label>
                        <select
                            className="age-input mortgage-select"
                            value={compound}
                            onChange={e => setCompound(e.target.value)}
                        >
                            {compoundOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {calculatorMode === "amortized" && (
                            <>
                                <label className="age-label">Pay Back</label>
                                <select
                                    className="age-input mortgage-select"
                                    value={payBack}
                                    onChange={e => setPayBack(e.target.value)}
                                >
                                    {payBackOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        <div className="mortgage-button-group">
                            <button type="submit" className="age-calc-btn">Calculate</button>
                            <button type="button" className="age-calc-btn mortgage-clear-btn" onClick={handleClear}>Clear</button>
                        </div>
                    </div>
                </form>

                {results && (
                    <div className="mortgage-results-section">
                        <div className="mortgage-card mortgage-results-card">
                            <div className="loan-results-header">Results:</div>

                            {results.mode === "amortized" && (
                                <>
                                    <div className="loan-result-row">
                                        <span>Payment {results.payBackLabel}</span>
                                        <span className="loan-result-value">${results.payment.toFixed(2)}</span>
                                    </div>
                                    <div className="loan-result-row">
                                        <span>Total of {results.numPayments} Payments</span>
                                        <span className="loan-result-value">${results.totalPayments.toFixed(2)}</span>
                                    </div>
                                    <div className="loan-result-row">
                                        <span>Total Interest</span>
                                        <span className="loan-result-value">${results.totalInterest.toFixed(2)}</span>
                                    </div>
                                </>
                            )}

                            {results.mode === "deferred" && (
                                <>
                                    <div className="loan-result-row">
                                        <span>Amount Due at Loan Maturity</span>
                                        <span className="loan-result-value">${results.amountDue.toFixed(2)}</span>
                                    </div>
                                    <div className="loan-result-row">
                                        <span>Total Interest</span>
                                        <span className="loan-result-value">${results.totalInterest.toFixed(2)}</span>
                                    </div>
                                </>
                            )}

                            {results.mode === "bond" && (
                                <>
                                    <div className="loan-result-row">
                                        <span>Amount Received When the Loan Starts</span>
                                        <span className="loan-result-value">${results.amountReceived.toFixed(2)}</span>
                                    </div>
                                    <div className="loan-result-row">
                                        <span>Total Interest</span>
                                        <span className="loan-result-value">${results.totalInterest.toFixed(2)}</span>
                                    </div>
                                </>
                            )}

                            {/* Pie Chart */}
                            <div className="mortgage-chart-container">
                                <svg viewBox="0 0 200 200" className="mortgage-pie-chart">
                                    {/* Principal */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#4285f4"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.principalPercent * 5.027} 502.7`}
                                        transform="rotate(-90 100 100)"
                                    />
                                    {/* Interest */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#34a853"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.interestPercent * 5.027} 502.7`}
                                        strokeDashoffset={-results.principalPercent * 5.027}
                                        transform="rotate(-90 100 100)"
                                    />
                                    {/* Center white circle */}
                                    <circle cx="100" cy="100" r="60" fill="#23272f" />
                                    {/* Percentage text */}
                                    <text x="100" y="95" textAnchor="middle" fill="#4285f4" fontSize="24" fontWeight="bold">
                                        {results.principalPercent.toFixed(0)}%
                                    </text>
                                    <text x="100" y="115" textAnchor="middle" fill="#34a853" fontSize="24" fontWeight="bold">
                                        {results.interestPercent.toFixed(0)}%
                                    </text>
                                </svg>

                                <div className="mortgage-legend">
                                    <div className="mortgage-legend-item">
                                        <span className="mortgage-legend-color" style={{ backgroundColor: '#4285f4' }}></span>
                                        <span>Principal</span>
                                    </div>
                                    <div className="mortgage-legend-item">
                                        <span className="mortgage-legend-color" style={{ backgroundColor: '#34a853' }}></span>
                                        <span>Interest</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <a href="#" className="loan-view-table-link">
                                    View {results.mode === "amortized" ? "Amortization" : "Schedule"} Table
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>Loan Types</h3>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                    1. Amortized Loan: Fixed payments paid periodically until loan maturity
                </h4>
                <p>
                    Use this calculator for basic calculations of common loan types such as <b>mortgages</b>, <b>auto loans</b>,
                    <b>student loans</b>, or <b>personal loans</b>, or click the links for more detail on each.
                </p>
                <p>
                    Many consumer loans fall into this category of loans that have regular payments that are amortized
                    uniformly over their lifetime. Routine payments are made on principal and interest until the loan
                    reaches maturity (is entirely paid off). Some of the most familiar amortized loans include mortgages,
                    car loans, student loans, and personal loans. The word "loan" will probably refer to this type in
                    everyday conversation, not the type in the second or third calculation.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                    2. Deferred Payment Loan: Single lump sum paid at loan maturity
                </h4>
                <p>
                    Many commercial loans or short-term loans are in this category. Unlike the first calculation, which is
                    amortized with payments spread uniformly over their lifetimes, these loans have a single, large lump
                    sum due at maturity. Some loans, such as balloon loans, can also have smaller routine payments during
                    their lifetimes, but this calculation only works for loans with a single payment of all principal and
                    interest due at maturity.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                    3. Bond: Predetermined lump sum paid at loan maturity (the face or par value of a bond)
                </h4>
                <p>
                    This kind of loan is rarely made except in the form of bonds. Technically, bonds operate differently from
                    more conventional loans in that borrowers make a predetermined payment at maturity. The face, or par
                    value of a bond, is the amount paid by the issuer (borrower) when the bond matures, assuming the
                    borrower doesn't default. Face value denotes the amount received at maturity.
                </p>
                <p>
                    Two common bond types are coupon and zero-coupon bonds. With coupon bonds, lenders base coupon
                    interest payments on a percentage of the face value. Coupon interest payments occur at predetermined
                    intervals, usually annually or semi-annually. Zero-coupon bonds do not pay interest directly. Instead,
                    borrowers sell bonds at a deep discount to their face value, then pay the face value when the bond
                    matures. Users should note that the calculator above runs calculations for zero-coupon bonds.
                </p>
            </div>
        </div>
    );
}
