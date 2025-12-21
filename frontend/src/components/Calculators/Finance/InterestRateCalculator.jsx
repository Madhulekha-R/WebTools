import React, { useState } from 'react';
import './InterestRateCalculator.css';

const InterestRateCalculator = () => {
    const [loanAmount, setLoanAmount] = useState('32000');
    const [loanTermYears, setLoanTermYears] = useState('3');
    const [loanTermMonths, setLoanTermMonths] = useState('0');
    const [monthlyPayment, setMonthlyPayment] = useState('960');
    const [results, setResults] = useState(null);

    const calculateInterestRate = () => {
        const principal = parseFloat(loanAmount) || 0;
        const years = parseFloat(loanTermYears) || 0;
        const months = parseFloat(loanTermMonths) || 0;
        const payment = parseFloat(monthlyPayment) || 0;

        const totalMonths = years * 12 + months;

        if (principal <= 0 || totalMonths <= 0 || payment <= 0) {
            alert('Please enter valid values');
            return;
        }

        // Use Newton-Raphson method to find interest rate
        const interestRate = findInterestRate(principal, totalMonths, payment);

        if (interestRate === null) {
            alert('Could not calculate interest rate. Please check your inputs.');
            return;
        }

        const totalPayment = payment * totalMonths;
        const totalInterest = totalPayment - principal;

        // Generate amortization schedule
        const schedule = generateAmortizationSchedule(principal, interestRate, totalMonths, payment);

        // Calculate principal and interest breakdown
        const principalPercent = (principal / totalPayment) * 100;
        const interestPercent = (totalInterest / totalPayment) * 100;

        setResults({
            interestRate: interestRate * 100,
            totalPayment,
            totalInterest,
            schedule,
            principalPercent,
            interestPercent,
            totalMonths
        });
    };

    const findInterestRate = (principal, months, payment) => {
        // Newton-Raphson method to find monthly interest rate
        let rate = 0.005; // Initial guess (0.5% monthly = 6% annual)
        const maxIterations = 100;
        const tolerance = 0.000001;

        for (let i = 0; i < maxIterations; i++) {
            if (rate <= 0) rate = 0.000001;

            // Calculate payment with current rate
            const x = Math.pow(1 + rate, months);
            const calculatedPayment = principal * (rate * x) / (x - 1);

            // Calculate derivative
            const dx = 0.000001;
            const x2 = Math.pow(1 + rate + dx, months);
            const calculatedPayment2 = principal * ((rate + dx) * x2) / (x2 - 1);
            const derivative = (calculatedPayment2 - calculatedPayment) / dx;

            // Newton-Raphson update
            const newRate = rate - (calculatedPayment - payment) / derivative;

            if (Math.abs(newRate - rate) < tolerance) {
                return newRate;
            }

            rate = newRate;
        }

        return rate;
    };

    const generateAmortizationSchedule = (principal, monthlyRate, months, payment) => {
        const schedule = [];
        let balance = principal;

        for (let month = 1; month <= months; month++) {
            const interest = balance * monthlyRate;
            const principalPayment = payment - interest;
            balance -= principalPayment;

            schedule.push({
                month,
                balance: Math.max(0, balance),
                interest,
                payment
            });
        }

        return schedule;
    };

    const handleClear = () => {
        setLoanAmount('32000');
        setLoanTermYears('3');
        setLoanTermMonths('0');
        setMonthlyPayment('960');
        setResults(null);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatPercent = (value) => {
        return value.toFixed(3) + '%';
    };

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Interest Rate Calculator</h2>
                <div className="age-calc-subheading">
                    Determine real interest rates on loans with fixed terms and monthly payments
                </div>
            </div>

            <p className="interest-intro">
                The Interest Rate Calculator determines real interest rates on loans with fixed terms and monthly
                payments. For example, it can calculate interest rates in situations where car dealers only provide
                monthly payment information and total price without including the actual rate on the car loan. To
                calculate the interest on investments instead, use the{' '}
                <a href="/calculators/financial/investment" style={{ color: '#00cfff' }}>Interest Calculator</a>, or use the{' '}
                <a href="/calculators/financial/compound-interest" style={{ color: '#00cfff' }}>Compound Interest Calculator</a>{' '}
                to understand the difference between different interest rates.
            </p>

            <div className="interest-container">
                <div className="interest-input-section">
                    <div className="interest-card">
                        <div className="input-group">
                            <label>Loan amount</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Loan term</label>
                            <div className="interest-term-row">
                                <input
                                    type="number"
                                    value={loanTermYears}
                                    onChange={(e) => setLoanTermYears(e.target.value)}
                                    className="form-input"
                                />
                                <span className="interest-term-label">years</span>
                                <input
                                    type="number"
                                    value={loanTermMonths}
                                    onChange={(e) => setLoanTermMonths(e.target.value)}
                                    className="form-input"
                                />
                                <span className="interest-term-label">months</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Monthly payment</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={monthlyPayment}
                                    onChange={(e) => setMonthlyPayment(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="interest-button-group">
                            <button onClick={calculateInterestRate} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn interest-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="interest-results-section">
                        <div className="interest-card interest-results-card">
                            <h3 className="interest-section-title">Results</h3>
                            <div className="interest-results-box">
                                <div className="interest-result-row highlight">
                                    <span className="interest-result-label">Interest rate</span>
                                    <span className="interest-result-value">{formatPercent(results.interestRate)}</span>
                                </div>
                                <div className="interest-result-row">
                                    <span className="interest-result-label">Total of {results.totalMonths} monthly payments</span>
                                    <span className="interest-result-value">{formatCurrency(results.totalPayment)}</span>
                                </div>
                                <div className="interest-result-row">
                                    <span className="interest-result-label">Total interest paid</span>
                                    <span className="interest-result-value">{formatCurrency(results.totalInterest)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            {results && (
                <div className="interest-charts-container">
                    <div className="interest-charts-row">
                        {/* Amortization Graph */}
                        <div className="interest-card interest-chart-card">
                            <h3 className="interest-section-title">Loan Amortization Graph</h3>
                            <div className="interest-chart">
                                <svg viewBox="0 0 400 250" className="interest-line-chart">
                                    {/* Grid lines */}
                                    <line x1="50" y1="200" x2="350" y2="200" stroke="#444" strokeWidth="1" />
                                    <line x1="50" y1="150" x2="350" y2="150" stroke="#444" strokeWidth="0.5" strokeDasharray="2,2" />
                                    <line x1="50" y1="100" x2="350" y2="100" stroke="#444" strokeWidth="0.5" strokeDasharray="2,2" />
                                    <line x1="50" y1="50" x2="350" y2="50" stroke="#444" strokeWidth="0.5" strokeDasharray="2,2" />
                                    <line x1="50" y1="200" x2="50" y2="20" stroke="#444" strokeWidth="1" />

                                    {/* Balance line (blue) */}
                                    <polyline
                                        points={results.schedule.map((item, i) => {
                                            const x = 50 + (i / results.totalMonths) * 300;
                                            const y = 200 - (item.balance / parseFloat(loanAmount)) * 180;
                                            return `${x},${y}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="#4169E1"
                                        strokeWidth="2"
                                    />

                                    {/* Payment line (red) */}
                                    <line x1="50" y1="200" x2="350" y2="20" stroke="#DC143C" strokeWidth="2" />

                                    {/* Interest line (green) */}
                                    <polyline
                                        points={results.schedule.map((item, i) => {
                                            const x = 50 + (i / results.totalMonths) * 300;
                                            const y = 200 - (item.interest / parseFloat(monthlyPayment)) * 180;
                                            return `${x},${y}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="#32CD32"
                                        strokeWidth="2"
                                    />

                                    {/* Legend */}
                                    <rect x="100" y="220" width="15" height="3" fill="#4169E1" />
                                    <text x="120" y="225" fill="#b0b3b8" fontSize="12">Balance</text>

                                    <rect x="180" y="220" width="15" height="3" fill="#32CD32" />
                                    <text x="200" y="225" fill="#b0b3b8" fontSize="12">Interest</text>

                                    <rect x="260" y="220" width="15" height="3" fill="#DC143C" />
                                    <text x="280" y="225" fill="#b0b3b8" fontSize="12">Payment</text>

                                    {/* Axes labels */}
                                    <text x="200" y="245" fill="#b0b3b8" fontSize="12" textAnchor="middle">Year</text>
                                    <text x="10" y="25" fill="#b0b3b8" fontSize="12">$30K</text>
                                    <text x="10" y="105" fill="#b0b3b8" fontSize="12">$20K</text>
                                    <text x="10" y="155" fill="#b0b3b8" fontSize="12">$10K</text>
                                    <text x="20" y="205" fill="#b0b3b8" fontSize="12">$0</text>

                                    {/* X-axis markers */}
                                    <text x="50" y="215" fill="#b0b3b8" fontSize="12" textAnchor="middle">0</text>
                                    <text x="200" y="215" fill="#b0b3b8" fontSize="12" textAnchor="middle">
                                        {Math.floor(results.totalMonths / 24)}
                                    </text>
                                    <text x="350" y="215" fill="#b0b3b8" fontSize="12" textAnchor="middle">
                                        {Math.floor(results.totalMonths / 12)}
                                    </text>
                                </svg>
                            </div>
                        </div>

                        {/* Payment Breakdown Pie Chart */}
                        <div className="interest-card interest-chart-card">
                            <h3 className="interest-section-title">Payment Breakdown</h3>
                            <div className="interest-chart">
                                <svg viewBox="0 0 300 250" className="interest-pie-chart">
                                    {/* Calculate pie slices */}
                                    {(() => {
                                        const centerX = 150;
                                        const centerY = 120;
                                        const radius = 80;
                                        const principalAngle = (results.principalPercent / 100) * 360;
                                        const interestAngle = (results.interestPercent / 100) * 360;

                                        // Principal slice (blue)
                                        const principalEndAngle = principalAngle;
                                        const principalX = centerX + radius * Math.cos((principalEndAngle - 90) * Math.PI / 180);
                                        const principalY = centerY + radius * Math.sin((principalEndAngle - 90) * Math.PI / 180);
                                        const principalLargeArc = principalAngle > 180 ? 1 : 0;

                                        // Interest slice (green)
                                        const interestStartAngle = principalAngle;
                                        const interestEndAngle = principalAngle + interestAngle;

                                        return (
                                            <>
                                                {/* Principal slice */}
                                                <path
                                                    d={`M ${centerX} ${centerY} L ${centerX} ${centerY - radius} A ${radius} ${radius} 0 ${principalLargeArc} 1 ${principalX} ${principalY} Z`}
                                                    fill="#4169E1"
                                                />
                                                {/* Interest slice */}
                                                <path
                                                    d={`M ${centerX} ${centerY} L ${principalX} ${principalY} A ${radius} ${radius} 0 0 1 ${centerX} ${centerY - radius} Z`}
                                                    fill="#32CD32"
                                                />
                                                {/* Center white circle for donut effect */}
                                                <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="#23272f" />

                                                {/* Percentage labels */}
                                                <text x={centerX} y={centerY - 10} fill="#4169E1" fontSize="20" fontWeight="bold" textAnchor="middle">
                                                    {Math.round(results.principalPercent)}%
                                                </text>
                                                <text x={centerX + 50} y={centerY - 50} fill="#32CD32" fontSize="16" fontWeight="bold">
                                                    {Math.round(results.interestPercent)}%
                                                </text>

                                                {/* Legend */}
                                                <rect x="100" y="210" width="20" height="15" fill="#4169E1" />
                                                <text x="125" y="222" fill="#b0b3b8" fontSize="14">Principal</text>

                                                <rect x="100" y="230" width="20" height="15" fill="#32CD32" />
                                                <text x="125" y="242" fill="#b0b3b8" fontSize="14">Interest</text>
                                            </>
                                        );
                                    })()}
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>What is Interest Rate?</h3>
                <p>
                    Interest rate is the amount charged by lenders to borrowers for the use of money, expressed as a
                    percentage of the principal, or original amount borrowed; it can also be described alternatively as the
                    cost to borrow money. For instance, an 8% interest rate for borrowing $100 a year will obligate a
                    person to pay $108 at year-end. As can be seen in this brief example, the interest rate directly affects
                    the total interest paid on any loan. Generally, borrowers want the lowest possible interest rates
                    because it will cost less to borrow; conversely, lenders (or investors) seek high interest rates for larger
                    profits. Interest rates are usually expressed annually, but rates can also be expressed as monthly,
                    daily, or any other period.
                </p>

                <p>
                    Interest rates are involved in almost all formal lending and borrowing transactions. Examples of real-
                    world applications of interest rates include mortgage rates, the charge on a person's outstanding debt
                    on a credit card, business loans to fund capital projects, the growth of retirement funds, amortization of
                    long-term assets, the discount offered by a supplier to a buyer for paying off an invoice earlier, and
                    much, much more.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Simple vs. Compound Interest</h4>
                <p>
                    There are two methods for calculating interest. Simple interest is calculated as a percentage of
                    principal only, while compound interest is calculated as a percentage of the principal along with any
                    accrued interest. As a result of this compounding behavior, interest earned subsequently
                    earns interest over time. The more frequently interest compounds within a given time period, the more
                    interest will be accrued. Most formal interest payment calculations today are compounded, including
                    those for this calculator, and any following reference to the interest rate will refer to compound interest
                    rather than simple interest unless otherwise specified. To do calculations or learn more about the
                    differences between compounding frequencies, please visit the{' '}
                    <a href="/calculators/financial/compound-interest" style={{ color: '#00cfff' }}>Compound Interest Calculator</a>.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Fixed vs. Variable Interest Rates</h4>
                <p>
                    Fixed rates are rates that are set as a certain percentage for the life of the loan and will not change.
                    Variable rates are interest rates that can fluctuate over time. The degree of variance is generally based
                    on factors such as another interest rate, inflation, or a market index. There are different pros and cons
                    to each, but the Interest Rate Calculator will only display the result as a fixed interest rate.
                </p>
            </div>
        </div>
    );
};

export default InterestRateCalculator;
