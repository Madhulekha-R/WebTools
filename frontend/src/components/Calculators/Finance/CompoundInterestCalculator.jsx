import React, { useState } from 'react';
import './CompoundInterestCalculator.css';

const CompoundInterestCalculator = () => {
    const [inputRate, setInputRate] = useState('6');
    const [inputCompound, setInputCompound] = useState('Monthly (APR)');
    const [outputCompound, setOutputCompound] = useState('Annually (APY)');
    const [outputRate, setOutputRate] = useState(null);

    const compoundingPeriods = {
        'Annually (APY)': 1,
        'Semiannually': 2,
        'Quarterly': 4,
        'Monthly (APR)': 12,
        'Semimonthly': 24,
        'Biweekly': 26,
        'Weekly': 52,
        'Daily': 365,
        'Continuously': Infinity
    };

    const calculateEquivalentRate = () => {
        const rate = parseFloat(inputRate) / 100;
        const inputPeriods = compoundingPeriods[inputCompound];
        const outputPeriods = compoundingPeriods[outputCompound];

        let equivalentRate;

        if (inputCompound === 'Continuously') {
            // From continuous to periodic
            equivalentRate = outputPeriods * (Math.exp(rate / outputPeriods) - 1);
        } else if (outputCompound === 'Continuously') {
            // From periodic to continuous
            equivalentRate = outputPeriods * Math.log(1 + rate / inputPeriods);
        } else {
            // From one periodic rate to another
            // Convert to effective annual rate first
            const effectiveAnnualRate = Math.pow(1 + rate / inputPeriods, inputPeriods) - 1;
            // Then convert to target compounding period
            equivalentRate = outputPeriods * (Math.pow(1 + effectiveAnnualRate, 1 / outputPeriods) - 1);
        }

        setOutputRate((equivalentRate * 100).toFixed(5));
    };

    const handleClear = () => {
        setInputRate('6');
        setInputCompound('Monthly (APR)');
        setOutputCompound('Annually (APY)');
        setOutputRate(null);
    };

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Compound Interest Calculator</h2>
                <div className="age-calc-subheading">
                    Compare or convert interest rates of different compounding periods
                </div>
            </div>

            <p className="compound-intro">
                The <em>Compound Interest Calculator</em> below can be used to compare or convert the interest rates of
                different compounding periods. Please use our{' '}
                <a href="/calculators/financial/interest" style={{ color: '#00cfff' }}>Interest Calculator</a>{' '}
                to do actual calculations on compound interest.
            </p>

            <div className="compound-container">
                <div className="compound-card">
                    <div className="compound-converter">
                        <div className="compound-input-section">
                            <label className="compound-label">Input Interest</label>
                            <div className="compound-input-group">
                                <div className="input-with-suffix compound-rate-input">
                                    <input
                                        type="number"
                                        value={inputRate}
                                        onChange={(e) => setInputRate(e.target.value)}
                                        className="form-input"
                                        step="0.01"
                                    />
                                    <span className="input-suffix">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="compound-input-section">
                            <label className="compound-label">Compound</label>
                            <select
                                value={inputCompound}
                                onChange={(e) => setInputCompound(e.target.value)}
                                className="form-input compound-select"
                            >
                                {Object.keys(compoundingPeriods).map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>

                        <div className="compound-equals">=</div>

                        <div className="compound-output-section">
                            <label className="compound-label">Output Interest</label>
                            <div className="compound-output-value">
                                {outputRate !== null ? `${outputRate}%` : '—'}
                            </div>
                        </div>

                        <div className="compound-input-section">
                            <label className="compound-label">Compound</label>
                            <select
                                value={outputCompound}
                                onChange={(e) => setOutputCompound(e.target.value)}
                                className="form-input compound-select"
                            >
                                {Object.keys(compoundingPeriods).map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="compound-button-group">
                        <button onClick={calculateEquivalentRate} className="btn btn-primary">
                            Calculate
                        </button>
                        <button onClick={handleClear} className="btn compound-clear-btn">
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>What is compound interest?</h3>
                <p>
                    Interest is the cost of using borrowed money, or more specifically, the amount a lender receives for
                    advancing money to a borrower. When paying interest, the borrower will mostly pay a percentage of
                    the principal (the borrowed amount). The concept of interest can be categorized into simple interest or
                    compound interest.
                </p>

                <p>
                    Simple interest refers to interest earned only on the principal, usually denoted as a specified
                    percentage of the principal. To determine an interest payment, simply multiply principal by the interest
                    rate and the number of periods for which the loan remains active. For example, if one person borrowed
                    $100 from a bank at a simple interest rate of 10% per year for two years, at the end of the two years,
                    the interest would come out to:
                </p>

                <p style={{ textAlign: 'center', color: '#00cfff', fontSize: '1.1rem', margin: '1rem 0' }}>
                    $100 × 10% × 2 years = $20
                </p>

                <p>
                    Simple interest is rarely used in the real world. Compound interest is widely used instead. Compound
                    interest is interest earned on both the principal and on the accumulated interest. For example, if one
                    person borrowed $100 from a bank at a compound interest rate of 10% per year for two years, at the
                    end of the first year, the interest would amount to:
                </p>

                <p style={{ textAlign: 'center', color: '#00cfff', fontSize: '1.1rem', margin: '1rem 0' }}>
                    $100 × 10% × 1 year = $10
                </p>

                <p>
                    At the end of the first year, the loan's balance is principal plus interest, or $100 + $10, which equals
                    $110. The compound interest of the second year is calculated based on the balance of $110 instead of
                    the principal of $100. Thus, the interest of the second year would come out to:
                </p>

                <p style={{ textAlign: 'center', color: '#00cfff', fontSize: '1.1rem', margin: '1rem 0' }}>
                    $110 × 10% × 1 year = $11
                </p>

                <p>
                    The total compound interest after 2 years is $10 + $11 = $21 versus $20 for the simple interest.
                    Because lenders earn interest on interest, earnings compound over time like an exponentially growing
                    snowball. Therefore, compound interest can financially reward lenders generously over time. The
                    longer the interest compounds for any investment, the greater the growth.
                </p>

                <p>
                    As a simple example, a young man at age 20 invested $1,000 into the stock market at a 10% annual
                    return rate, the S&P 500's average rate of return since the 1920s. At the age of 65, when he retires,
                    the fund will grow to $72,890, or approximately 73 times the initial investment!
                </p>

                <p>
                    While compound interest grows wealth effectively, it can also work against debtholders. This is why
                    one can also describe compound interest as a double-edged sword. Putting off or prolonging
                    outstanding debt can dramatically increase the total interest owed.
                </p>
            </div>
        </div>
    );
};

export default CompoundInterestCalculator;
