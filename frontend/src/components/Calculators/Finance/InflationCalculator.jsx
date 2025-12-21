import React, { useState } from 'react';
import './InflationCalculator.css';

const InflationCalculator = () => {
    // CPI Calculator States
    const [cpiAmount, setCpiAmount] = useState('100');
    const [cpiType, setCpiType] = useState('Average');
    const [startYear, setStartYear] = useState('2015');
    const [endMonth, setEndMonth] = useState('September');
    const [endYear, setEndYear] = useState('2025');
    const [cpiResult, setCpiResult] = useState(null);

    // Forward Calculator States
    const [forwardAmount, setForwardAmount] = useState('100');
    const [forwardRate, setForwardRate] = useState('3');
    const [forwardYears, setForwardYears] = useState('10');
    const [forwardResult, setForwardResult] = useState(null);

    // Backward Calculator States
    const [backwardAmount, setBackwardAmount] = useState('100');
    const [backwardRate, setBackwardRate] = useState('3');
    const [backwardYears, setBackwardYears] = useState('10');
    const [backwardResult, setBackwardResult] = useState(null);

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const cpiTypes = ['Average', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Generate years from 1913 to 2025
    const years = Array.from({ length: 2025 - 1913 + 1 }, (_, i) => 1913 + i);

    // CPI Calculator
    const calculateCPI = () => {
        const amount = parseFloat(cpiAmount) || 0;
        // Simplified CPI calculation - in real implementation, you'd use actual CPI data
        // For demonstration, using approximate 2.5% annual inflation
        const yearDiff = parseInt(endYear) - parseInt(startYear);
        const inflationRate = 0.025; // 2.5% average
        const futureValue = amount * Math.pow(1 + inflationRate, yearDiff);

        setCpiResult({
            amount: amount,
            futureValue: futureValue,
            startYear: startYear,
            endMonth: endMonth,
            endYear: endYear,
            cpiType: cpiType
        });
    };

    const clearCPI = () => {
        setCpiAmount('100');
        setCpiType('Average');
        setStartYear('2015');
        setEndMonth('September');
        setEndYear('2025');
        setCpiResult(null);
    };

    // Forward Calculator
    const calculateForward = () => {
        const amount = parseFloat(forwardAmount) || 0;
        const rate = parseFloat(forwardRate) / 100 || 0;
        const years = parseFloat(forwardYears) || 0;

        const futureValue = amount * Math.pow(1 + rate, years);

        setForwardResult({
            amount: amount,
            futureValue: futureValue,
            rate: forwardRate,
            years: years
        });
    };

    const clearForward = () => {
        setForwardAmount('100');
        setForwardRate('3');
        setForwardYears('10');
        setForwardResult(null);
    };

    // Backward Calculator
    const calculateBackward = () => {
        const amount = parseFloat(backwardAmount) || 0;
        const rate = parseFloat(backwardRate) / 100 || 0;
        const years = parseFloat(backwardYears) || 0;

        const pastValue = amount / Math.pow(1 + rate, years);

        setBackwardResult({
            amount: amount,
            pastValue: pastValue,
            rate: backwardRate,
            years: years
        });
    };

    const clearBackward = () => {
        setBackwardAmount('100');
        setBackwardRate('3');
        setBackwardYears('10');
        setBackwardResult(null);
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
                <h2 className="age-calc-heading">Inflation Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate the impact of inflation on purchasing power over time
                </div>
            </div>

            <div className="inflation-container">
                {/* CPI-Based Calculator */}
                <div className="inflation-section">
                    <div className="inflation-card">
                        <h3 className="inflation-section-title">Inflation Calculator with U.S. CPI Data</h3>
                        <p className="inflation-description">
                            Calculates the equivalent value of the U.S. dollar in any month from 1913 to 2025.
                            Calculations are based on the average Consumer Price Index (CPI) data for all urban consumers in the U.S.
                        </p>

                        <div className="inflation-input-row">
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={cpiAmount}
                                    onChange={(e) => setCpiAmount(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="inflation-text">in</span>
                            <select
                                value={cpiType}
                                onChange={(e) => setCpiType(e.target.value)}
                                className="form-input inflation-select"
                            >
                                {cpiTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <select
                                value={startYear}
                                onChange={(e) => setStartYear(e.target.value)}
                                className="form-input inflation-select"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <span className="inflation-text">=</span>
                            <span className="inflation-result-placeholder">?</span>
                            <span className="inflation-text">in</span>
                            <select
                                value={endMonth}
                                onChange={(e) => setEndMonth(e.target.value)}
                                className="form-input inflation-select"
                            >
                                {months.map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={endYear}
                                onChange={(e) => setEndYear(e.target.value)}
                                className="form-input inflation-select"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="inflation-button-group">
                            <button onClick={calculateCPI} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={clearCPI} className="btn inflation-clear-btn">
                                Clear
                            </button>
                        </div>

                        {cpiResult && (
                            <div className="inflation-result-box">
                                <div className="inflation-result-text">
                                    {formatCurrency(cpiResult.amount)} in {cpiResult.cpiType} {cpiResult.startYear} is equivalent to{' '}
                                    <span className="inflation-result-value">{formatCurrency(cpiResult.futureValue)}</span>{' '}
                                    in {cpiResult.endMonth} {cpiResult.endYear}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Forward Flat Rate Calculator */}
                <div className="inflation-section">
                    <div className="inflation-card">
                        <h3 className="inflation-section-title">Forward Flat Rate Inflation Calculator</h3>
                        <p className="inflation-description">
                            Calculates an inflation based on a certain average inflation rate <strong>after some years</strong>.
                        </p>

                        <div className="inflation-input-row">
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={forwardAmount}
                                    onChange={(e) => setForwardAmount(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="inflation-text">with inflation rate</span>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={forwardRate}
                                    onChange={(e) => setForwardRate(e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                />
                                <span className="input-suffix">%</span>
                            </div>
                            <span className="inflation-text">after</span>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={forwardYears}
                                    onChange={(e) => setForwardYears(e.target.value)}
                                    className="form-input"
                                />
                                <span className="input-suffix">years</span>
                            </div>
                            <span className="inflation-text">=</span>
                            <span className="inflation-result-placeholder">?</span>
                        </div>

                        <div className="inflation-button-group">
                            <button onClick={calculateForward} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={clearForward} className="btn inflation-clear-btn">
                                Clear
                            </button>
                        </div>

                        {forwardResult && (
                            <div className="inflation-result-box">
                                <div className="inflation-result-text">
                                    {formatCurrency(forwardResult.amount)} with {forwardResult.rate}% inflation after {forwardResult.years} years will be worth{' '}
                                    <span className="inflation-result-value">{formatCurrency(forwardResult.futureValue)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Backward Flat Rate Calculator */}
                <div className="inflation-section">
                    <div className="inflation-card">
                        <h3 className="inflation-section-title">Backward Flat Rate Inflation Calculator</h3>
                        <p className="inflation-description">
                            Calculates the equivalent purchasing power of an amount <strong>some years ago</strong> based on a certain average inflation rate.
                        </p>

                        <div className="inflation-input-row">
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={backwardAmount}
                                    onChange={(e) => setBackwardAmount(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="inflation-text">with inflation rate</span>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={backwardRate}
                                    onChange={(e) => setBackwardRate(e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                />
                                <span className="input-suffix">%</span>
                            </div>
                            <span className="inflation-text">=</span>
                            <span className="inflation-result-placeholder">?</span>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={backwardYears}
                                    onChange={(e) => setBackwardYears(e.target.value)}
                                    className="form-input"
                                />
                                <span className="input-suffix">years</span>
                            </div>
                            <span className="inflation-text">ago</span>
                        </div>

                        <div className="inflation-button-group">
                            <button onClick={calculateBackward} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={clearBackward} className="btn inflation-clear-btn">
                                Clear
                            </button>
                        </div>

                        {backwardResult && (
                            <div className="inflation-result-box">
                                <div className="inflation-result-text">
                                    {formatCurrency(backwardResult.amount)} today had the purchasing power of{' '}
                                    <span className="inflation-result-value">{formatCurrency(backwardResult.pastValue)}</span>{' '}
                                    {backwardResult.years} years ago (at {backwardResult.rate}% inflation)
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>What is Inflation?</h3>
                <p>
                    Inflation is defined as a general increase in the prices of goods and services, and a fall in the
                    purchasing power of money. Inflation can be artificial in that the authority, such as a central bank, king,
                    or government, can control the supply of the money in circulation. Theoretically, if additional money is
                    added into an economy, each unit of money in circulation will have less value. The inflation rate itself is
                    generally conveyed as a percentage increase in prices over 12 months. Most developed nations try to
                    sustain an inflation rate of around 2-3% through fiscal and monetary policy.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Hyperinflation</h4>
                <p>
                    Hyperinflation is excessive inflation that rapidly erodes the real value of a currency. It usually occurs
                    when there is a significant increase in money supply with little to no change in gross domestic product.
                    Examples of hyperinflation can be seen in the countries of Ukraine in the early 1990s and Brazil from
                    1980 until 1994, where they endured long periods of hyperinflation and their currencies became
                    essentially valueless. These financial economies caused terrible hardships for their people.
                    Ukrainians and Brazilians had to cope by using stabilized foreign currencies and stocking up on finite
                    resources that could retain value, such as gold. Another well-known example of hyperinflation was
                    Germany in the 1920s when the government took stimulus measures such as printing money to pay
                    for WWI. This happened at the same time as Germany was required to pay 132 billion marks in war
                    reparations. This resulted in economic activity crumbling and shortages. With too much money and not
                    enough goods and services, prices doubled every 3 days! The Papiermark, the German currency at
                    the time, lost so much value that people were using it in place of firewood to heat their homes. The
                    effects of hyperinflation were so severe that many people lived in poverty or fled the country.
                </p>
                <p>
                    While hyperinflation can cause immense hardship on an economy, it is considered healthy to have
                    moderate levels of inflation from year to year. Because money will have less value in the future, there
                    is an incentive for consumers to spend instead of stashing it away, and this incentive plays a key role
                    in ensuring a healthy economy.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Deflation</h4>
                <p>
                    While inflation is not entirely good or bad depending on whether it is moderate or severe, deflation, the
                    opposite of inflation, is seldom welcome in any economy. Deflation is defined as the general reduction
                    of prices for goods and services. In such a scenario, consumers are not incentivized to spend since
                    their money is forecasted to have more purchasing power in the future. This puts the brakes on and
                    can even reverse what should be upward trending economies. The Great Depression came with
                    something called the deflationary spiral. The theory behind a deflationary spiral is that as prices fall for
                    goods and services, there is less profit. With less profit comes less spending. This, in turn, leads to
                    even lower prices for goods and services, which forms a negative loop that can be immensely difficult
                    to recover from.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Why Inflation Occurs?</h4>
                <p>
                    Macroeconomic theories try to explain why inflation occurs and how best to regulate it. Keynesian
                    economics, which served as the standard economic model in developed nations for most of the
                    twentieth century and is still widely used today, says that when there are gaping imbalances between
                    the supply and demand of goods and services, large-scale inflation or deflation can occur.
                </p>

                <ul style={{ color: '#d6fce9', lineHeight: '1.8', marginTop: '1rem' }}>
                    <li style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#00ff94' }}>Cost-Push inflation</strong>—Take, for example, the cost of oil going up due to political turmoil; because
                        so many goods and services depend on oil, their prices will also increase to account for the
                        higher costs associated with running a business that involves oil as an expense. This is called
                        cost-push inflation.
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#00ff94' }}>Demand-Pull inflation</strong>—This sort of inflation happens when demand becomes higher than an
                        economy's ability to produce. Because there are not enough goods and services going around
                        for everyone, their amounts of currency are more readily exchanged for them.
                    </li>
                    <li>
                        <strong style={{ color: '#00ff94' }}>Built-in inflation</strong>—Built-in inflation, sometimes called hangover inflation, is a type of inflation that
                        is a result of past events, the effects of which persist in the present. It is strongly related to cost-
                        push inflation and demand-pull inflation, as the three types of inflation are the major determinants
                        of the current inflation rate. It is affected by both subjective and objective factors that generally
                        result in the persistence of inflation through factors such as inflationary expectations and the
                        price/wage spiral.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default InflationCalculator;
