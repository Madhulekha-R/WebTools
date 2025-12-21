import React, { useState } from "react";
import "./PaymentCalculator.css";

export default function PaymentCalculator() {
    // Tab selection
    const [activeTab, setActiveTab] = useState("fixedTerm");

    // Fixed Term mode inputs
    const [loanAmount, setLoanAmount] = useState(200000);
    const [loanTermYears, setLoanTermYears] = useState(15);
    const [interestRate, setInterestRate] = useState(6);

    // Fixed Payments mode inputs
    const [monthlyPayment, setMonthlyPayment] = useState(1687.71);

    // Results
    const [results, setResults] = useState(null);
    const [scheduleTab, setScheduleTab] = useState("annual");

    function calculateFixedTerm() {
        const principal = loanAmount;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTermYears * 12;

        // Calculate monthly payment using amortization formula
        let payment;
        if (interestRate === 0) {
            payment = principal / numPayments;
        } else {
            payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        const totalPayments = payment * numPayments;
        const totalInterest = totalPayments - principal;

        // Generate amortization schedule
        const annualSchedule = [];
        const monthlySchedule = [];
        let balance = principal;

        for (let month = 1; month <= numPayments; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = payment - interestPayment;
            balance -= principalPayment;

            monthlySchedule.push({
                month,
                interest: interestPayment,
                principal: principalPayment,
                endingBalance: Math.max(0, balance)
            });

            // Aggregate into annual schedule
            if (month % 12 === 0 || month === numPayments) {
                const year = Math.ceil(month / 12);
                const yearMonths = monthlySchedule.slice((year - 1) * 12, month);
                const yearInterest = yearMonths.reduce((sum, m) => sum + m.interest, 0);
                const yearPrincipal = yearMonths.reduce((sum, m) => sum + m.principal, 0);

                annualSchedule.push({
                    year,
                    interest: yearInterest,
                    principal: yearPrincipal,
                    endingBalance: Math.max(0, balance)
                });
            }
        }

        const principalPercent = (principal / totalPayments) * 100;
        const interestPercent = (totalInterest / totalPayments) * 100;

        return {
            monthlyPayment: payment,
            totalPayments,
            totalInterest,
            numPayments,
            loanTermYears,
            principalPercent,
            interestPercent,
            annualSchedule,
            monthlySchedule
        };
    }

    function calculateFixedPayments() {
        const principal = loanAmount;
        const monthlyRate = interestRate / 100 / 12;
        const payment = monthlyPayment;

        // Calculate number of payments needed
        let numPayments;
        if (interestRate === 0) {
            numPayments = principal / payment;
        } else {
            // Formula: n = -log(1 - (P * r / M)) / log(1 + r)
            numPayments = -Math.log(1 - (principal * monthlyRate / payment)) / Math.log(1 + monthlyRate);
        }

        const years = numPayments / 12;
        const totalPayments = payment * numPayments;
        const totalInterest = totalPayments - principal;

        // Generate amortization schedule
        const annualSchedule = [];
        const monthlySchedule = [];
        let balance = principal;

        for (let month = 1; month <= Math.ceil(numPayments); month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = Math.min(payment - interestPayment, balance);
            balance -= principalPayment;

            monthlySchedule.push({
                month,
                interest: interestPayment,
                principal: principalPayment,
                endingBalance: Math.max(0, balance)
            });

            // Aggregate into annual schedule
            if (month % 12 === 0 || month === Math.ceil(numPayments)) {
                const year = Math.ceil(month / 12);
                const yearMonths = monthlySchedule.slice((year - 1) * 12, month);
                const yearInterest = yearMonths.reduce((sum, m) => sum + m.interest, 0);
                const yearPrincipal = yearMonths.reduce((sum, m) => sum + m.principal, 0);

                annualSchedule.push({
                    year,
                    interest: yearInterest,
                    principal: yearPrincipal,
                    endingBalance: Math.max(0, balance)
                });
            }

            if (balance <= 0.01) break;
        }

        const principalPercent = (principal / totalPayments) * 100;
        const interestPercent = (totalInterest / totalPayments) * 100;

        return {
            monthlyPayment: payment,
            totalPayments,
            totalInterest,
            numPayments: Math.ceil(numPayments),
            loanTermYears: years,
            principalPercent,
            interestPercent,
            annualSchedule,
            monthlySchedule
        };
    }

    function handleCalculate(e) {
        e.preventDefault();

        let calculationResults;

        if (activeTab === "fixedTerm") {
            calculationResults = calculateFixedTerm();
        } else {
            calculationResults = calculateFixedPayments();
        }

        setResults({ ...calculationResults, mode: activeTab });
    }

    function handleClear() {
        if (activeTab === "fixedTerm") {
            setLoanAmount(200000);
            setLoanTermYears(15);
            setInterestRate(6);
        } else {
            setLoanAmount(200000);
            setMonthlyPayment(1687.71);
            setInterestRate(6);
        }
        setResults(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Payment Calculator</h2>
                <div className="age-calc-subheading">
                    The Payment Calculator can determine the monthly payment amount or loan term for a fixed interest loan
                </div>
            </div>

            {/* Tab Selector */}
            <div className="loan-mode-selector">
                <button
                    className={`loan-mode-btn ${activeTab === "fixedTerm" ? "active" : ""}`}
                    onClick={() => { setActiveTab("fixedTerm"); setResults(null); }}
                >
                    Fixed Term
                </button>
                <button
                    className={`loan-mode-btn ${activeTab === "fixedPayments" ? "active" : ""}`}
                    onClick={() => { setActiveTab("fixedPayments"); setResults(null); }}
                >
                    Fixed Payments
                </button>
            </div>

            <div className="mortgage-container">
                <form className="mortgage-input-section" onSubmit={handleCalculate}>
                    <div className="mortgage-card">
                        <label className="age-label">Loan Amount ($)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={loanAmount}
                            onChange={e => setLoanAmount(parseFloat(e.target.value) || 0)}
                            step="1000"
                        />

                        {activeTab === "fixedTerm" ? (
                            <>
                                <label className="age-label">Loan Term (years)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={loanTermYears}
                                    onChange={e => setLoanTermYears(parseFloat(e.target.value) || 0)}
                                    min="1"
                                    step="1"
                                />
                            </>
                        ) : (
                            <>
                                <label className="age-label">Monthly Payment ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={monthlyPayment}
                                    onChange={e => setMonthlyPayment(parseFloat(e.target.value) || 0)}
                                    step="10"
                                />
                            </>
                        )}

                        <label className="age-label">Interest Rate (%)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={interestRate}
                            onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                        />

                        <div className="mortgage-button-group">
                            <button type="submit" className="age-calc-btn">Calculate</button>
                            <button type="button" className="age-calc-btn mortgage-clear-btn" onClick={handleClear}>Clear</button>
                        </div>
                    </div>
                </form>

                {results && (
                    <div className="mortgage-results-section">
                        <div className="mortgage-card mortgage-results-card">
                            <div className="mortgage-monthly-payment">
                                <span className="mortgage-payment-label">Monthly Payment:</span>
                                <span className="mortgage-payment-value">${results.monthlyPayment.toFixed(2)}</span>
                            </div>

                            {activeTab === "fixedPayments" && (
                                <div className="payment-info-text">
                                    You will need to pay ${results.monthlyPayment.toFixed(2)} every month for {results.loanTermYears.toFixed(2)} years to payoff the debt.
                                </div>
                            )}

                            <div className="auto-loan-results-grid">
                                <div className="auto-loan-result-row">
                                    <span>Total of {results.numPayments} Payments</span>
                                    <span className="auto-loan-result-value">${results.totalPayments.toFixed(2)}</span>
                                </div>
                                <div className="auto-loan-result-row auto-loan-total-row">
                                    <span>Total Interest</span>
                                    <span className="auto-loan-result-value">${results.totalInterest.toFixed(2)}</span>
                                </div>
                            </div>

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
                        </div>

                        {/* Amortization Schedule */}
                        <div className="mortgage-card" style={{ marginTop: '20px' }}>
                            <h3 style={{ color: '#00ff94', marginBottom: '20px' }}>Amortization Schedule</h3>

                            <div className="loan-mode-selector" style={{ marginBottom: '20px' }}>
                                <button
                                    className={`loan-mode-btn ${scheduleTab === "annual" ? "active" : ""}`}
                                    onClick={() => setScheduleTab("annual")}
                                    type="button"
                                >
                                    Annual Schedule
                                </button>
                                <button
                                    className={`loan-mode-btn ${scheduleTab === "monthly" ? "active" : ""}`}
                                    onClick={() => setScheduleTab("monthly")}
                                    type="button"
                                >
                                    Monthly Schedule
                                </button>
                            </div>

                            {scheduleTab === "annual" && (
                                <div className="interest-schedule-table-wrapper">
                                    <table className="interest-schedule-table">
                                        <thead>
                                            <tr>
                                                <th>Year</th>
                                                <th>Interest</th>
                                                <th>Principal</th>
                                                <th>Ending Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.annualSchedule.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.year}</td>
                                                    <td>${row.interest.toFixed(2)}</td>
                                                    <td>${row.principal.toFixed(2)}</td>
                                                    <td>${row.endingBalance.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {scheduleTab === "monthly" && (
                                <div className="interest-schedule-table-wrapper">
                                    <table className="interest-schedule-table">
                                        <thead>
                                            <tr>
                                                <th>Month</th>
                                                <th>Interest</th>
                                                <th>Principal</th>
                                                <th>Ending Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.monthlySchedule.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.month}</td>
                                                    <td>${row.interest.toFixed(2)}</td>
                                                    <td>${row.principal.toFixed(2)}</td>
                                                    <td>${row.endingBalance.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>About Loans</h3>
                <p>
                    A loan is a contract between a borrower and a lender in which the borrower receives an amount of money
                    (principal) that they are obligated to pay back in the future. Loans can be customized based on various
                    factors. The number of available options can be overwhelming. Two of the most common deciding factors are
                    the term and monthly payment amount, which are separated by tabs in the calculator above.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Fixed Term</h4>
                <p>
                    Mortgages, auto, and many other loans tend to use the time limit approach to the repayment of loans. For
                    mortgages, in particular, choosing to have routine monthly payments between 30 years or 15 years or other
                    terms can be a very important decision because how long a debt obligation lasts can affect a person's
                    long-term financial goals. Some examples include:
                </p>
                <ul style={{ color: '#b0b3b8', lineHeight: '1.8' }}>
                    <li>Choosing a shorter mortgage term because of the uncertainty of long-term job security or preference
                        for a lower interest rate while there is a sizable amount in savings</li>
                    <li>Choosing a longer mortgage term in order to time it correctly with the release of Social Security
                        retirement benefits, which can be used to pay off the mortgage</li>
                </ul>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Fixed Payments</h4>
                <p>
                    The Payment Calculator can help sort out the fine details of such considerations. It can also be used when
                    deciding between financing options for a car, which can range from 12 months to 96 months periods. Even
                    though many car buyers will be tempted to take the longest option that results in the lowest monthly payment,
                    the shortest term typically results in the lowest total paid for the car (interest + principal). Car buyers
                    should experiment with the variables to see which term is best accommodated by their budget and situation.
                </p>
                <p>
                    For additional information about or to do calculations involving mortgages or auto loans, please visit the{' '}
                    <a href="/calculators/financial/mortgage" style={{ color: '#00cfff' }}>Mortgage Calculator</a> or{' '}
                    <a href="/calculators/financial/auto-loan" style={{ color: '#00cfff' }}>Auto Loan Calculator</a>.
                </p>
            </div>
        </div>
    );
}
