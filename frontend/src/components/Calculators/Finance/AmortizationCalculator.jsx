import React, { useState } from 'react';
import './AmortizationCalculator.css';

const AmortizationCalculator = () => {
    const [loanAmount, setLoanAmount] = useState('200000');
    const [loanTermYears, setLoanTermYears] = useState('15');
    const [loanTermMonths, setLoanTermMonths] = useState('0');
    const [interestRate, setInterestRate] = useState('6');
    const [includeExtraPayments, setIncludeExtraPayments] = useState(false);
    const [extraPaymentAmount, setExtraPaymentAmount] = useState('');
    const [extraPaymentFrequency, setExtraPaymentFrequency] = useState('monthly');
    const [results, setResults] = useState(null);
    const [activeScheduleTab, setActiveScheduleTab] = useState('annual');

    const calculateAmortization = () => {
        const principal = parseFloat(loanAmount) || 0;
        const annualRate = parseFloat(interestRate) / 100 || 0;
        const monthlyRate = annualRate / 12;
        const totalYears = parseInt(loanTermYears) || 0;
        const totalMonths = parseInt(loanTermMonths) || 0;
        const totalPayments = totalYears * 12 + totalMonths;

        if (principal <= 0 || totalPayments <= 0 || annualRate < 0) {
            alert('Please enter valid values');
            return;
        }

        // Calculate monthly payment
        const monthlyPayment = monthlyRate === 0
            ? principal / totalPayments
            : (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
            (Math.pow(1 + monthlyRate, totalPayments) - 1);

        // Generate amortization schedule
        let balance = principal;
        let totalInterestPaid = 0;
        const monthlySchedule = [];
        const annualSchedule = [];

        let yearInterest = 0;
        let yearPrincipal = 0;

        for (let month = 1; month <= totalPayments; month++) {
            const interestPayment = balance * monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;

            // Handle extra payments
            let extraPayment = 0;
            if (includeExtraPayments && extraPaymentAmount) {
                const extra = parseFloat(extraPaymentAmount) || 0;
                if (extraPaymentFrequency === 'monthly') {
                    extraPayment = extra;
                } else if (extraPaymentFrequency === 'yearly' && month % 12 === 0) {
                    extraPayment = extra;
                }
            }

            principalPayment += extraPayment;

            // Ensure we don't overpay
            if (principalPayment > balance) {
                principalPayment = balance;
            }

            balance -= principalPayment;
            totalInterestPaid += interestPayment;
            yearInterest += interestPayment;
            yearPrincipal += principalPayment;

            monthlySchedule.push({
                month,
                interest: interestPayment,
                principal: principalPayment,
                balance: Math.max(0, balance),
                payment: interestPayment + principalPayment
            });

            // Create annual summary
            if (month % 12 === 0 || balance <= 0) {
                annualSchedule.push({
                    year: Math.ceil(month / 12),
                    interest: yearInterest,
                    principal: yearPrincipal,
                    balance: Math.max(0, balance)
                });
                yearInterest = 0;
                yearPrincipal = 0;
            }

            if (balance <= 0) break;
        }

        const totalPaid = principal + totalInterestPaid;
        const principalPercent = (principal / totalPaid) * 100;
        const interestPercent = (totalInterestPaid / totalPaid) * 100;

        setResults({
            monthlyPayment,
            totalPayments: monthlySchedule.length,
            totalInterest: totalInterestPaid,
            totalPaid,
            principalPercent,
            interestPercent,
            monthlySchedule,
            annualSchedule
        });
    };

    const handleClear = () => {
        setLoanAmount('200000');
        setLoanTermYears('15');
        setLoanTermMonths('0');
        setInterestRate('6');
        setIncludeExtraPayments(false);
        setExtraPaymentAmount('');
        setExtraPaymentFrequency('monthly');
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

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Amortization Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate loan amortization schedules and see how your payments break down over time
                </div>
            </div>

            <div className="amortization-container">
                {/* Input Section */}
                <div className="amortization-input-section">
                    <div className="amortization-card">
                        <h2 className="amortization-section-title">Loan Details</h2>

                        <div className="input-group">
                            <label>Loan Amount</label>
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
                            <label>Loan Term</label>
                            <div className="amortization-term-inputs">
                                <div className="input-with-suffix">
                                    <input
                                        type="number"
                                        value={loanTermYears}
                                        onChange={(e) => setLoanTermYears(e.target.value)}
                                        className="form-input"
                                        min="0"
                                    />
                                    <span className="input-suffix">years</span>
                                </div>
                                <div className="input-with-suffix">
                                    <input
                                        type="number"
                                        value={loanTermMonths}
                                        onChange={(e) => setLoanTermMonths(e.target.value)}
                                        className="form-input"
                                        min="0"
                                        max="11"
                                    />
                                    <span className="input-suffix">months</span>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Interest Rate</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    className="form-input"
                                    step="0.01"
                                />
                                <span className="input-suffix">%</span>
                            </div>
                        </div>

                        <div className="amortization-checkbox-wrapper">
                            <label className="amortization-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={includeExtraPayments}
                                    onChange={(e) => setIncludeExtraPayments(e.target.checked)}
                                />
                                <span>Optional: make extra payments</span>
                            </label>
                        </div>

                        {includeExtraPayments && (
                            <div className="amortization-extra-section">
                                <h3 className="amortization-subsection-title">Extra Payments</h3>

                                <div className="input-group">
                                    <label>Extra Payment Amount</label>
                                    <div className="input-with-prefix">
                                        <span className="input-prefix">$</span>
                                        <input
                                            type="number"
                                            value={extraPaymentAmount}
                                            onChange={(e) => setExtraPaymentAmount(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Frequency</label>
                                    <select
                                        value={extraPaymentFrequency}
                                        onChange={(e) => setExtraPaymentFrequency(e.target.value)}
                                        className="form-input amortization-select"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="amortization-button-group">
                            <button onClick={calculateAmortization} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn amortization-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="amortization-results-section">
                        <div className="amortization-card amortization-results-card">
                            <h2 className="amortization-section-title">Results</h2>

                            {/* Monthly Payment Display */}
                            <div className="amortization-monthly-payment">
                                <span className="amortization-payment-label">Monthly Payment</span>
                                <span className="amortization-payment-value">
                                    {formatCurrency(results.monthlyPayment)}
                                </span>
                            </div>

                            {/* Pie Chart */}
                            <div className="amortization-chart-container">
                                <svg className="amortization-pie-chart" viewBox="0 0 200 200">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#00cfff"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.principalPercent * 5.027} 502.7`}
                                        transform="rotate(-90 100 100)"
                                    />
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#00ff94"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.interestPercent * 5.027} 502.7`}
                                        strokeDashoffset={`-${results.principalPercent * 5.027}`}
                                        transform="rotate(-90 100 100)"
                                    />
                                    <text x="100" y="95" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="600">
                                        {results.principalPercent.toFixed(0)}%
                                    </text>
                                    <text x="100" y="115" textAnchor="middle" fill="#00cfff" fontSize="12">
                                        Principal
                                    </text>
                                </svg>

                                <div className="amortization-legend">
                                    <div className="amortization-legend-item">
                                        <div className="amortization-legend-color" style={{ background: '#00cfff' }}></div>
                                        <span>Principal ({results.principalPercent.toFixed(0)}%)</span>
                                    </div>
                                    <div className="amortization-legend-item">
                                        <div className="amortization-legend-color" style={{ background: '#00ff94' }}></div>
                                        <span>Interest ({results.interestPercent.toFixed(0)}%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="amortization-summary">
                                <h3 className="amortization-summary-title">Payment Summary</h3>
                                <div className="amortization-summary-row">
                                    <span>Total of {results.totalPayments} monthly payments</span>
                                    <span>{formatCurrency(results.totalPaid)}</span>
                                </div>
                                <div className="amortization-summary-row">
                                    <span>Total Interest</span>
                                    <span>{formatCurrency(results.totalInterest)}</span>
                                </div>
                            </div>

                            {/* Amortization Schedule */}
                            <div className="amortization-schedule">
                                <h3 className="amortization-subsection-title">Amortization Schedule</h3>

                                <div className="amortization-schedule-tabs">
                                    <button
                                        className={`amortization-tab ${activeScheduleTab === 'annual' ? 'active' : ''}`}
                                        onClick={() => setActiveScheduleTab('annual')}
                                    >
                                        Annual Schedule
                                    </button>
                                    <button
                                        className={`amortization-tab ${activeScheduleTab === 'monthly' ? 'active' : ''}`}
                                        onClick={() => setActiveScheduleTab('monthly')}
                                    >
                                        Monthly Schedule
                                    </button>
                                </div>

                                {activeScheduleTab === 'annual' && (
                                    <div className="amortization-table">
                                        <div className="amortization-table-header">
                                            <div>Year</div>
                                            <div>Interest</div>
                                            <div>Principal</div>
                                            <div>Ending Balance</div>
                                        </div>
                                        <div className="amortization-table-body">
                                            {results.annualSchedule.map((row, index) => (
                                                <div key={index} className="amortization-table-row">
                                                    <div>{row.year}</div>
                                                    <div>{formatCurrency(row.interest)}</div>
                                                    <div>{formatCurrency(row.principal)}</div>
                                                    <div>{formatCurrency(row.balance)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeScheduleTab === 'monthly' && (
                                    <div className="amortization-table amortization-monthly-table">
                                        <div className="amortization-table-header">
                                            <div>Month</div>
                                            <div>Interest</div>
                                            <div>Principal</div>
                                            <div>Balance</div>
                                        </div>
                                        <div className="amortization-table-body">
                                            {results.monthlySchedule.map((row, index) => (
                                                <div key={index} className="amortization-table-row">
                                                    <div>{row.month}</div>
                                                    <div>{formatCurrency(row.interest)}</div>
                                                    <div>{formatCurrency(row.principal)}</div>
                                                    <div>{formatCurrency(row.balance)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>What is Amortization?</h3>
                <p>
                    There are two general definitions of amortization. The first is the systematic repayment of a loan over
                    time. The second is used in the context of business accounting and is the act of spreading the cost of
                    an expensive and long-lived item over many periods. The two are explained in more detail in the
                    sections below.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Paying Off a Loan Over Time</h4>
                <p>
                    When a borrower takes out a mortgage, car loan, or personal loan, they usually make monthly
                    payments to the lender; these are some of the most common uses of amortization. A part of the
                    payment covers the interest due on the loan, and the remainder of the payment goes toward reducing
                    the principal amount owed. Interest is computed on the current amount owed and thus will become
                    progressively smaller as the principal decreases. It is possible to see this in action on the amortization
                    table.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Amortization Schedule</h4>
                <p>
                    An amortization schedule (sometimes called an amortization table) is a table detailing each periodic
                    payment on an amortizing loan. Each calculation done by the calculator will also come with an annual
                    and monthly amortization schedule above. Each repayment for an amortized loan will contain both an
                    interest payment and payment towards the principal balance, which varies for each pay period. An
                    amortization schedule helps indicate the specific amount that will be paid towards each, along with the
                    interest and principal paid to date, and the remaining principal balance after each pay period.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Extra Payments</h4>
                <p>
                    Basic amortization schedules do not account for extra payments, but this doesn't mean that borrowers
                    can't pay extra towards their loans. When borrowers make extra payments, the additional amount goes
                    directly toward reducing the principal balance, which can significantly reduce the total interest paid
                    over the life of the loan and shorten the loan term. Use the "Optional: make extra payments" feature
                    in this calculator to see how extra payments can impact your loan.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Fixed-Rate Loans</h4>
                <p>
                    Generally, amortization schedules only work for fixed-rate loans and not adjustable-rate mortgages,
                    variable rate loans, or lines of credit. Fixed-rate loans have a constant interest rate throughout the
                    life of the loan, making it easy to calculate the exact payment schedule and total interest paid.
                </p>
            </div>
        </div>
    );
};

export default AmortizationCalculator;
