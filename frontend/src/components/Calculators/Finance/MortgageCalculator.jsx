import React, { useState } from "react";
import "./MortgageCalculator.css";

export default function MortgageCalculator() {
    // Input states
    const [homePrice, setHomePrice] = useState(400000);
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [loanTerm, setLoanTerm] = useState(30);
    const [interestRate, setInterestRate] = useState(6.192);
    const [startMonth, setStartMonth] = useState("Dec");
    const [startYear, setStartYear] = useState(2025);

    // Tax & Cost states
    const [includeTaxes, setIncludeTaxes] = useState(true);
    const [propertyTaxPercent, setPropertyTaxPercent] = useState(1.2);
    const [homeInsurance, setHomeInsurance] = useState(1500);
    const [pmiInsurance, setPmiInsurance] = useState(0);
    const [hoaFee, setHoaFee] = useState(0);
    const [otherCosts, setOtherCosts] = useState(4000);

    // Results state
    const [results, setResults] = useState(null);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function handleCalculate(e) {
        e.preventDefault();

        // Calculate loan amount
        const downPaymentAmount = homePrice * (downPaymentPercent / 100);
        const loanAmount = homePrice - downPaymentAmount;

        // Calculate monthly interest rate
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm * 12;

        // Calculate monthly mortgage payment using formula: M = P[r(1+r)^n]/[(1+r)^n-1]
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1);

        // Calculate taxes and costs
        const monthlyPropertyTax = includeTaxes ? (homePrice * (propertyTaxPercent / 100)) / 12 : 0;
        const monthlyHomeInsurance = includeTaxes ? homeInsurance / 12 : 0;
        const monthlyPMI = includeTaxes ? pmiInsurance / 12 : 0;
        const monthlyHOA = includeTaxes ? hoaFee / 12 : 0;
        const monthlyOtherCosts = includeTaxes ? otherCosts / 12 : 0;

        const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyHomeInsurance +
            monthlyPMI + monthlyHOA + monthlyOtherCosts;

        // Calculate totals
        const totalMortgagePayments = monthlyPayment * numPayments;
        const totalPropertyTax = monthlyPropertyTax * numPayments;
        const totalHomeInsurance = monthlyHomeInsurance * numPayments;
        const totalPMI = monthlyPMI * numPayments;
        const totalHOA = monthlyHOA * numPayments;
        const totalOtherCosts = monthlyOtherCosts * numPayments;
        const totalOutOfPocket = totalMonthlyPayment * numPayments;
        const totalInterest = totalMortgagePayments - loanAmount;

        // Calculate payoff date
        const monthIndex = months.indexOf(startMonth);
        const payoffYear = parseInt(startYear) + loanTerm;

        // Calculate percentages for pie chart
        const principalInterestPercent = (monthlyPayment / totalMonthlyPayment) * 100;
        const propertyTaxPercent = (monthlyPropertyTax / totalMonthlyPayment) * 100;
        const insurancePercent = (monthlyHomeInsurance / totalMonthlyPayment) * 100;
        const otherPercent = ((monthlyPMI + monthlyHOA + monthlyOtherCosts) / totalMonthlyPayment) * 100;

        setResults({
            monthlyPayment,
            monthlyPropertyTax,
            monthlyHomeInsurance,
            monthlyPMI,
            monthlyHOA,
            monthlyOtherCosts,
            totalMonthlyPayment,
            totalMortgagePayments,
            totalPropertyTax,
            totalHomeInsurance,
            totalPMI,
            totalHOA,
            totalOtherCosts,
            totalOutOfPocket,
            loanAmount,
            downPaymentAmount,
            totalInterest,
            numPayments,
            payoffDate: `${startMonth}, ${payoffYear}`,
            principalInterestPercent,
            propertyTaxPercent,
            insurancePercent,
            otherPercent
        });
    }

    function handleClear() {
        setHomePrice(400000);
        setDownPaymentPercent(20);
        setLoanTerm(30);
        setInterestRate(6.192);
        setStartMonth("Dec");
        setStartYear(2025);
        setPropertyTaxPercent(1.2);
        setHomeInsurance(1500);
        setPmiInsurance(0);
        setHoaFee(0);
        setOtherCosts(4000);
        setIncludeTaxes(true);
        setResults(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Mortgage Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate your monthly mortgage payment including taxes, insurance, and other costs
                </div>
            </div>

            <div className="mortgage-container">
                <form className="mortgage-input-section" onSubmit={handleCalculate}>
                    <div className="mortgage-card">
                        <h3 className="mortgage-section-title">Loan Details</h3>

                        <label className="age-label">Home Price ($)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={homePrice}
                            onChange={e => setHomePrice(parseFloat(e.target.value) || 0)}
                            step="1000"
                        />

                        <label className="age-label">Down Payment (%)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={downPaymentPercent}
                            onChange={e => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            min="0"
                            max="100"
                        />

                        <label className="age-label">Loan Term (years)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={loanTerm}
                            onChange={e => setLoanTerm(parseFloat(e.target.value) || 0)}
                            min="1"
                            max="50"
                        />

                        <label className="age-label">Interest Rate (%)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={interestRate}
                            onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                            step="0.001"
                            min="0"
                        />

                        <label className="age-label">Start Date</label>
                        <div className="mortgage-date-inputs">
                            <select
                                className="age-input mortgage-select"
                                value={startMonth}
                                onChange={e => setStartMonth(e.target.value)}
                            >
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <input
                                className="age-input"
                                type="number"
                                value={startYear}
                                onChange={e => setStartYear(e.target.value)}
                                min="2020"
                                max="2100"
                            />
                        </div>

                        <div className="mortgage-checkbox-wrapper">
                            <label className="mortgage-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={includeTaxes}
                                    onChange={e => setIncludeTaxes(e.target.checked)}
                                />
                                <span>Include Taxes & Costs Below</span>
                            </label>
                        </div>

                        {includeTaxes && (
                            <div className="mortgage-taxes-section">
                                <h4 className="mortgage-subsection-title">Annual Tax & Cost</h4>

                                <label className="age-label">Property Taxes (%)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={propertyTaxPercent}
                                    onChange={e => setPropertyTaxPercent(parseFloat(e.target.value) || 0)}
                                    step="0.1"
                                />

                                <label className="age-label">Home Insurance ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={homeInsurance}
                                    onChange={e => setHomeInsurance(parseFloat(e.target.value) || 0)}
                                />

                                <label className="age-label">PMI Insurance ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={pmiInsurance}
                                    onChange={e => setPmiInsurance(parseFloat(e.target.value) || 0)}
                                />

                                <label className="age-label">HOA Fee ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={hoaFee}
                                    onChange={e => setHoaFee(parseFloat(e.target.value) || 0)}
                                />

                                <label className="age-label">Other Costs ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={otherCosts}
                                    onChange={e => setOtherCosts(parseFloat(e.target.value) || 0)}
                                />
                            </div>
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
                            <div className="mortgage-monthly-payment">
                                <span className="mortgage-payment-label">Monthly Pay:</span>
                                <span className="mortgage-payment-value">${results.totalMonthlyPayment.toFixed(2)}</span>
                            </div>

                            <div className="mortgage-breakdown-table">
                                <div className="mortgage-table-header">
                                    <div></div>
                                    <div>Monthly</div>
                                    <div>Total</div>
                                </div>

                                <div className="mortgage-table-row">
                                    <div className="mortgage-row-label">Mortgage Payment</div>
                                    <div>${results.monthlyPayment.toFixed(2)}</div>
                                    <div>${results.totalMortgagePayments.toFixed(2)}</div>
                                </div>

                                {includeTaxes && (
                                    <>
                                        <div className="mortgage-table-row">
                                            <div className="mortgage-row-label">Property Tax</div>
                                            <div>${results.monthlyPropertyTax.toFixed(2)}</div>
                                            <div>${results.totalPropertyTax.toFixed(2)}</div>
                                        </div>

                                        <div className="mortgage-table-row">
                                            <div className="mortgage-row-label">Home Insurance</div>
                                            <div>${results.monthlyHomeInsurance.toFixed(2)}</div>
                                            <div>${results.totalHomeInsurance.toFixed(2)}</div>
                                        </div>

                                        {(results.monthlyPMI + results.monthlyHOA + results.monthlyOtherCosts) > 0 && (
                                            <div className="mortgage-table-row">
                                                <div className="mortgage-row-label">Other Costs</div>
                                                <div>${(results.monthlyPMI + results.monthlyHOA + results.monthlyOtherCosts).toFixed(2)}</div>
                                                <div>${(results.totalPMI + results.totalHOA + results.totalOtherCosts).toFixed(2)}</div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="mortgage-table-row mortgage-total-row">
                                    <div className="mortgage-row-label">Total Out-of-Pocket</div>
                                    <div>${results.totalMonthlyPayment.toFixed(2)}</div>
                                    <div>${results.totalOutOfPocket.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Pie Chart */}
                            <div className="mortgage-chart-container">
                                <svg viewBox="0 0 200 200" className="mortgage-pie-chart">
                                    {/* Principal & Interest */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#4285f4"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.principalInterestPercent * 5.027} 502.7`}
                                        transform="rotate(-90 100 100)"
                                    />
                                    {/* Property Taxes */}
                                    {includeTaxes && results.propertyTaxPercent > 0 && (
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="#34a853"
                                            strokeWidth="40"
                                            strokeDasharray={`${results.propertyTaxPercent * 5.027} 502.7`}
                                            strokeDashoffset={-results.principalInterestPercent * 5.027}
                                            transform="rotate(-90 100 100)"
                                        />
                                    )}
                                    {/* Home Insurance */}
                                    {includeTaxes && results.insurancePercent > 0 && (
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="#ea4335"
                                            strokeWidth="40"
                                            strokeDasharray={`${results.insurancePercent * 5.027} 502.7`}
                                            strokeDashoffset={-(results.principalInterestPercent + results.propertyTaxPercent) * 5.027}
                                            transform="rotate(-90 100 100)"
                                        />
                                    )}
                                    {/* Other Costs */}
                                    {includeTaxes && results.otherPercent > 0 && (
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="#00cfff"
                                            strokeWidth="40"
                                            strokeDasharray={`${results.otherPercent * 5.027} 502.7`}
                                            strokeDashoffset={-(results.principalInterestPercent + results.propertyTaxPercent + results.insurancePercent) * 5.027}
                                            transform="rotate(-90 100 100)"
                                        />
                                    )}
                                    {/* Center white circle */}
                                    <circle cx="100" cy="100" r="60" fill="#23272f" />
                                </svg>

                                <div className="mortgage-legend">
                                    <div className="mortgage-legend-item">
                                        <span className="mortgage-legend-color" style={{ backgroundColor: '#4285f4' }}></span>
                                        <span>Principal & Interest ({results.principalInterestPercent.toFixed(0)}%)</span>
                                    </div>
                                    {includeTaxes && results.propertyTaxPercent > 0 && (
                                        <div className="mortgage-legend-item">
                                            <span className="mortgage-legend-color" style={{ backgroundColor: '#34a853' }}></span>
                                            <span>Property Taxes ({results.propertyTaxPercent.toFixed(0)}%)</span>
                                        </div>
                                    )}
                                    {includeTaxes && results.insurancePercent > 0 && (
                                        <div className="mortgage-legend-item">
                                            <span className="mortgage-legend-color" style={{ backgroundColor: '#ea4335' }}></span>
                                            <span>Home Insurance ({results.insurancePercent.toFixed(0)}%)</span>
                                        </div>
                                    )}
                                    {includeTaxes && results.otherPercent > 0 && (
                                        <div className="mortgage-legend-item">
                                            <span className="mortgage-legend-color" style={{ backgroundColor: '#00cfff' }}></span>
                                            <span>Other Cost ({results.otherPercent.toFixed(0)}%)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* House Price Summary */}
                            <div className="mortgage-summary">
                                <h4 className="mortgage-summary-title">House Price</h4>
                                <div className="mortgage-summary-row">
                                    <span>Loan Amount</span>
                                    <span>${results.loanAmount.toFixed(2)}</span>
                                </div>
                                <div className="mortgage-summary-row">
                                    <span>Down Payment</span>
                                    <span>${results.downPaymentAmount.toFixed(2)}</span>
                                </div>
                                <div className="mortgage-summary-row">
                                    <span>Total of {results.numPayments} Mortgage Payments</span>
                                    <span>${results.totalMortgagePayments.toFixed(2)}</span>
                                </div>
                                <div className="mortgage-summary-row">
                                    <span>Total Interest</span>
                                    <span>${results.totalInterest.toFixed(2)}</span>
                                </div>
                                <div className="mortgage-summary-row">
                                    <span>Mortgage Payoff Date</span>
                                    <span>{results.payoffDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>About Mortgages</h3>
                <p>
                    The Mortgage Calculator helps estimate the monthly payment due along with other financial costs
                    associated with mortgages. There are options to include extra payments or annual percentage
                    increases of common mortgage-related expenses. The calculator is mainly intended for use by U.S.
                    residents.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>What is a Mortgage?</h4>
                <p>
                    A mortgage is a loan secured by property, usually real estate property. Lenders define it as the
                    money borrowed to pay for real estate. In essence, the lender helps the buyer pay the seller of a
                    house, and the buyer agrees to repay the money borrowed over a period of time, usually 15 or 30
                    years in the U.S. Each month, a payment is made from buyer to lender. A portion of the monthly
                    payment is called the principal, which is the original amount borrowed. The other portion is the
                    interest, which is the cost paid to the lender for using the money. There may be an escrow account
                    involved to cover the cost of property taxes and insurance. The buyer cannot be considered the full
                    owner of the mortgaged property until the last monthly payment is made.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Fixed-Rate vs. Adjustable-Rate</h4>
                <p>
                    In the U.S., the most common mortgage loan is the conventional 30-year fixed-interest loan, which
                    represents 70% to 90% of all mortgages. Fixed-rate mortgages have interest rates that remain
                    unchanged over the life of the loan, providing predictable monthly payments. Adjustable-rate
                    mortgages (ARMs) have interest rates that can change periodically based on market conditions,
                    which can result in varying monthly payments.
                </p>
            </div>
        </div>
    );
}
