import React, { useState } from 'react';
import './FinanceCalculator.css';

const FinanceCalculator = () => {
    const [activeTab, setActiveTab] = useState('FV');
    const [numPeriods, setNumPeriods] = useState('10');
    const [interestRate, setInterestRate] = useState('6');
    const [presentValue, setPresentValue] = useState('20000');
    const [payment, setPayment] = useState('-2000');
    const [showSettings, setShowSettings] = useState(false);
    const [paymentTiming, setPaymentTiming] = useState('end'); // end or beginning
    const [compoundingPeriod, setCompoundingPeriod] = useState('year');
    const [results, setResults] = useState(null);

    const calculateFinance = () => {
        const N = parseFloat(numPeriods) || 0;
        const IY = parseFloat(interestRate) / 100 || 0;
        const PV = parseFloat(presentValue) || 0;
        const PMT = parseFloat(payment) || 0;

        if (N <= 0) {
            alert('Please enter valid values');
            return;
        }

        const r = IY; // Interest rate per period
        let FV, calculatedPMT, calculatedIY, calculatedPV, calculatedN;

        // Calculate based on active tab
        switch (activeTab) {
            case 'FV':
                // Calculate Future Value
                FV = calculateFV(PV, PMT, r, N, paymentTiming);
                break;
            case 'PMT':
                // Calculate Payment (solving for PMT)
                calculatedPMT = calculatePMT(PV, 0, r, N, paymentTiming); // Assuming FV = 0
                break;
            case 'I/Y':
                // Calculate Interest Rate (simplified - would need iterative solution)
                calculatedIY = r * 100; // Placeholder
                break;
            case 'N':
                // Calculate Number of Periods (simplified)
                calculatedN = N; // Placeholder
                break;
            case 'PV':
                // Calculate Present Value
                calculatedPV = calculatePV(0, PMT, r, N, paymentTiming); // Assuming FV = 0
                break;
            default:
                FV = calculateFV(PV, PMT, r, N, paymentTiming);
        }

        // Generate schedule
        const schedule = generateSchedule(PV, PMT, r, N, paymentTiming);

        // Calculate totals
        const sumOfPayments = Math.abs(PMT * N);
        const finalFV = FV || calculateFV(PV, PMT, r, N, paymentTiming);
        const totalInterest = finalFV - PV - (PMT * N);

        setResults({
            FV: finalFV,
            sumOfPayments,
            totalInterest,
            schedule,
            N,
            IY: IY * 100,
            PV,
            PMT
        });
    };

    const calculateFV = (PV, PMT, r, N, timing) => {
        // Future Value formula
        const FV_PV = PV * Math.pow(1 + r, N);
        let FV_PMT = 0;

        if (PMT !== 0 && r !== 0) {
            if (timing === 'beginning') {
                FV_PMT = PMT * ((Math.pow(1 + r, N) - 1) / r) * (1 + r);
            } else {
                FV_PMT = PMT * ((Math.pow(1 + r, N) - 1) / r);
            }
        } else if (PMT !== 0) {
            FV_PMT = PMT * N;
        }

        return FV_PV + FV_PMT;
    };

    const calculatePV = (FV, PMT, r, N, timing) => {
        // Present Value formula
        const PV_FV = FV / Math.pow(1 + r, N);
        let PV_PMT = 0;

        if (PMT !== 0 && r !== 0) {
            if (timing === 'beginning') {
                PV_PMT = PMT * ((1 - Math.pow(1 + r, -N)) / r) * (1 + r);
            } else {
                PV_PMT = PMT * ((1 - Math.pow(1 + r, -N)) / r);
            }
        } else if (PMT !== 0) {
            PV_PMT = PMT * N;
        }

        return PV_FV + PV_PMT;
    };

    const calculatePMT = (PV, FV, r, N, timing) => {
        if (r === 0) {
            return -(PV + FV) / N;
        }

        const numerator = PV * Math.pow(1 + r, N) + FV;
        const denominator = (Math.pow(1 + r, N) - 1) / r;

        if (timing === 'beginning') {
            return -numerator / (denominator * (1 + r));
        } else {
            return -numerator / denominator;
        }
    };

    const generateSchedule = (PV, PMT, r, N, timing) => {
        const schedule = [];
        let currentPV = PV;

        for (let period = 1; period <= N; period++) {
            const interest = currentPV * r;
            const currentPMT = PMT;
            const currentFV = currentPV + interest + currentPMT;

            schedule.push({
                period,
                PV: currentPV,
                PMT: currentPMT,
                interest,
                FV: currentFV
            });

            currentPV = currentFV;
        }

        return schedule;
    };

    const handleClear = () => {
        setNumPeriods('10');
        setInterestRate('6');
        setPresentValue('20000');
        setPayment('-2000');
        setPaymentTiming('end');
        setCompoundingPeriod('year');
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
                <h2 className="age-calc-heading">Finance Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate future value, periodic payment, interest rate, number of periods, and present value
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="finance-tabs">
                <button
                    className={`finance-tab ${activeTab === 'FV' ? 'active' : ''}`}
                    onClick={() => setActiveTab('FV')}
                >
                    FV
                </button>
                <button
                    className={`finance-tab ${activeTab === 'PMT' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PMT')}
                >
                    PMT
                </button>
                <button
                    className={`finance-tab ${activeTab === 'I/Y' ? 'active' : ''}`}
                    onClick={() => setActiveTab('I/Y')}
                >
                    I/Y
                </button>
                <button
                    className={`finance-tab ${activeTab === 'N' ? 'active' : ''}`}
                    onClick={() => setActiveTab('N')}
                >
                    N
                </button>
                <button
                    className={`finance-tab ${activeTab === 'PV' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PV')}
                >
                    PV
                </button>
            </div>

            <div className="finance-container">
                {/* Input Section */}
                <div className="finance-input-section">
                    <div className="finance-card">
                        <div className="input-group">
                            <label>N (# of periods)</label>
                            <input
                                type="number"
                                value={numPeriods}
                                onChange={(e) => setNumPeriods(e.target.value)}
                                className="form-input"
                                disabled={activeTab === 'N'}
                            />
                        </div>

                        <div className="input-group">
                            <label>I/Y (Interest per year)</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    className="form-input"
                                    step="0.01"
                                    disabled={activeTab === 'I/Y'}
                                />
                                <span className="input-suffix">%</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>PV (Present Value)</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={presentValue}
                                    onChange={(e) => setPresentValue(e.target.value)}
                                    className="form-input"
                                    disabled={activeTab === 'PV'}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>PMT (Periodic Payment)</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={payment}
                                    onChange={(e) => setPayment(e.target.value)}
                                    className="form-input"
                                    disabled={activeTab === 'PMT'}
                                />
                            </div>
                        </div>

                        <div className="finance-settings-toggle">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="finance-settings-btn"
                            >
                                + Settings
                            </button>
                        </div>

                        {showSettings && (
                            <div className="finance-settings">
                                <div className="input-group">
                                    <label>Payment Timing</label>
                                    <select
                                        value={paymentTiming}
                                        onChange={(e) => setPaymentTiming(e.target.value)}
                                        className="form-input finance-select"
                                    >
                                        <option value="end">End of Period</option>
                                        <option value="beginning">Beginning of Period</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Compounding Period</label>
                                    <select
                                        value={compoundingPeriod}
                                        onChange={(e) => setCompoundingPeriod(e.target.value)}
                                        className="form-input finance-select"
                                    >
                                        <option value="year">Yearly</option>
                                        <option value="quarter">Quarterly</option>
                                        <option value="month">Monthly</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="finance-button-group">
                            <button onClick={calculateFinance} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn finance-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="finance-results-section">
                        <div className="finance-card finance-results-card">
                            <h3 className="finance-section-title">Results</h3>

                            <div className="finance-results-box">
                                <div className="finance-result-row highlight">
                                    <span className="finance-result-label">FV</span>
                                    <span className="finance-result-value">{formatCurrency(results.FV)}</span>
                                </div>
                                <div className="finance-result-row">
                                    <span className="finance-result-label">Sum of all periodic payments</span>
                                    <span className="finance-result-value">{formatCurrency(results.sumOfPayments)}</span>
                                </div>
                                <div className="finance-result-row">
                                    <span className="finance-result-label">Total Interest</span>
                                    <span className="finance-result-value">{formatCurrency(results.totalInterest)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Schedule Table */}
            {results && (
                <div className="finance-schedule-container">
                    <div className="finance-card">
                        <h3 className="finance-section-title">Schedule</h3>
                        <div className="finance-table">
                            <div className="finance-table-header">
                                <div>Period</div>
                                <div>PV</div>
                                <div>PMT</div>
                                <div>Interest</div>
                                <div>FV</div>
                            </div>
                            <div className="finance-table-body">
                                {results.schedule.map((row, index) => (
                                    <div key={index} className="finance-table-row">
                                        <div>{row.period}</div>
                                        <div>{formatCurrency(row.PV)}</div>
                                        <div>{formatCurrency(row.PMT)}</div>
                                        <div>{formatCurrency(row.interest)}</div>
                                        <div>{formatCurrency(row.FV)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceCalculator;
