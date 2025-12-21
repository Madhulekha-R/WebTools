import React, { useState } from 'react';
import './IncomeTaxCalculator.css';

const IncomeTaxCalculator = () => {
    // File Status
    const [filingStatus, setFilingStatus] = useState('Single');
    const [youngDependents, setYoungDependents] = useState('0');
    const [otherDependents, setOtherDependents] = useState('0');
    const [taxYear, setTaxYear] = useState('2025');

    // Income
    const [age, setAge] = useState('30');
    const [wages, setWages] = useState('80000');
    const [federalTaxWithheld, setFederalTaxWithheld] = useState('9000');
    const [stateTaxWithheld, setStateTaxWithheld] = useState('0');
    const [localTaxWithheld, setLocalTaxWithheld] = useState('0');
    const [hasBusiness, setHasBusiness] = useState('no');
    const [socialSecurityIncome, setSocialSecurityIncome] = useState('0');
    const [interestIncome, setInterestIncome] = useState('0');
    const [ordinaryDividends, setOrdinaryDividends] = useState('0');
    const [qualifiedDividends, setQualifiedDividends] = useState('0');
    const [passiveIncomes, setPassiveIncomes] = useState('0');
    const [shortTermCapitalGains, setShortTermCapitalGains] = useState('0');
    const [longTermCapitalGains, setLongTermCapitalGains] = useState('0');
    const [otherIncome, setOtherIncome] = useState('0');
    const [stateLocalTaxRate, setStateLocalTaxRate] = useState('0');

    // Deductions & Credits
    const [tipsIncome, setTipsIncome] = useState('0');
    const [overtimeIncome, setOvertimeIncome] = useState('0');
    const [carLoanInterest, setCarLoanInterest] = useState('0');
    const [iraContributions, setIraContributions] = useState('0');
    const [realEstateTax, setRealEstateTax] = useState('0');
    const [mortgageInterest, setMortgageInterest] = useState('0');
    const [charitableDonations, setCharitableDonations] = useState('0');
    const [studentLoanInterest, setStudentLoanInterest] = useState('0');
    const [childCareExpense, setChildCareExpense] = useState('0');
    const [collegeStudent1, setCollegeStudent1] = useState('0');
    const [collegeStudent2, setCollegeStudent2] = useState('0');
    const [collegeStudent3, setCollegeStudent3] = useState('0');
    const [collegeStudent4, setCollegeStudent4] = useState('0');
    const [otherDeductibles, setOtherDeductibles] = useState('0');

    const [results, setResults] = useState(null);

    const calculateTax = () => {
        // Tax brackets for 2025 (simplified)
        const taxBrackets2025 = {
            'Single': [
                { limit: 11600, rate: 0.10 },
                { limit: 47150, rate: 0.12 },
                { limit: 100525, rate: 0.22 },
                { limit: 191950, rate: 0.24 },
                { limit: 243725, rate: 0.32 },
                { limit: 609350, rate: 0.35 },
                { limit: Infinity, rate: 0.37 }
            ],
            'Married Filing Jointly': [
                { limit: 23200, rate: 0.10 },
                { limit: 94300, rate: 0.12 },
                { limit: 201050, rate: 0.22 },
                { limit: 383900, rate: 0.24 },
                { limit: 487450, rate: 0.32 },
                { limit: 731200, rate: 0.35 },
                { limit: Infinity, rate: 0.37 }
            ],
            'Married Filing Separately': [
                { limit: 11600, rate: 0.10 },
                { limit: 47150, rate: 0.12 },
                { limit: 100525, rate: 0.22 },
                { limit: 191950, rate: 0.24 },
                { limit: 243725, rate: 0.32 },
                { limit: 365600, rate: 0.35 },
                { limit: Infinity, rate: 0.37 }
            ],
            'Head of Household': [
                { limit: 16550, rate: 0.10 },
                { limit: 63100, rate: 0.12 },
                { limit: 100500, rate: 0.22 },
                { limit: 191950, rate: 0.24 },
                { limit: 243700, rate: 0.32 },
                { limit: 609350, rate: 0.35 },
                { limit: Infinity, rate: 0.37 }
            ]
        };

        // Standard deductions for 2025
        const standardDeductions = {
            'Single': 14600,
            'Married Filing Jointly': 29200,
            'Married Filing Separately': 14600,
            'Head of Household': 21900
        };

        // Calculate total income
        const totalIncome =
            parseFloat(wages) +
            parseFloat(socialSecurityIncome) +
            parseFloat(interestIncome) +
            parseFloat(ordinaryDividends) +
            parseFloat(passiveIncomes) +
            parseFloat(shortTermCapitalGains) +
            parseFloat(longTermCapitalGains) +
            parseFloat(otherIncome) +
            parseFloat(tipsIncome) +
            parseFloat(overtimeIncome);

        // Calculate total deductions
        const itemizedDeductions =
            parseFloat(carLoanInterest) +
            parseFloat(iraContributions) +
            parseFloat(realEstateTax) +
            parseFloat(mortgageInterest) +
            parseFloat(charitableDonations) +
            parseFloat(studentLoanInterest) +
            parseFloat(childCareExpense) +
            parseFloat(collegeStudent1) +
            parseFloat(collegeStudent2) +
            parseFloat(collegeStudent3) +
            parseFloat(collegeStudent4) +
            parseFloat(otherDeductibles);

        const standardDeduction = standardDeductions[filingStatus];
        const deduction = Math.max(itemizedDeductions, standardDeduction);

        // Calculate taxable income
        const taxableIncome = Math.max(0, totalIncome - deduction);

        // Calculate federal tax
        const brackets = taxBrackets2025[filingStatus];
        let federalTax = 0;
        let remainingIncome = taxableIncome;
        let previousLimit = 0;

        for (const bracket of brackets) {
            const taxableAtThisRate = Math.min(remainingIncome, bracket.limit - previousLimit);
            if (taxableAtThisRate <= 0) break;

            federalTax += taxableAtThisRate * bracket.rate;
            remainingIncome -= taxableAtThisRate;
            previousLimit = bracket.limit;

            if (remainingIncome <= 0) break;
        }

        // Calculate state/local tax
        const stateLocalTax = taxableIncome * (parseFloat(stateLocalTaxRate) / 100);

        // Calculate total tax
        const totalTax = federalTax + stateLocalTax;

        // Calculate refund or owed
        const totalWithheld = parseFloat(federalTaxWithheld) + parseFloat(stateTaxWithheld) + parseFloat(localTaxWithheld);
        const refundOrOwed = totalWithheld - totalTax;

        setResults({
            totalIncome,
            deduction,
            taxableIncome,
            federalTax,
            stateLocalTax,
            totalTax,
            totalWithheld,
            refundOrOwed,
            usingStandardDeduction: deduction === standardDeduction
        });
    };

    const handleClear = () => {
        setFilingStatus('Single');
        setYoungDependents('0');
        setOtherDependents('0');
        setTaxYear('2025');
        setAge('30');
        setWages('80000');
        setFederalTaxWithheld('9000');
        setStateTaxWithheld('0');
        setLocalTaxWithheld('0');
        setHasBusiness('no');
        setSocialSecurityIncome('0');
        setInterestIncome('0');
        setOrdinaryDividends('0');
        setQualifiedDividends('0');
        setPassiveIncomes('0');
        setShortTermCapitalGains('0');
        setLongTermCapitalGains('0');
        setOtherIncome('0');
        setStateLocalTaxRate('0');
        setTipsIncome('0');
        setOvertimeIncome('0');
        setCarLoanInterest('0');
        setIraContributions('0');
        setRealEstateTax('0');
        setMortgageInterest('0');
        setCharitableDonations('0');
        setStudentLoanInterest('0');
        setChildCareExpense('0');
        setCollegeStudent1('0');
        setCollegeStudent2('0');
        setCollegeStudent3('0');
        setCollegeStudent4('0');
        setOtherDeductibles('0');
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
                <h2 className="age-calc-heading">Income Tax Calculator</h2>
                <div className="age-calc-subheading">
                    Estimate your federal tax refund or amount owed based on 2025 and 2026 tax brackets
                </div>
            </div>

            <p className="tax-intro">
                The Income Tax Calculator estimates the refund or potential owed amount on a federal tax return. It is
                mainly intended for residents of the U.S. and is based on the tax brackets of 2025 and 2026 (One Big
                Beautiful Bill). The 2026 tax values can be used for 1040-ES estimation, planning ahead, or comparison.
            </p>

            <div className="tax-container">
                {/* File Status Section */}
                <div className="tax-section">
                    <h3 className="tax-section-header">File Status</h3>
                    <div className="tax-card">
                        <div className="tax-row">
                            <label className="tax-label">Filing Status</label>
                            <select
                                value={filingStatus}
                                onChange={(e) => setFilingStatus(e.target.value)}
                                className="form-input tax-select"
                            >
                                <option value="Single">Single</option>
                                <option value="Married Filing Jointly">Married Filing Jointly</option>
                                <option value="Married Filing Separately">Married Filing Separately</option>
                                <option value="Head of Household">Head of Household</option>
                            </select>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">No. of Young Dependents</label>
                            <input
                                type="number"
                                value={youngDependents}
                                onChange={(e) => setYoungDependents(e.target.value)}
                                className="form-input tax-input"
                            />
                            <span className="tax-hint">Age 0-16</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">No. of Other Dependents</label>
                            <input
                                type="number"
                                value={otherDependents}
                                onChange={(e) => setOtherDependents(e.target.value)}
                                className="form-input tax-input"
                            />
                            <span className="tax-hint">Age 17 or older</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Tax Year</label>
                            <div className="tax-radio-group">
                                <label className="tax-radio-label">
                                    <input
                                        type="radio"
                                        value="2026"
                                        checked={taxYear === '2026'}
                                        onChange={(e) => setTaxYear(e.target.value)}
                                    />
                                    <span>2026 (return filed in 2027)</span>
                                </label>
                                <label className="tax-radio-label">
                                    <input
                                        type="radio"
                                        value="2025"
                                        checked={taxYear === '2025'}
                                        onChange={(e) => setTaxYear(e.target.value)}
                                    />
                                    <span>2025 (return filed in 2026)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income Section */}
                <div className="tax-section">
                    <h3 className="tax-section-header">Income</h3>
                    <div className="tax-card">
                        <div className="tax-row">
                            <label className="tax-label">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="form-input tax-input"
                            />
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Wages, Tips, Other Compensation</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={wages}
                                    onChange={(e) => setWages(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">(W-2 box 1)</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Federal Income Tax Withheld</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={federalTaxWithheld}
                                    onChange={(e) => setFederalTaxWithheld(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">(W-2 box 2)</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">State Income Tax Withheld</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={stateTaxWithheld}
                                    onChange={(e) => setStateTaxWithheld(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">(W-2 box 17)</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Local Income Tax Withheld</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={localTaxWithheld}
                                    onChange={(e) => setLocalTaxWithheld(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">(W-2 box 19)</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Has Business or Self Employment Income?</label>
                            <div className="tax-radio-group">
                                <label className="tax-radio-label">
                                    <input
                                        type="radio"
                                        value="yes"
                                        checked={hasBusiness === 'yes'}
                                        onChange={(e) => setHasBusiness(e.target.value)}
                                    />
                                    <span>yes</span>
                                </label>
                                <label className="tax-radio-label">
                                    <input
                                        type="radio"
                                        value="no"
                                        checked={hasBusiness === 'no'}
                                        onChange={(e) => setHasBusiness(e.target.value)}
                                    />
                                    <span>no</span>
                                </label>
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Social Security Income</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={socialSecurityIncome}
                                    onChange={(e) => setSocialSecurityIncome(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">SSA-1099, RRB-1099</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Interest Income</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={interestIncome}
                                    onChange={(e) => setInterestIncome(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">1099-INT</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Ordinary Dividends</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={ordinaryDividends}
                                    onChange={(e) => setOrdinaryDividends(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Qualified Dividends</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={qualifiedDividends}
                                    onChange={(e) => setQualifiedDividends(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">1099-DIV</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Passive Incomes</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={passiveIncomes}
                                    onChange={(e) => setPassiveIncomes(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">e.g. rentals and real estate, royalties</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Short-term Capital Gains</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={shortTermCapitalGains}
                                    onChange={(e) => setShortTermCapitalGains(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Long-term Capital Gains</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={longTermCapitalGains}
                                    onChange={(e) => setLongTermCapitalGains(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Other Income</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={otherIncome}
                                    onChange={(e) => setOtherIncome(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">e.g. unemployment pay(1099-G), retirement pay (1099-R)</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">State+Local Tax Rate</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    value={stateLocalTaxRate}
                                    onChange={(e) => setStateLocalTaxRate(e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                />
                                <span className="input-suffix">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deductions & Credits Section */}
                <div className="tax-section">
                    <h3 className="tax-section-header">Deductions & Credits</h3>
                    <div className="tax-card">
                        <div className="tax-row">
                            <label className="tax-label">Tips Income</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={tipsIncome}
                                    onChange={(e) => setTipsIncome(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Overtime Income</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={overtimeIncome}
                                    onChange={(e) => setOvertimeIncome(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Car Loan Interest</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={carLoanInterest}
                                    onChange={(e) => setCarLoanInterest(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">Max $10,000 for qualified vehicle purchase</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">IRA Contributions</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={iraContributions}
                                    onChange={(e) => setIraContributions(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Real Estate Tax</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={realEstateTax}
                                    onChange={(e) => setRealEstateTax(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Mortgage Interest</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={mortgageInterest}
                                    onChange={(e) => setMortgageInterest(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Charitable Donations</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={charitableDonations}
                                    onChange={(e) => setCharitableDonations(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Student Loan Interest</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={studentLoanInterest}
                                    onChange={(e) => setStudentLoanInterest(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">Max $2,500/Person</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Child & Dependent Care Expense</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={childCareExpense}
                                    onChange={(e) => setChildCareExpense(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <span className="tax-hint">Max $3,000/Person, $6,000 total, up to age 13</span>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">College Education Expense</label>
                            <div className="tax-college-inputs">
                                <div className="input-with-prefix">
                                    <span className="input-prefix">$</span>
                                    <input
                                        type="number"
                                        value={collegeStudent1}
                                        onChange={(e) => setCollegeStudent1(e.target.value)}
                                        className="form-input"
                                        placeholder="Student 1"
                                    />
                                </div>
                                <div className="input-with-prefix">
                                    <span className="input-prefix">$</span>
                                    <input
                                        type="number"
                                        value={collegeStudent2}
                                        onChange={(e) => setCollegeStudent2(e.target.value)}
                                        className="form-input"
                                        placeholder="Student 2"
                                    />
                                </div>
                                <div className="input-with-prefix">
                                    <span className="input-prefix">$</span>
                                    <input
                                        type="number"
                                        value={collegeStudent3}
                                        onChange={(e) => setCollegeStudent3(e.target.value)}
                                        className="form-input"
                                        placeholder="Student 3"
                                    />
                                </div>
                                <div className="input-with-prefix">
                                    <span className="input-prefix">$</span>
                                    <input
                                        type="number"
                                        value={collegeStudent4}
                                        onChange={(e) => setCollegeStudent4(e.target.value)}
                                        className="form-input"
                                        placeholder="Student 4"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="tax-row">
                            <label className="tax-label">Other Deductibles</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    value={otherDeductibles}
                                    onChange={(e) => setOtherDeductibles(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="tax-button-group">
                            <button onClick={calculateTax} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn tax-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="tax-results-container">
                        <div className="tax-card tax-results-card">
                            <h3 className="tax-section-title">Tax Results</h3>
                            <div className="tax-results-box">
                                <div className="tax-result-row">
                                    <span className="tax-result-label">Total Income</span>
                                    <span className="tax-result-value">{formatCurrency(results.totalIncome)}</span>
                                </div>
                                <div className="tax-result-row">
                                    <span className="tax-result-label">Deduction ({results.usingStandardDeduction ? 'Standard' : 'Itemized'})</span>
                                    <span className="tax-result-value">{formatCurrency(results.deduction)}</span>
                                </div>
                                <div className="tax-result-row">
                                    <span className="tax-result-label">Taxable Income</span>
                                    <span className="tax-result-value">{formatCurrency(results.taxableIncome)}</span>
                                </div>
                                <div className="tax-result-row">
                                    <span className="tax-result-label">Federal Tax</span>
                                    <span className="tax-result-value">{formatCurrency(results.federalTax)}</span>
                                </div>
                                <div className="tax-result-row">
                                    <span className="tax-result-label">State/Local Tax</span>
                                    <span className="tax-result-value">{formatCurrency(results.stateLocalTax)}</span>
                                </div>
                                <div className="tax-result-row">
                                    <span className="tax-result-label">Total Tax</span>
                                    <span className="tax-result-value">{formatCurrency(results.totalTax)}</span>
                                </div>
                                <div className="tax-result-row">
                                    <span className="tax-result-label">Total Withheld</span>
                                    <span className="tax-result-value">{formatCurrency(results.totalWithheld)}</span>
                                </div>
                                <div className="tax-result-row highlight">
                                    <span className="tax-result-label">
                                        {results.refundOrOwed >= 0 ? 'Estimated Refund' : 'Estimated Amount Owed'}
                                    </span>
                                    <span className="tax-result-value">
                                        {formatCurrency(Math.abs(results.refundOrOwed))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>Taxable Income</h3>
                <p>
                    In order to find an estimated tax refund or due, it is first necessary to determine a proper taxable
                    income. It is possible to use W-2 forms as a reference for filling out the input fields. Relevant W-2
                    boxes are displayed to the side if they can be taken from the form. Taking gross income, subtract
                    deductions and exemptions such as contributions to a 401(k) or pension plan. The resulting figure
                    should be the taxable income amount.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Other Taxable Income</h4>

                <p><strong style={{ color: '#00cfff' }}>Interest Income</strong>—Most interest will be taxed as ordinary income, including interest earned on checking
                    and savings accounts, CDs, and income tax refunds. However, there are certain exceptions, such as
                    municipal bond interest and private-activity bonds.</p>

                <p><strong style={{ color: '#00cfff' }}>Short-term Capital Gains/Losses</strong>—profit or loss from the sale of assets held for less than one year. It
                    is taxed as a normal income.</p>

                <p><strong style={{ color: '#00cfff' }}>Long-term Capital Gains/Losses</strong>—profit or loss from the sale of assets held for one year or longer.
                    Taxation rules applied are determined by ordinary income marginal tax rate.</p>

                <p><strong style={{ color: '#00cfff' }}>Ordinary Dividends</strong>—All dividends should be considered ordinary unless specifically classified as
                    qualified. Ordinary dividends are taxed as normal income.</p>

                <p><strong style={{ color: '#00cfff' }}>Qualified Dividends</strong>—These are taxed at the same rate as long-term capital gains, lower than that of
                    ordinary dividends. There are many stringent measures in place for dividends to be legally defined as
                    qualified.</p>

                <p><strong style={{ color: '#00cfff' }}>Passive Incomes</strong>—Making the distinction between passive and active income is important because
                    taxpayers can claim passive losses. Passive income generally comes from two places, rental
                    properties or businesses that don't require material participation. Any excessive passive income loss
                    can be accrued until used or deducted in the year the taxpayer disposes of the passive activity in a
                    taxable transaction.</p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Exemptions</h4>
                <p>
                    Broadly speaking, tax exemptions are monetary exemptions with the aim of reducing or even entirely
                    eliminating taxable income. They do not only apply to personal income tax; for instance, charities and
                    religious organizations are generally exempt from taxation. In some international airports, tax-exempt
                    shopping in the form of duty-free shops is available. Other examples include state and local
                    governments not being subject to federal income taxes.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Tax Deductions</h4>
                <p>
                    Tax deductions arise from expenses. They help lower tax bills by reducing the percentage of adjusted
                    gross income that is subject to taxes. There are two types of deductions, above-the-line (ATL) and
                    below-the-line (BTL) itemized deductions, which reduce tax based on the marginal tax rate. The "line"
                    in question is the adjusted gross income (AGI) of the taxpayer and is the bottom number on the front of
                    Form 1040.
                </p>

                <h5 style={{ color: '#00cfff', marginTop: '1rem', marginBottom: '0.5rem' }}>Modified Adjusted Gross Income (MAGI)</h5>
                <p>
                    MAGI is mainly used to determine whether a taxpayer is qualified for certain tax deductions. It is simply
                    AGI with some deductions added back in. These deductions are:
                </p>

                <ul style={{ color: '#d6fce9', lineHeight: '1.8', marginTop: '0.5rem' }}>
                    <li>Student loan interest</li>
                    <li>One-half of self-employment tax</li>
                    <li>Qualified tuition expenses</li>
                    <li>Tuition and fees deduction</li>
                    <li>Passive loss or passive income</li>
                    <li>IRA contributions, taxable Social Security payments</li>
                    <li>The exclusion for income from U.S. savings bonds</li>
                    <li>The exclusion under 137 for adoption expenses</li>
                    <li>Rental losses</li>
                    <li>Any overall loss from a publicly traded company</li>
                    <li>Tips and overtime compensation</li>
                    <li>Car loan interest</li>
                    <li>Seniors</li>
                </ul>
            </div>
        </div>
    );
};

export default IncomeTaxCalculator;
