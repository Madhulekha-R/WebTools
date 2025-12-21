import React, { useState } from "react";
import "./RetirementCalculator.css";

export default function RetirementCalculator() {
    // Tab selection
    const [activeTab, setActiveTab] = useState("needToRetire");

    // Mode 1: How much do you need to retire
    const [currentAge1, setCurrentAge1] = useState(35);
    const [retirementAge1, setRetirementAge1] = useState(67);
    const [lifeExpectancy1, setLifeExpectancy1] = useState(85);
    const [currentIncome, setCurrentIncome] = useState(70000);
    const [incomeIncrease, setIncomeIncrease] = useState(3);
    const [incomeNeeded, setIncomeNeeded] = useState(75);
    const [investmentReturn1, setInvestmentReturn1] = useState(6);
    const [inflationRate1, setInflationRate1] = useState(3);
    const [otherIncome, setOtherIncome] = useState(0);
    const [currentSavings1, setCurrentSavings1] = useState(30000);
    const [futureSavings, setFutureSavings] = useState(10);

    // Mode 2: How can you save for retirement
    const [currentAge2, setCurrentAge2] = useState(35);
    const [retirementAge2, setRetirementAge2] = useState(67);
    const [amountNeeded, setAmountNeeded] = useState(600000);
    const [currentSavings2, setCurrentSavings2] = useState(30000);
    const [investmentReturn2, setInvestmentReturn2] = useState(6);

    // Mode 3: How much can you withdraw
    const [currentAge3, setCurrentAge3] = useState(35);
    const [retirementAge3, setRetirementAge3] = useState(67);
    const [lifeExpectancy3, setLifeExpectancy3] = useState(85);
    const [currentSavings3, setCurrentSavings3] = useState(30000);
    const [annualContribution, setAnnualContribution] = useState(0);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [investmentReturn3, setInvestmentReturn3] = useState(6);
    const [inflationRate3, setInflationRate3] = useState(3);

    // Mode 4: How long can your money last
    const [amountYouHave, setAmountYouHave] = useState(600000);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(5000);
    const [investmentReturn4, setInvestmentReturn4] = useState(6);

    // Results
    const [results, setResults] = useState(null);

    function calculateNeedToRetire() {
        const yearsToRetirement = retirementAge1 - currentAge1;
        const yearsInRetirement = lifeExpectancy1 - retirementAge1;

        // Calculate future income at retirement
        const futureIncome = currentIncome * Math.pow(1 + incomeIncrease / 100, yearsToRetirement);

        // Calculate annual income needed in retirement
        const annualIncomeNeeded = futureIncome * (incomeNeeded / 100);

        // Adjust for inflation
        const realReturn = ((1 + investmentReturn1 / 100) / (1 + inflationRate1 / 100)) - 1;

        // Calculate total needed at retirement (present value of annuity)
        const totalNeeded = (annualIncomeNeeded - otherIncome * 12) *
            ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn);

        // Calculate future value of current savings
        const futureValueCurrentSavings = currentSavings1 * Math.pow(1 + investmentReturn1 / 100, yearsToRetirement);

        // Calculate annual savings needed
        const annualSavingsAmount = futureIncome * (futureSavings / 100);

        // Calculate future value of annual savings
        const futureValueAnnualSavings = annualSavingsAmount *
            ((Math.pow(1 + investmentReturn1 / 100, yearsToRetirement) - 1) / (investmentReturn1 / 100));

        const totalAtRetirement = futureValueCurrentSavings + futureValueAnnualSavings;
        const shortfall = Math.max(0, totalNeeded - totalAtRetirement);

        return {
            totalNeeded,
            totalAtRetirement,
            shortfall,
            annualIncomeNeeded,
            yearsInRetirement
        };
    }

    function calculateSaveForRetirement() {
        const yearsToRetirement = retirementAge2 - currentAge2;

        // Calculate future value of current savings
        const futureValueCurrentSavings = currentSavings2 * Math.pow(1 + investmentReturn2 / 100, yearsToRetirement);

        // Calculate additional amount needed
        const additionalNeeded = amountNeeded - futureValueCurrentSavings;

        // Calculate required annual savings
        const annualSavingsNeeded = additionalNeeded * (investmentReturn2 / 100) /
            (Math.pow(1 + investmentReturn2 / 100, yearsToRetirement) - 1);

        const monthlySavingsNeeded = annualSavingsNeeded / 12;

        return {
            annualSavingsNeeded,
            monthlySavingsNeeded,
            futureValueCurrentSavings,
            additionalNeeded
        };
    }

    function calculateWithdrawal() {
        const yearsToRetirement = retirementAge3 - currentAge3;
        const yearsInRetirement = lifeExpectancy3 - retirementAge3;

        // Calculate future value of current savings
        let totalAtRetirement = currentSavings3 * Math.pow(1 + investmentReturn3 / 100, yearsToRetirement);

        // Add future value of annual contributions
        if (annualContribution > 0) {
            totalAtRetirement += annualContribution *
                ((Math.pow(1 + investmentReturn3 / 100, yearsToRetirement) - 1) / (investmentReturn3 / 100));
        }

        // Add future value of monthly contributions
        if (monthlyContribution > 0) {
            const monthlyRate = investmentReturn3 / 100 / 12;
            const months = yearsToRetirement * 12;
            totalAtRetirement += monthlyContribution *
                ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }

        // Calculate real return
        const realReturn = ((1 + investmentReturn3 / 100) / (1 + inflationRate3 / 100)) - 1;

        // Calculate monthly withdrawal (inflation-adjusted annuity)
        const monthlyRate = realReturn / 12;
        const months = yearsInRetirement * 12;
        const monthlyWithdrawalAmount = totalAtRetirement * monthlyRate /
            (1 - Math.pow(1 + monthlyRate, -months));

        const annualWithdrawalAmount = monthlyWithdrawalAmount * 12;

        return {
            totalAtRetirement,
            monthlyWithdrawalAmount,
            annualWithdrawalAmount,
            yearsInRetirement
        };
    }

    function calculateMoneyLast() {
        const monthlyRate = investmentReturn4 / 100 / 12;

        // Calculate number of months money will last
        let months;
        if (monthlyRate === 0) {
            months = amountYouHave / monthlyWithdrawal;
        } else {
            months = -Math.log(1 - (amountYouHave * monthlyRate / monthlyWithdrawal)) / Math.log(1 + monthlyRate);
        }

        const years = months / 12;

        return {
            months: Math.floor(months),
            years: years.toFixed(1),
            totalWithdrawn: monthlyWithdrawal * months
        };
    }

    function handleCalculate(e) {
        e.preventDefault();

        let calculationResults;

        switch (activeTab) {
            case "needToRetire":
                calculationResults = calculateNeedToRetire();
                break;
            case "saveForRetirement":
                calculationResults = calculateSaveForRetirement();
                break;
            case "withdrawal":
                calculationResults = calculateWithdrawal();
                break;
            case "moneyLast":
                calculationResults = calculateMoneyLast();
                break;
            default:
                return;
        }

        setResults({ ...calculationResults, mode: activeTab });
    }

    function handleClear() {
        setResults(null);
    }

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Retirement Calculator</h2>
                <div className="age-calc-subheading">
                    Plan your retirement with comprehensive calculations for savings, withdrawals, and financial planning
                </div>
            </div>

            {/* Tab Selector */}
            <div className="retirement-tab-selector">
                <button
                    className={`retirement-tab-btn ${activeTab === "needToRetire" ? "active" : ""}`}
                    onClick={() => { setActiveTab("needToRetire"); setResults(null); }}
                >
                    How much do you need?
                </button>
                <button
                    className={`retirement-tab-btn ${activeTab === "saveForRetirement" ? "active" : ""}`}
                    onClick={() => { setActiveTab("saveForRetirement"); setResults(null); }}
                >
                    How can you save?
                </button>
                <button
                    className={`retirement-tab-btn ${activeTab === "withdrawal" ? "active" : ""}`}
                    onClick={() => { setActiveTab("withdrawal"); setResults(null); }}
                >
                    How much to withdraw?
                </button>
                <button
                    className={`retirement-tab-btn ${activeTab === "moneyLast" ? "active" : ""}`}
                    onClick={() => { setActiveTab("moneyLast"); setResults(null); }}
                >
                    How long will it last?
                </button>
            </div>

            <div className="mortgage-container">
                <form className="mortgage-input-section" onSubmit={handleCalculate}>
                    <div className="mortgage-card">
                        {activeTab === "needToRetire" && (
                            <>
                                <label className="age-label">Your current age</label>
                                <input className="age-input" type="number" value={currentAge1}
                                    onChange={e => setCurrentAge1(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Your planned retirement age</label>
                                <input className="age-input" type="number" value={retirementAge1}
                                    onChange={e => setRetirementAge1(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Your life expectancy</label>
                                <input className="age-input" type="number" value={lifeExpectancy1}
                                    onChange={e => setLifeExpectancy1(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Your current pre-tax income ($/year)</label>
                                <input className="age-input" type="number" value={currentIncome}
                                    onChange={e => setCurrentIncome(parseFloat(e.target.value) || 0)} step="1000" />

                                <div className="retirement-section-header">Assumptions</div>

                                <label className="age-label">Your current income increase (%/year)</label>
                                <input className="age-input" type="number" value={incomeIncrease}
                                    onChange={e => setIncomeIncrease(parseFloat(e.target.value) || 0)} step="0.1" />

                                <label className="age-label">Income needed after retirement (% of current income)</label>
                                <input className="age-input" type="number" value={incomeNeeded}
                                    onChange={e => setIncomeNeeded(parseFloat(e.target.value) || 0)} step="1" />

                                <label className="age-label">Average investment return (%/year)</label>
                                <input className="age-input" type="number" value={investmentReturn1}
                                    onChange={e => setInvestmentReturn1(parseFloat(e.target.value) || 0)} step="0.1" />

                                <label className="age-label">Inflation rate (%/year)</label>
                                <input className="age-input" type="number" value={inflationRate1}
                                    onChange={e => setInflationRate1(parseFloat(e.target.value) || 0)} step="0.1" />

                                <div className="retirement-section-header">Optional</div>

                                <label className="age-label">Other income after retirement ($/month)</label>
                                <input className="age-input" type="number" value={otherIncome}
                                    onChange={e => setOtherIncome(parseFloat(e.target.value) || 0)} step="100" />

                                <label className="age-label">Your current retirement savings ($)</label>
                                <input className="age-input" type="number" value={currentSavings1}
                                    onChange={e => setCurrentSavings1(parseFloat(e.target.value) || 0)} step="1000" />

                                <label className="age-label">Future retirement savings (% of income)</label>
                                <input className="age-input" type="number" value={futureSavings}
                                    onChange={e => setFutureSavings(parseFloat(e.target.value) || 0)} step="1" />
                            </>
                        )}

                        {activeTab === "saveForRetirement" && (
                            <>
                                <label className="age-label">Your age now</label>
                                <input className="age-input" type="number" value={currentAge2}
                                    onChange={e => setCurrentAge2(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Your planned retirement age</label>
                                <input className="age-input" type="number" value={retirementAge2}
                                    onChange={e => setRetirementAge2(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Amount needed at the retirement age ($)</label>
                                <input className="age-input" type="number" value={amountNeeded}
                                    onChange={e => setAmountNeeded(parseFloat(e.target.value) || 0)} step="10000" />

                                <label className="age-label">Your retirement savings now ($)</label>
                                <input className="age-input" type="number" value={currentSavings2}
                                    onChange={e => setCurrentSavings2(parseFloat(e.target.value) || 0)} step="1000" />

                                <label className="age-label">Average investment return (%)</label>
                                <input className="age-input" type="number" value={investmentReturn2}
                                    onChange={e => setInvestmentReturn2(parseFloat(e.target.value) || 0)} step="0.1" />
                            </>
                        )}

                        {activeTab === "withdrawal" && (
                            <>
                                <label className="age-label">Your age now</label>
                                <input className="age-input" type="number" value={currentAge3}
                                    onChange={e => setCurrentAge3(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Your planned retirement age</label>
                                <input className="age-input" type="number" value={retirementAge3}
                                    onChange={e => setRetirementAge3(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Your life expectancy</label>
                                <input className="age-input" type="number" value={lifeExpectancy3}
                                    onChange={e => setLifeExpectancy3(parseInt(e.target.value) || 0)} />

                                <label className="age-label">Your retirement savings today ($)</label>
                                <input className="age-input" type="number" value={currentSavings3}
                                    onChange={e => setCurrentSavings3(parseFloat(e.target.value) || 0)} step="1000" />

                                <label className="age-label">Annual contribution ($)</label>
                                <input className="age-input" type="number" value={annualContribution}
                                    onChange={e => setAnnualContribution(parseFloat(e.target.value) || 0)} step="100" />

                                <label className="age-label">Monthly contribution ($)</label>
                                <input className="age-input" type="number" value={monthlyContribution}
                                    onChange={e => setMonthlyContribution(parseFloat(e.target.value) || 0)} step="10" />

                                <label className="age-label">Average investment return (%)</label>
                                <input className="age-input" type="number" value={investmentReturn3}
                                    onChange={e => setInvestmentReturn3(parseFloat(e.target.value) || 0)} step="0.1" />

                                <label className="age-label">Inflation rate (annual, %)</label>
                                <input className="age-input" type="number" value={inflationRate3}
                                    onChange={e => setInflationRate3(parseFloat(e.target.value) || 0)} step="0.1" />
                            </>
                        )}

                        {activeTab === "moneyLast" && (
                            <>
                                <label className="age-label">The amount you have ($)</label>
                                <input className="age-input" type="number" value={amountYouHave}
                                    onChange={e => setAmountYouHave(parseFloat(e.target.value) || 0)} step="10000" />

                                <label className="age-label">You plan to withdraw ($/month)</label>
                                <input className="age-input" type="number" value={monthlyWithdrawal}
                                    onChange={e => setMonthlyWithdrawal(parseFloat(e.target.value) || 0)} step="100" />

                                <label className="age-label">Average investment return (%)</label>
                                <input className="age-input" type="number" value={investmentReturn4}
                                    onChange={e => setInvestmentReturn4(parseFloat(e.target.value) || 0)} step="0.1" />
                            </>
                        )}

                        <div className="mortgage-button-group">
                            <button type="submit" className="age-calc-btn">Calculate</button>
                            <button type="button" className="age-calc-btn mortgage-clear-btn" onClick={handleClear}>Clear</button>
                        </div>
                    </div>
                </form>

                {results && (
                    <div className="mortgage-results-section">
                        <div className="mortgage-card mortgage-results-card">
                            <div className="loan-results-header">Results</div>

                            {results.mode === "needToRetire" && (
                                <div className="auto-loan-results-grid">
                                    <div className="auto-loan-result-row auto-loan-total-row">
                                        <span>Total needed at retirement</span>
                                        <span className="auto-loan-result-value">${results.totalNeeded.toFixed(2)}</span>
                                    </div>
                                    <div className="auto-loan-result-row">
                                        <span>Total at retirement</span>
                                        <span className="auto-loan-result-value">${results.totalAtRetirement.toFixed(2)}</span>
                                    </div>
                                    <div className="auto-loan-result-row">
                                        <span>Shortfall</span>
                                        <span className="auto-loan-result-value" style={{ color: results.shortfall > 0 ? '#ea4335' : '#34a853' }}>
                                            ${results.shortfall.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="auto-loan-result-row">
                                        <span>Annual income needed</span>
                                        <span className="auto-loan-result-value">${results.annualIncomeNeeded.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {results.mode === "saveForRetirement" && (
                                <div className="auto-loan-results-grid">
                                    <div className="auto-loan-result-row auto-loan-total-row">
                                        <span>Annual savings needed</span>
                                        <span className="auto-loan-result-value">${results.annualSavingsNeeded.toFixed(2)}</span>
                                    </div>
                                    <div className="auto-loan-result-row">
                                        <span>Monthly savings needed</span>
                                        <span className="auto-loan-result-value">${results.monthlySavingsNeeded.toFixed(2)}</span>
                                    </div>
                                    <div className="auto-loan-result-row">
                                        <span>Future value of current savings</span>
                                        <span className="auto-loan-result-value">${results.futureValueCurrentSavings.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {results.mode === "withdrawal" && (
                                <div className="auto-loan-results-grid">
                                    <div className="auto-loan-result-row">
                                        <span>Total at retirement</span>
                                        <span className="auto-loan-result-value">${results.totalAtRetirement.toFixed(2)}</span>
                                    </div>
                                    <div className="auto-loan-result-row auto-loan-total-row">
                                        <span>Monthly withdrawal amount</span>
                                        <span className="auto-loan-result-value">${results.monthlyWithdrawalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="auto-loan-result-row">
                                        <span>Annual withdrawal amount</span>
                                        <span className="auto-loan-result-value">${results.annualWithdrawalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {results.mode === "moneyLast" && (
                                <div className="auto-loan-results-grid">
                                    <div className="auto-loan-result-row auto-loan-total-row">
                                        <span>Your money will last</span>
                                        <span className="auto-loan-result-value">{results.years} years ({results.months} months)</span>
                                    </div>
                                    <div className="auto-loan-result-row">
                                        <span>Total withdrawn</span>
                                        <span className="auto-loan-result-value">${results.totalWithdrawn.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <h3 style={{ color: '#00ff94', marginBottom: '1rem' }}>What is Retirement?</h3>
                <p>
                    To retire is to withdraw from active working life, and for most retirees, retirement lasts the rest of their lives.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Why Retire?</h4>
                <p>
                    There are many factors at play that ultimately affect a person's decision to retire. Physical or mental health can
                    affect a person's decision to retire; if a worker is not physically strong enough, succumbs to a disability, or has
                    mentally declined too much to perform the duties of their job, they should probably consider retiring, or at the very
                    least try to find a new occupation that better accommodates their health. Also, stressors associated with an occupation
                    can become too unbearable, leading to a decline in satisfaction with work. Age is also a factor that affects a person's
                    decision to retire. Theoretically, retirement can happen during any normal working year. Some may choose to "semi-retire"
                    by gradually decreasing their work hours as they approach retirement. Some announce retirement and enter it short-term,
                    just to rejoin the workforce again. However, it generally occurs between the ages of 55 and 70.
                </p>
                <p>
                    One of the most important factors that affect a person's decision to retire is whether it is even financially possible
                    in the first place. While it is somewhat possible to retire with nothing in savings and to rely solely on Social Security
                    (which an unfortunately significant number of Americans in the U.S. do), it is generally a bad idea for most due to the
                    sheer difference between a working income as opposed to the Social Security benefits. In the U.S., Social Security benefits
                    are only designed to replace about 40% of the average worker's wages during retirement.
                </p>
                <p>
                    Retirement is an important consideration for everyone, and when not forced to retire due to various reasons such as illness
                    or disability, most people choose to retire when they are ready and comfortable with the decision.
                </p>

                <h4 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '0.5rem' }}>How Much to Save for Retirement</h4>
                <p>
                    Naturally, the next question becomes: how much should a person save for retirement? Simply put, it's an extremely loaded
                    question with very few definite answers. Similar to the answer to the question of whether to retire or not, it will depend
                    on each person, and factors such as how much income will be needed, entitlement for Social Security retirement benefits,
                    health and life expectancy, personal preferences regarding inheritances, and many other things.
                </p>
            </div>
        </div>
    );
}
