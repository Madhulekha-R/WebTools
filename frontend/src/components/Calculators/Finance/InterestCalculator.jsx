import React, { useState } from 'react';
import './InterestCalculator.css';

const InterestCalculator = () => {
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('5');
    const [time, setTime] = useState('10');
    const [compound, setCompound] = useState('Annually');
    const [results, setResults] = useState(null);

    const compoundingFrequencies = {
        'Annually': 1,
        'Semiannually': 2,
        'Quarterly': 4,
        'Monthly': 12,
        'Semimonthly': 24,
        'Biweekly': 26,
        'Weekly': 52,
        'Daily': 365
    };

    const calculateInterest = () => {
        const P = parseFloat(principal) || 0;
        const r = (parseFloat(rate) || 0) / 100;
        const t = parseFloat(time) || 0;
        const n = compoundingFrequencies[compound];

        if (P <= 0 || r <= 0 || t <= 0) {
            alert('Please enter valid positive values');
            return;
        }

        // Compound Interest Formula: A = P(1 + r/n)^(nt)
        const amount = P * Math.pow(1 + r / n, n * t);
        const interest = amount - P;

        setResults({
            futureValue: amount,
            totalInterest: interest,
            principal: P
        });
    };

    const handleClear = () => {
        setPrincipal('10000');
        setRate('5');
        setTime('10');
        setCompound('Annually');
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
                <h2 className="age-calc-heading">Interest Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate compound interest on investments and savings
                </div>
            </div>

            <p className="interest-calc-intro">
                The Interest Calculator can be used to calculate the interest on investments with compound interest.
                Use the{' '}
                <a href="/calculators/financial/interest-rate" style={{ color: '#00cfff' }}>Interest Rate Calculator</a>{' '}
                to determine the interest rate on loans, or the{' '}
                <a href="/calculators/financial/compound-interest" style={{ color: '#00cfff' }}>Compound Interest Calculator</a>{' '}
                to understand the difference between different compounding frequencies.
            </p>

            <div className="interest-calc-container">
                <div className="interest-calc-input-section">
                    <div className="interest-calc-card">
                        <div className="input-group">
                            <label>Principal amount</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={principal}
                                    onChange={(e) => setPrincipal(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Interest rate</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                />
                                <span className="input-suffix">%</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Time period (years)</label>
                            <input
                                type="number"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>Compound frequency</label>
                            <select
                                value={compound}
                                onChange={(e) => setCompound(e.target.value)}
                                className="form-input interest-calc-select"
                            >
                                {Object.keys(compoundingFrequencies).map(freq => (
                                    <option key={freq} value={freq}>{freq}</option>
                                ))}
                            </select>
                        </div>

                        <div className="interest-calc-button-group">
                            <button onClick={calculateInterest} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn interest-calc-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="interest-calc-results-section">
                        <div className="interest-calc-card interest-calc-results-card">
                            <h3 className="interest-calc-section-title">Results</h3>
                            <div className="interest-calc-results-box">
                                <div className="interest-calc-result-row highlight">
                                    <span className="interest-calc-result-label">Future value</span>
                                    <span className="interest-calc-result-value">{formatCurrency(results.futureValue)}</span>
                                </div>
                                <div className="interest-calc-result-row">
                                    <span className="interest-calc-result-label">Total interest earned</span>
                                    <span className="interest-calc-result-value">{formatCurrency(results.totalInterest)}</span>
                                </div>
                                <div className="interest-calc-result-row">
                                    <span className="interest-calc-result-label">Principal amount</span>
                                    <span className="interest-calc-result-value">{formatCurrency(results.principal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>What is Compound Interest?</h3>
                <p>
                    Compound interest is the interest calculated on the initial principal and also on the accumulated
                    interest of previous periods. This means you earn interest on your interest, leading to exponential
                    growth over time.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Compound Interest Formula</h4>
                <p>
                    The compound interest formula is:
                </p>
                <p style={{ textAlign: 'center', color: '#00cfff', fontSize: '1.1rem', margin: '1rem 0' }}>
                    A = P(1 + r/n)^(nt)
                </p>
                <p>Where:</p>
                <ul style={{ color: '#b0b3b8', lineHeight: '1.8' }}>
                    <li><strong>A</strong> = Final amount (future value)</li>
                    <li><strong>P</strong> = Principal amount (initial investment)</li>
                    <li><strong>r</strong> = Annual interest rate (as a decimal)</li>
                    <li><strong>n</strong> = Number of times interest is compounded per year</li>
                    <li><strong>t</strong> = Time period in years</li>
                </ul>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Example Calculation</h4>
                <p>
                    If you invest $10,000 at an annual interest rate of 5% compounded annually for 10 years:
                </p>
                <p style={{ textAlign: 'center', color: '#00cfff', fontSize: '1.1rem', margin: '1rem 0' }}>
                    A = $10,000(1 + 0.05/1)^(1×10) = $16,288.95
                </p>
                <p>
                    Your investment would grow to $16,288.95, earning $6,288.95 in interest over 10 years.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Compounding Frequency Impact</h4>
                <p>
                    The more frequently interest is compounded, the more you earn. For example, with the same $10,000
                    investment at 5% for 10 years:
                </p>
                <ul style={{ color: '#b0b3b8', lineHeight: '1.8' }}>
                    <li><strong>Annually:</strong> $16,288.95</li>
                    <li><strong>Quarterly:</strong> $16,436.19</li>
                    <li><strong>Monthly:</strong> $16,470.09</li>
                    <li><strong>Daily:</strong> $16,486.65</li>
                </ul>
                <p>
                    As you can see, more frequent compounding results in higher returns, though the difference becomes
                    smaller as frequency increases.
                </p>
            </div>
        </div>
    );
};

export default InterestCalculator;
