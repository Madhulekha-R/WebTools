import React, { useState } from 'react';
import './SalesTaxCalculator.css';

const SalesTaxCalculator = () => {
    const [beforeTaxPrice, setBeforeTaxPrice] = useState('100');
    const [salesTaxRate, setSalesTaxRate] = useState('6.5');
    const [afterTaxPrice, setAfterTaxPrice] = useState('');

    const calculateMissingValue = () => {
        const before = parseFloat(beforeTaxPrice) || 0;
        const rate = parseFloat(salesTaxRate) || 0;
        const after = parseFloat(afterTaxPrice) || 0;

        // Count how many fields are filled
        const filledFields = [before > 0, rate > 0, after > 0].filter(Boolean).length;

        if (filledFields < 2) {
            alert('Please enter at least two values');
            return;
        }

        // Calculate the missing value
        if (!beforeTaxPrice || before === 0) {
            // Calculate before tax price from after tax price and rate
            const calculated = after / (1 + rate / 100);
            setBeforeTaxPrice(calculated.toFixed(2));
        } else if (!salesTaxRate || rate === 0) {
            // Calculate tax rate from before and after tax prices
            const calculated = ((after - before) / before) * 100;
            setSalesTaxRate(calculated.toFixed(2));
        } else if (!afterTaxPrice || after === 0) {
            // Calculate after tax price from before tax price and rate
            const calculated = before * (1 + rate / 100);
            setAfterTaxPrice(calculated.toFixed(2));
        }
    };

    const handleClear = () => {
        setBeforeTaxPrice('100');
        setSalesTaxRate('6.5');
        setAfterTaxPrice('');
    };

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Sales Tax Calculator</h2>
                <div className="age-calc-subheading">
                    Calculate before-tax price, sales tax rate, or after-tax price
                </div>
            </div>

            <p className="sales-tax-intro">
                The Sales Tax Calculator can compute any one of the following, given inputs for the remaining two:
                before-tax price, sale tax rate, and final, or after-tax price.
            </p>

            <div className="sales-tax-container">
                <div className="sales-tax-card">
                    <div className="sales-tax-inputs">
                        <div className="input-group">
                            <label>Before Tax Price</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={beforeTaxPrice}
                                    onChange={(e) => setBeforeTaxPrice(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Sales Tax Rate</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={salesTaxRate}
                                    onChange={(e) => setSalesTaxRate(e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="Enter rate"
                                />
                                <span className="input-suffix">%</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>After Tax Price</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={afterTaxPrice}
                                    onChange={(e) => setAfterTaxPrice(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>

                        <div className="sales-tax-button-group">
                            <button onClick={calculateMissingValue} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn sales-tax-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>What is Sales Tax?</h3>
                <p>
                    A sales tax is a consumption tax paid to a government on the sale of certain goods and services.
                    Usually, the vendor collects the sales tax from the consumer as the consumer makes a purchase. In
                    most countries, the sales tax is called value-added tax (VAT) or goods and services tax (GST), which is
                    a different form of consumption tax. In some countries, the listed prices for goods and services are the
                    before-tax value, and a sales tax is only applied during the purchase. In other countries, the listed
                    prices are the final after-tax values, which include the sales tax.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>U.S. Sales Tax</h4>
                <p>
                    In the United States, sales tax at the federal level does not exist. At the state level, all (including
                    District of Columbia, Puerto Rico, and Guam) but five states do not have statewide sales tax. These
                    are Alaska, Delaware, Montana, New Hampshire, and Oregon. States that impose a sales tax have
                    different rates, and even within states, local or city sales taxes can come into play. Unlike VAT (which is
                    not imposed in the U.S.), sales tax is only enforced on retail purchases; most transactions of goods or
                    services between businesses are not subject to sales tax.
                </p>

                <p>
                    The sales tax rate ranges from 0% to 16% depending on the state and the type of good or service, and
                    all states differ in their enforcement of sales tax. In Texas, prescription medicine and food seeds are
                    exempt from taxation. Vermont has a 6% general sales tax, but an additional 10% tax is added to
                    purchases of alcoholic drinks that are immediately consumed. These are only several examples of
                    differences in taxation in different jurisdictions. Rules and regulations regarding sales tax vary widely
                    from state to state.
                </p>

                <p>
                    On average, the impact of sales tax on Americans is about 2 percent of their personal income. Sales
                    tax provides nearly one-third of state government revenue and is second only to the income tax in
                    terms of importance as a source of revenue. Reliance on the sales tax varies widely by state. Sales
                    taxes are much more important in the south and west than they are in New England and the industrial
                    Midwest. Florida, Washington, Tennessee, and Texas all generate more than 50 percent of their tax
                    revenue from the sales tax, and several of these states raise nearly 60 percent of their tax revenue
                    from the sales tax. New York, on the other hand, only raises about 20 percent of its revenues from the
                    sales tax.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Sales Tax Formulas</h4>
                <p>The following formulas are used to calculate sales tax:</p>

                <div style={{ background: 'rgba(0, 207, 255, 0.05)', padding: '15px', borderRadius: '8px', margin: '1rem 0' }}>
                    <p style={{ color: '#00cfff', margin: '0.5rem 0' }}>
                        <strong>Sales Tax Amount</strong> = Before Tax Price × (Sales Tax Rate / 100)
                    </p>
                    <p style={{ color: '#00cfff', margin: '0.5rem 0' }}>
                        <strong>After Tax Price</strong> = Before Tax Price × (1 + Sales Tax Rate / 100)
                    </p>
                    <p style={{ color: '#00cfff', margin: '0.5rem 0' }}>
                        <strong>Before Tax Price</strong> = After Tax Price / (1 + Sales Tax Rate / 100)
                    </p>
                    <p style={{ color: '#00cfff', margin: '0.5rem 0' }}>
                        <strong>Sales Tax Rate</strong> = ((After Tax Price - Before Tax Price) / Before Tax Price) × 100
                    </p>
                </div>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Example Calculation</h4>
                <p>
                    If an item costs $100 before tax and the sales tax rate is 6.5%:
                </p>
                <ul style={{ color: '#b0b3b8', lineHeight: '1.8' }}>
                    <li><strong>Sales Tax Amount:</strong> $100 × 0.065 = $6.50</li>
                    <li><strong>After Tax Price:</strong> $100 + $6.50 = $106.50</li>
                </ul>
            </div>
        </div>
    );
};

export default SalesTaxCalculator;
