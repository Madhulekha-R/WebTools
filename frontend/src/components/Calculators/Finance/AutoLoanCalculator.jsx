import React, { useState } from "react";
import "./AutoLoanCalculator.css";

export default function AutoLoanCalculator() {
    // Tab selection
    const [activeTab, setActiveTab] = useState("totalPrice");

    // Total Price mode inputs
    const [autoPrice, setAutoPrice] = useState(50000);
    const [loanTerm, setLoanTerm] = useState(60);
    const [interestRate, setInterestRate] = useState(5);
    const [cashIncentives, setCashIncentives] = useState(0);
    const [downPayment, setDownPayment] = useState(10000);
    const [tradeInValue, setTradeInValue] = useState(0);
    const [amountOwed, setAmountOwed] = useState(0);
    const [salesTax, setSalesTax] = useState(7);
    const [titleFees, setTitleFees] = useState(2000);
    const [includeTaxesInLoan, setIncludeTaxesInLoan] = useState(false);

    // Monthly Payment mode inputs
    const [monthlyPayment, setMonthlyPayment] = useState(500);

    // Results
    const [results, setResults] = useState(null);

    function calculateTotalPrice() {
        // Calculate net trade-in value
        const netTradeIn = tradeInValue - amountOwed;

        // Calculate sale tax amount
        const taxableAmount = autoPrice - tradeInValue - cashIncentives;
        const salesTaxAmount = (taxableAmount * salesTax) / 100;

        // Calculate upfront payment
        const upfrontPayment = downPayment + titleFees + (includeTaxesInLoan ? 0 : salesTaxAmount);

        // Calculate total loan amount
        let totalLoanAmount = autoPrice - downPayment - cashIncentives - netTradeIn;
        if (includeTaxesInLoan) {
            totalLoanAmount += salesTaxAmount + titleFees;
        }

        // Calculate monthly payment using amortization formula
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm;

        let monthlyPay;
        if (interestRate === 0) {
            monthlyPay = totalLoanAmount / numPayments;
        } else {
            monthlyPay = totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        const totalLoanPayments = monthlyPay * numPayments;
        const totalInterest = totalLoanPayments - totalLoanAmount;
        const totalCost = autoPrice + salesTaxAmount + titleFees + totalInterest;

        const principalPercent = (totalLoanAmount / totalLoanPayments) * 100;
        const interestPercent = (totalInterest / totalLoanPayments) * 100;

        return {
            monthlyPay,
            totalLoanAmount,
            salesTaxAmount,
            upfrontPayment,
            totalLoanPayments,
            totalInterest,
            totalCost,
            principalPercent,
            interestPercent,
            numPayments
        };
    }

    function calculateMonthlyPayment() {
        // Reverse calculation: given monthly payment, calculate auto price
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm;

        // Calculate loan amount from monthly payment
        let loanAmount;
        if (interestRate === 0) {
            loanAmount = monthlyPayment * numPayments;
        } else {
            loanAmount = monthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) /
                (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
        }

        const netTradeIn = tradeInValue - amountOwed;

        // Calculate auto price
        let calculatedAutoPrice = loanAmount + downPayment + cashIncentives + netTradeIn;

        if (includeTaxesInLoan) {
            // If taxes are in loan, we need to solve for auto price
            // loanAmount = autoPrice - downPayment - cashIncentives - netTradeIn + salesTax + titleFees
            // salesTax = (autoPrice - tradeInValue - cashIncentives) * salesTaxRate
            // Solving: loanAmount = autoPrice - downPayment - cashIncentives - netTradeIn + 
            //                       (autoPrice - tradeInValue - cashIncentives) * salesTaxRate + titleFees
            const taxRate = salesTax / 100;
            calculatedAutoPrice = (loanAmount - titleFees + downPayment + cashIncentives + netTradeIn -
                (tradeInValue + cashIncentives) * taxRate) / (1 + taxRate);
        }

        const taxableAmount = calculatedAutoPrice - tradeInValue - cashIncentives;
        const salesTaxAmount = (taxableAmount * salesTax) / 100;

        const upfrontPayment = downPayment + titleFees + (includeTaxesInLoan ? 0 : salesTaxAmount);

        const totalLoanPayments = monthlyPayment * numPayments;
        const totalInterest = totalLoanPayments - loanAmount;
        const totalCost = calculatedAutoPrice + salesTaxAmount + titleFees + totalInterest;

        const principalPercent = (loanAmount / totalLoanPayments) * 100;
        const interestPercent = (totalInterest / totalLoanPayments) * 100;

        return {
            monthlyPay: monthlyPayment,
            totalLoanAmount: loanAmount,
            salesTaxAmount,
            upfrontPayment,
            totalLoanPayments,
            totalInterest,
            totalCost,
            principalPercent,
            interestPercent,
            numPayments,
            calculatedAutoPrice
        };
    }

    function handleCalculate(e) {
        e.preventDefault();

        let calculationResults;

        if (activeTab === "totalPrice") {
            calculationResults = calculateTotalPrice();
        } else {
            calculationResults = calculateMonthlyPayment();
        }

        setResults({ ...calculationResults, mode: activeTab });
    }

    function handleClear() {
        if (activeTab === "totalPrice") {
            setAutoPrice(50000);
            setLoanTerm(60);
            setInterestRate(5);
            setCashIncentives(0);
            setDownPayment(10000);
            setTradeInValue(0);
            setAmountOwed(0);
            setSalesTax(7);
            setTitleFees(2000);
            setIncludeTaxesInLoan(false);
        } else {
            setMonthlyPayment(500);
            setLoanTerm(60);
            setInterestRate(5);
            setCashIncentives(0);
            setDownPayment(10000);
            setTradeInValue(0);
            setAmountOwed(0);
            setSalesTax(7);
            setTitleFees(2000);
            setIncludeTaxesInLoan(false);
        }
        setResults(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Auto Loan Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate monthly payments and total costs for your auto loan
                </div>
            </div>

            {/* Tab Selector */}
            <div className="loan-mode-selector">
                <button
                    className={`loan-mode-btn ${activeTab === "totalPrice" ? "active" : ""}`}
                    onClick={() => { setActiveTab("totalPrice"); setResults(null); }}
                >
                    Total Price
                </button>
                <button
                    className={`loan-mode-btn ${activeTab === "monthlyPayment" ? "active" : ""}`}
                    onClick={() => { setActiveTab("monthlyPayment"); setResults(null); }}
                >
                    Monthly Payment
                </button>
            </div>

            <div className="mortgage-container">
                <form className="mortgage-input-section" onSubmit={handleCalculate}>
                    <div className="mortgage-card">
                        {activeTab === "totalPrice" ? (
                            <>
                                <label className="age-label">Auto Price ($)</label>
                                <input
                                    className="age-input"
                                    type="number"
                                    value={autoPrice}
                                    onChange={e => setAutoPrice(parseFloat(e.target.value) || 0)}
                                    step="1000"
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

                        <label className="age-label">Loan Term (months)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={loanTerm}
                            onChange={e => setLoanTerm(parseFloat(e.target.value) || 0)}
                            min="1"
                        />

                        <label className="age-label">Interest Rate (%)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={interestRate}
                            onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                        />

                        <label className="age-label">Cash Incentives ($)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={cashIncentives}
                            onChange={e => setCashIncentives(parseFloat(e.target.value) || 0)}
                        />

                        <label className="age-label">Down Payment ($)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={downPayment}
                            onChange={e => setDownPayment(parseFloat(e.target.value) || 0)}
                        />

                        <label className="age-label">Trade-in Value ($)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={tradeInValue}
                            onChange={e => setTradeInValue(parseFloat(e.target.value) || 0)}
                        />

                        <label className="age-label">Amount Owed on Trade-in ($)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={amountOwed}
                            onChange={e => setAmountOwed(parseFloat(e.target.value) || 0)}
                        />

                        <label className="age-label">Sales Tax (%)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={salesTax}
                            onChange={e => setSalesTax(parseFloat(e.target.value) || 0)}
                            step="0.1"
                        />

                        <label className="age-label">Title, Registration and Other Fees ($)</label>
                        <input
                            className="age-input"
                            type="number"
                            value={titleFees}
                            onChange={e => setTitleFees(parseFloat(e.target.value) || 0)}
                        />

                        <div className="mortgage-checkbox-wrapper">
                            <label className="mortgage-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={includeTaxesInLoan}
                                    onChange={e => setIncludeTaxesInLoan(e.target.checked)}
                                />
                                <span>Include taxes and fees in loan</span>
                            </label>
                        </div>

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
                                <span className="mortgage-payment-value">${results.monthlyPay.toFixed(2)}</span>
                            </div>

                            <div className="auto-loan-results-grid">
                                {activeTab === "monthlyPayment" && (
                                    <div className="auto-loan-result-row">
                                        <span>Auto Price</span>
                                        <span className="auto-loan-result-value">${results.calculatedAutoPrice.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="auto-loan-result-row">
                                    <span>Total Loan Amount</span>
                                    <span className="auto-loan-result-value">${results.totalLoanAmount.toFixed(2)}</span>
                                </div>
                                <div className="auto-loan-result-row">
                                    <span>Sale Tax</span>
                                    <span className="auto-loan-result-value">${results.salesTaxAmount.toFixed(2)}</span>
                                </div>
                                <div className="auto-loan-result-row">
                                    <span>Upfront Payment</span>
                                    <span className="auto-loan-result-value">${results.upfrontPayment.toFixed(2)}</span>
                                </div>
                                <div className="auto-loan-result-row">
                                    <span>Total of {results.numPayments} Loan Payments</span>
                                    <span className="auto-loan-result-value">${results.totalLoanPayments.toFixed(2)}</span>
                                </div>
                                <div className="auto-loan-result-row">
                                    <span>Total Loan Interest</span>
                                    <span className="auto-loan-result-value">${results.totalInterest.toFixed(2)}</span>
                                </div>
                                <div className="auto-loan-result-row auto-loan-total-row">
                                    <span>Total Cost (price, interest, tax, fees)</span>
                                    <span className="auto-loan-result-value">${results.totalCost.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Pie Chart */}
                            <div className="mortgage-chart-container">
                                <h4 style={{ color: '#00ff94', textAlign: 'center', marginBottom: '20px' }}>Loan Breakdown</h4>
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
                    </div>
                )}
            </div>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>About Auto Loans</h3>
                <p>
                    The Auto Loan Calculator is mainly intended for car purchases within the U.S. People outside the U.S.
                    may still use the calculator, but please adjust accordingly. If only the monthly payment for any auto
                    loan is given, use the Monthly Payment tab (reverse auto loan) to calculate the actual vehicle purchase
                    price and other auto loan information.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Auto Loans</h4>
                <p>
                    Most people turn to auto loans during a vehicle purchase. They work as any generic, secured loan from
                    a financial institution does with a typical term of 36, 60, 72, or 84 months in the U.S. Each month,
                    repayment of principal and interest must be made from borrowers to auto loan lenders. Money borrowed
                    from a lender that isn't paid back can result in the car being legally repossessed.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Dealership Financing vs. Direct Lending</h4>
                <p>
                    Generally, there are two main financing options available when it comes to auto loans: direct lending
                    or dealership financing. The former comes in the form of a typical loan originating from a bank, credit
                    union, or financial institution. Once a contract has been entered with a car dealer to buy a vehicle,
                    the loan is used from the direct lender to pay for the new car. Dealership financing is somewhat similar
                    except that the auto loan, and thus paperwork, is initiated and completed through the dealership instead.
                </p>
                <p>
                    Direct lending provides more leverage for buyers to walk into a car dealer with most of the financing
                    done on their terms, as it places further stress on the car dealer to compete with a better rate. Getting
                    pre-approved doesn't tie car buyers down to any one dealership, and their propensity to simply walk away
                    is much higher. With dealer financing, the potential car buyer has fewer choices when it comes to interest
                    rate shopping, though it's there for convenience for anyone who doesn't want to spend time shopping or
                    cannot get an auto loan through direct lending.
                </p>
            </div>
        </div>
    );
}
