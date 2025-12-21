import React, { useState } from 'react';
import './InvestmentCalculator.css';

const InvestmentCalculator = () => {
    const [activeTab, setActiveTab] = useState('endAmount');
    const [startingAmount, setStartingAmount] = useState('20000');
    const [investmentLength, setInvestmentLength] = useState('10');
    const [returnRate, setReturnRate] = useState('6');
    const [compoundFrequency, setCompoundFrequency] = useState('annually');
    const [additionalContribution, setAdditionalContribution] = useState('1000');
    const [contributionTiming, setContributionTiming] = useState('end');
    const [contributionFrequency, setContributionFrequency] = useState('year');
    const [results, setResults] = useState(null);
    const [activeScheduleTab, setActiveScheduleTab] = useState('annual');

    const compoundFrequencies = {
        'annually': 1,
        'semiannually': 2,
        'quarterly': 4,
        'monthly': 12,
        'semimonthly': 24,
        'biweekly': 26,
        'weekly': 52,
        'daily': 365
    };

    const calculateInvestment = () => {
        const P = parseFloat(startingAmount) || 0;
        const r = parseFloat(returnRate) / 100 || 0;
        const t = parseFloat(investmentLength) || 0;
        const n = compoundFrequencies[compoundFrequency] || 1;
        const PMT = parseFloat(additionalContribution) || 0;

        if (t <= 0) {
            alert('Please enter valid values');
            return;
        }

        let endBalance, totalContributions, totalInterest;
        const schedule = [];

        // Calculate based on active tab
        switch (activeTab) {
            case 'endAmount':
                endBalance = calculateEndAmount(P, r, t, n, PMT);
                break;
            case 'additionalContribution':
                // For this mode, we'd solve for PMT - simplified version
                endBalance = calculateEndAmount(P, r, t, n, PMT);
                break;
            case 'returnRate':
                // For this mode, we'd solve for r - simplified version
                endBalance = calculateEndAmount(P, r, t, n, PMT);
                break;
            case 'startingAmount':
                // For this mode, we'd solve for P - simplified version
                endBalance = calculateEndAmount(P, r, t, n, PMT);
                break;
            case 'investmentLength':
                // For this mode, we'd solve for t - simplified version
                endBalance = calculateEndAmount(P, r, t, n, PMT);
                break;
            default:
                endBalance = calculateEndAmount(P, r, t, n, PMT);
        }

        // Generate accumulation schedule
        const contributionsPerYear = contributionFrequency === 'month' ? 12 : 1;
        const yearlyContribution = PMT * contributionsPerYear;
        totalContributions = yearlyContribution * t;

        let balance = P;
        const annualSchedule = [];
        const monthlySchedule = [];

        for (let year = 1; year <= t; year++) {
            const yearStartBalance = balance;
            let yearDeposit = yearlyContribution;

            // Calculate interest for the year
            const yearEndBalance = calculateYearEndBalance(yearStartBalance, r, n, yearlyContribution, contributionTiming, contributionsPerYear);
            const yearInterest = yearEndBalance - yearStartBalance - yearDeposit;

            balance = yearEndBalance;

            annualSchedule.push({
                year,
                deposit: yearDeposit,
                interest: yearInterest,
                endingBalance: yearEndBalance
            });

            // Generate monthly schedule for this year
            for (let month = 1; month <= 12; month++) {
                const monthNum = (year - 1) * 12 + month;
                const monthlyDeposit = contributionFrequency === 'month' ? PMT : (month === 12 ? yearlyContribution : 0);

                monthlySchedule.push({
                    month: monthNum,
                    deposit: monthlyDeposit,
                    interest: yearInterest / 12,
                    endingBalance: yearStartBalance + (yearDeposit * month / 12) + (yearInterest * month / 12)
                });
            }
        }

        totalInterest = endBalance - P - totalContributions;

        // Calculate percentages for pie chart
        const startingPercent = (P / endBalance) * 100;
        const contributionsPercent = (totalContributions / endBalance) * 100;
        const interestPercent = (totalInterest / endBalance) * 100;

        setResults({
            endBalance,
            startingAmount: P,
            totalContributions,
            totalInterest,
            startingPercent,
            contributionsPercent,
            interestPercent,
            annualSchedule,
            monthlySchedule,
            years: t
        });
    };

    const calculateEndAmount = (P, r, t, n, PMT) => {
        // Future value with regular contributions
        const contributionsPerYear = contributionFrequency === 'month' ? 12 : 1;
        const m = contributionsPerYear;

        // Future value of principal
        const FV_principal = P * Math.pow(1 + r / n, n * t);

        // Future value of contributions
        let FV_contributions = 0;
        if (PMT > 0 && r > 0) {
            if (contributionTiming === 'beginning') {
                FV_contributions = PMT * (Math.pow(1 + r / m, m * t) - 1) / (r / m) * (1 + r / m);
            } else {
                FV_contributions = PMT * (Math.pow(1 + r / m, m * t) - 1) / (r / m);
            }
        } else if (PMT > 0) {
            FV_contributions = PMT * m * t;
        }

        return FV_principal + FV_contributions;
    };

    const calculateYearEndBalance = (startBalance, r, n, yearlyContribution, timing, contributionsPerYear) => {
        const m = contributionsPerYear;
        const PMT = yearlyContribution / m;

        // Future value of starting balance after 1 year
        const FV_start = startBalance * Math.pow(1 + r / n, n);

        // Future value of contributions made during the year
        let FV_contributions = 0;
        if (PMT > 0 && r > 0) {
            if (timing === 'beginning') {
                FV_contributions = PMT * (Math.pow(1 + r / m, m) - 1) / (r / m) * (1 + r / m);
            } else {
                FV_contributions = PMT * (Math.pow(1 + r / m, m) - 1) / (r / m);
            }
        } else if (PMT > 0) {
            FV_contributions = PMT * m;
        }

        return FV_start + FV_contributions;
    };

    const handleClear = () => {
        setStartingAmount('20000');
        setInvestmentLength('10');
        setReturnRate('6');
        setCompoundFrequency('annually');
        setAdditionalContribution('1000');
        setContributionTiming('end');
        setContributionFrequency('year');
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
                <h2 className="age-calc-heading">Investment Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate investment growth with compound interest and regular contributions
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="investment-tabs">
                <button
                    className={`investment-tab ${activeTab === 'endAmount' ? 'active' : ''}`}
                    onClick={() => setActiveTab('endAmount')}
                >
                    End Amount
                </button>
                <button
                    className={`investment-tab ${activeTab === 'additionalContribution' ? 'active' : ''}`}
                    onClick={() => setActiveTab('additionalContribution')}
                >
                    Additional Contribution
                </button>
                <button
                    className={`investment-tab ${activeTab === 'returnRate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('returnRate')}
                >
                    Return Rate
                </button>
                <button
                    className={`investment-tab ${activeTab === 'startingAmount' ? 'active' : ''}`}
                    onClick={() => setActiveTab('startingAmount')}
                >
                    Starting Amount
                </button>
                <button
                    className={`investment-tab ${activeTab === 'investmentLength' ? 'active' : ''}`}
                    onClick={() => setActiveTab('investmentLength')}
                >
                    Investment Length
                </button>
            </div>

            <div className="investment-container">
                {/* Input Section */}
                <div className="investment-input-section">
                    <div className="investment-card">
                        <h2 className="investment-section-title">Investment Details</h2>

                        <div className="input-group">
                            <label>Starting Amount</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={startingAmount}
                                    onChange={(e) => setStartingAmount(e.target.value)}
                                    className="form-input"
                                    disabled={activeTab === 'startingAmount'}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>After</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={investmentLength}
                                    onChange={(e) => setInvestmentLength(e.target.value)}
                                    className="form-input"
                                    disabled={activeTab === 'investmentLength'}
                                />
                                <span className="input-suffix">years</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Return Rate</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={returnRate}
                                    onChange={(e) => setReturnRate(e.target.value)}
                                    className="form-input"
                                    step="0.01"
                                    disabled={activeTab === 'returnRate'}
                                />
                                <span className="input-suffix">%</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Compound</label>
                            <select
                                value={compoundFrequency}
                                onChange={(e) => setCompoundFrequency(e.target.value)}
                                className="form-input investment-select"
                            >
                                <option value="annually">Annually</option>
                                <option value="semiannually">Semiannually</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="monthly">Monthly</option>
                                <option value="semimonthly">Semimonthly</option>
                                <option value="biweekly">Biweekly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Additional Contribution</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={additionalContribution}
                                    onChange={(e) => setAdditionalContribution(e.target.value)}
                                    className="form-input"
                                    disabled={activeTab === 'additionalContribution'}
                                />
                            </div>
                        </div>

                        <div className="investment-contribution-options">
                            <div className="investment-radio-group">
                                <label>Contribute at the</label>
                                <label className="investment-radio-label">
                                    <input
                                        type="radio"
                                        value="beginning"
                                        checked={contributionTiming === 'beginning'}
                                        onChange={(e) => setContributionTiming(e.target.value)}
                                    />
                                    <span>beginning</span>
                                </label>
                                <label className="investment-radio-label">
                                    <input
                                        type="radio"
                                        value="end"
                                        checked={contributionTiming === 'end'}
                                        onChange={(e) => setContributionTiming(e.target.value)}
                                    />
                                    <span>end</span>
                                </label>
                            </div>

                            <div className="investment-radio-group">
                                <label>of each</label>
                                <label className="investment-radio-label">
                                    <input
                                        type="radio"
                                        value="month"
                                        checked={contributionFrequency === 'month'}
                                        onChange={(e) => setContributionFrequency(e.target.value)}
                                    />
                                    <span>month</span>
                                </label>
                                <label className="investment-radio-label">
                                    <input
                                        type="radio"
                                        value="year"
                                        checked={contributionFrequency === 'year'}
                                        onChange={(e) => setContributionFrequency(e.target.value)}
                                    />
                                    <span>year</span>
                                </label>
                            </div>
                        </div>

                        <div className="investment-button-group">
                            <button onClick={calculateInvestment} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn investment-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="investment-results-section">
                        <div className="investment-card investment-results-card">
                            <h2 className="investment-section-title">Results</h2>

                            {/* Results Summary */}
                            <div className="investment-results-box">
                                <div className="investment-result-row">
                                    <span className="investment-result-label">End Balance</span>
                                    <span className="investment-result-value">{formatCurrency(results.endBalance)}</span>
                                </div>
                                <div className="investment-result-row">
                                    <span className="investment-result-label">Starting Amount</span>
                                    <span className="investment-result-value">{formatCurrency(results.startingAmount)}</span>
                                </div>
                                <div className="investment-result-row">
                                    <span className="investment-result-label">Total Contributions</span>
                                    <span className="investment-result-value">{formatCurrency(results.totalContributions)}</span>
                                </div>
                                <div className="investment-result-row">
                                    <span className="investment-result-label">Total Interest</span>
                                    <span className="investment-result-value highlight">{formatCurrency(results.totalInterest)}</span>
                                </div>
                            </div>

                            {/* Pie Chart */}
                            <div className="investment-chart-container">
                                <svg className="investment-pie-chart" viewBox="0 0 200 200">
                                    {/* Starting Amount */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#4285f4"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.startingPercent * 5.027} 502.7`}
                                        transform="rotate(-90 100 100)"
                                    />
                                    {/* Total Contributions */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#34a853"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.contributionsPercent * 5.027} 502.7`}
                                        strokeDashoffset={`-${results.startingPercent * 5.027}`}
                                        transform="rotate(-90 100 100)"
                                    />
                                    {/* Interest */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="#ea4335"
                                        strokeWidth="40"
                                        strokeDasharray={`${results.interestPercent * 5.027} 502.7`}
                                        strokeDashoffset={`-${(results.startingPercent + results.contributionsPercent) * 5.027}`}
                                        transform="rotate(-90 100 100)"
                                    />
                                    <circle cx="100" cy="100" r="60" fill="#23272f" />
                                </svg>

                                <div className="investment-legend">
                                    <div className="investment-legend-item">
                                        <div className="investment-legend-color" style={{ background: '#4285f4' }}></div>
                                        <span>Starting Amount ({results.startingPercent.toFixed(0)}%)</span>
                                    </div>
                                    <div className="investment-legend-item">
                                        <div className="investment-legend-color" style={{ background: '#34a853' }}></div>
                                        <span>Total Contributions ({results.contributionsPercent.toFixed(0)}%)</span>
                                    </div>
                                    <div className="investment-legend-item">
                                        <div className="investment-legend-color" style={{ background: '#ea4335' }}></div>
                                        <span>Interest ({results.interestPercent.toFixed(0)}%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stacked Bar Chart */}
                            <div className="investment-bar-chart-container">
                                <h3 className="investment-subsection-title">Accumulation Over Time</h3>
                                <div className="investment-bar-chart">
                                    {results.annualSchedule.map((year, index) => {
                                        const maxValue = results.endBalance;
                                        const startingHeight = (results.startingAmount / maxValue) * 100;
                                        const contributionsHeight = ((year.deposit * (index + 1)) / maxValue) * 100;
                                        const interestHeight = ((year.endingBalance - results.startingAmount - (year.deposit * (index + 1))) / maxValue) * 100;

                                        return (
                                            <div key={index} className="investment-bar-wrapper">
                                                <div className="investment-bar">
                                                    <div className="investment-bar-segment starting" style={{ height: `${startingHeight}%` }}></div>
                                                    <div className="investment-bar-segment contributions" style={{ height: `${contributionsHeight}%` }}></div>
                                                    <div className="investment-bar-segment interest" style={{ height: `${interestHeight}%` }}></div>
                                                </div>
                                                <div className="investment-bar-label">{year.year}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Accumulation Schedule */}
                            <div className="investment-schedule">
                                <h3 className="investment-subsection-title">Accumulation Schedule</h3>

                                <div className="investment-schedule-tabs">
                                    <button
                                        className={`investment-schedule-tab ${activeScheduleTab === 'annual' ? 'active' : ''}`}
                                        onClick={() => setActiveScheduleTab('annual')}
                                    >
                                        Annual Schedule
                                    </button>
                                    <button
                                        className={`investment-schedule-tab ${activeScheduleTab === 'monthly' ? 'active' : ''}`}
                                        onClick={() => setActiveScheduleTab('monthly')}
                                    >
                                        Monthly Schedule
                                    </button>
                                </div>

                                {activeScheduleTab === 'annual' && (
                                    <div className="investment-table">
                                        <div className="investment-table-header">
                                            <div>Year</div>
                                            <div>Deposit</div>
                                            <div>Interest</div>
                                            <div>Ending Balance</div>
                                        </div>
                                        <div className="investment-table-body">
                                            {results.annualSchedule.map((row, index) => (
                                                <div key={index} className="investment-table-row">
                                                    <div>{row.year}</div>
                                                    <div>{formatCurrency(row.deposit)}</div>
                                                    <div>{formatCurrency(row.interest)}</div>
                                                    <div>{formatCurrency(row.endingBalance)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeScheduleTab === 'monthly' && (
                                    <div className="investment-table investment-monthly-table">
                                        <div className="investment-table-header">
                                            <div>Month</div>
                                            <div>Deposit</div>
                                            <div>Interest</div>
                                            <div>Balance</div>
                                        </div>
                                        <div className="investment-table-body">
                                            {results.monthlySchedule.map((row, index) => (
                                                <div key={index} className="investment-table-row">
                                                    <div>{row.month}</div>
                                                    <div>{formatCurrency(row.deposit)}</div>
                                                    <div>{formatCurrency(row.interest)}</div>
                                                    <div>{formatCurrency(row.endingBalance)}</div>
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

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <p>
                    Investing is the act of using money to make more money. The Investment Calculator can help
                    determine one of many different variables concerning investments with a fixed rate of return.
                </p>

                <h3 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '1rem' }}>Variables involved</h3>
                <p>For any typical financial investment, there are four crucial elements that make up the investment.</p>

                <ul style={{ color: '#d6fce9', lineHeight: '1.8' }}>
                    <li>
                        <strong style={{ color: '#00ff94' }}>Return rate</strong> – For many investors, this is what matters most. On the surface, it appears as a
                        plain percentage, but it is the cold, hard number used to compare the attractiveness of various
                        sorts of financial investments.
                    </li>
                    <li>
                        <strong style={{ color: '#00ff94' }}>Starting amount</strong> – Sometimes called the principal, this is the amount apparent at the inception
                        of the investment. In practical investment terms, it can be a large amount saved up for a home, an
                        inheritance, or the purchase price of a quantity of gold.
                    </li>
                    <li>
                        <strong style={{ color: '#00ff94' }}>End amount</strong> – The desired amount at the end of the life of the investment.
                    </li>
                    <li>
                        <strong style={{ color: '#00ff94' }}>Investment length</strong> – The length of the life of the investment. Generally, the longer the
                        investment, the riskier it becomes due to the unforeseeable future. Normally, the more periods
                        involved in an investment, the more compounding of return is accrued and the greater the
                        rewards.
                    </li>
                    <li>
                        <strong style={{ color: '#00ff94' }}>Additional contribution</strong> – Commonly referred to as annuity payment in financial jargon,
                        investments can be made without them. However, any additional contributions during the life of
                        an investment will result in a more accrued return and a higher end value.
                    </li>
                </ul>

                <h3 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '1rem' }}>Different Types of Investments</h3>
                <p>
                    Our Investment Calculator can be used for almost any investment opportunity that can be simplified to
                    the variables above. The following is a list of some common investments. The investment options
                    available are far beyond what was listed.
                </p>
            </div>
        </div>
    );
};

export default InvestmentCalculator;
