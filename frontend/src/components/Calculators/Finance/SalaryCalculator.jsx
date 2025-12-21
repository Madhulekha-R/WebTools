import React, { useState } from 'react';
import './SalaryCalculator.css';

const SalaryCalculator = () => {
    const [salaryAmount, setSalaryAmount] = useState('50');
    const [salaryPer, setSalaryPer] = useState('Hour');
    const [hoursPerWeek, setHoursPerWeek] = useState('40');
    const [daysPerWeek, setDaysPerWeek] = useState('5');
    const [holidaysPerYear, setHolidaysPerYear] = useState('10');
    const [vacationDaysPerYear, setVacationDaysPerYear] = useState('15');
    const [results, setResults] = useState(null);

    const calculateSalary = () => {
        const amount = parseFloat(salaryAmount) || 0;
        const hoursWeek = parseFloat(hoursPerWeek) || 40;
        const daysWeek = parseFloat(daysPerWeek) || 5;
        const holidays = parseFloat(holidaysPerYear) || 0;
        const vacation = parseFloat(vacationDaysPerYear) || 0;

        // Calculate hourly rate (base for all conversions)
        let hourlyRate;

        switch (salaryPer) {
            case 'Hour':
                hourlyRate = amount;
                break;
            case 'Day':
                hourlyRate = amount / (hoursWeek / daysWeek);
                break;
            case 'Week':
                hourlyRate = amount / hoursWeek;
                break;
            case 'Bi-weekly':
                hourlyRate = amount / (hoursWeek * 2);
                break;
            case 'Semi-monthly':
                hourlyRate = amount / (hoursWeek * 52 / 24);
                break;
            case 'Month':
                hourlyRate = amount / (hoursWeek * 52 / 12);
                break;
            case 'Quarter':
                hourlyRate = amount / (hoursWeek * 52 / 4);
                break;
            case 'Year':
                hourlyRate = amount / (hoursWeek * 52);
                break;
            default:
                hourlyRate = amount;
        }

        // Unadjusted calculations
        const hoursPerDay = hoursWeek / daysWeek;
        const unadjusted = {
            hourly: hourlyRate,
            daily: hourlyRate * hoursPerDay,
            weekly: hourlyRate * hoursWeek,
            biweekly: hourlyRate * hoursWeek * 2,
            semimonthly: hourlyRate * hoursWeek * 52 / 24,
            monthly: hourlyRate * hoursWeek * 52 / 12,
            quarterly: hourlyRate * hoursWeek * 52 / 4,
            annual: hourlyRate * hoursWeek * 52
        };

        // Adjusted calculations (accounting for holidays and vacation)
        const totalDaysOff = holidays + vacation;
        const workingDaysPerYear = (52 * daysWeek) - totalDaysOff;
        const workingHoursPerYear = workingDaysPerYear * hoursPerDay;
        const adjustedHourlyRate = (unadjusted.annual / workingHoursPerYear);

        const adjusted = {
            hourly: adjustedHourlyRate,
            daily: adjustedHourlyRate * hoursPerDay,
            weekly: adjustedHourlyRate * hoursWeek,
            biweekly: adjustedHourlyRate * hoursWeek * 2,
            semimonthly: adjustedHourlyRate * hoursWeek * 52 / 24,
            monthly: adjustedHourlyRate * hoursWeek * 52 / 12,
            quarterly: adjustedHourlyRate * hoursWeek * 52 / 4,
            annual: unadjusted.annual // Annual stays the same
        };

        setResults({ unadjusted, adjusted });
    };

    const handleClear = () => {
        setSalaryAmount('50');
        setSalaryPer('Hour');
        setHoursPerWeek('40');
        setDaysPerWeek('5');
        setHolidaysPerYear('10');
        setVacationDaysPerYear('15');
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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="age-calc-root">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">Salary Calculator</h2>
                <div className="age-calc-subheading">
                    Convert salary amounts to their corresponding values based on payment frequency
                </div>
            </div>

            <p className="salary-intro">
                The Salary Calculator converts salary amounts to their corresponding values based on payment
                frequency. Examples of payment frequencies include biweekly, semi-monthly, or monthly payments.
                Results include unadjusted figures and adjusted figures that account for vacation days and holidays
                per year.
            </p>

            <div className="salary-container">
                <div className="salary-input-section">
                    <div className="salary-card">
                        <div className="input-group">
                            <label>Salary amount</label>
                            <div className="salary-amount-row">
                                <div className="input-with-prefix">
                                    <span className="input-prefix">$</span>
                                    <input
                                        type="number"
                                        value={salaryAmount}
                                        onChange={(e) => setSalaryAmount(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <span className="salary-per-label">per</span>
                                <select
                                    value={salaryPer}
                                    onChange={(e) => setSalaryPer(e.target.value)}
                                    className="form-input salary-select"
                                >
                                    <option value="Hour">Hour</option>
                                    <option value="Day">Day</option>
                                    <option value="Week">Week</option>
                                    <option value="Bi-weekly">Bi-weekly</option>
                                    <option value="Semi-monthly">Semi-monthly</option>
                                    <option value="Month">Month</option>
                                    <option value="Quarter">Quarter</option>
                                    <option value="Year">Year</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Hours per week</label>
                            <input
                                type="number"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>Days per week</label>
                            <input
                                type="number"
                                value={daysPerWeek}
                                onChange={(e) => setDaysPerWeek(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>Holidays per year</label>
                            <input
                                type="number"
                                value={holidaysPerYear}
                                onChange={(e) => setHolidaysPerYear(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>Vacation days per year</label>
                            <input
                                type="number"
                                value={vacationDaysPerYear}
                                onChange={(e) => setVacationDaysPerYear(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="salary-button-group">
                            <button onClick={calculateSalary} className="btn btn-primary">
                                Calculate
                            </button>
                            <button onClick={handleClear} className="btn salary-clear-btn">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="salary-results-section">
                        <div className="salary-card salary-results-card">
                            <h3 className="salary-section-title">Result</h3>
                            <div className="salary-table">
                                <div className="salary-table-header">
                                    <div></div>
                                    <div>Unadjusted</div>
                                    <div>Holidays & vacation days adjusted</div>
                                </div>
                                <div className="salary-table-body">
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Hourly</div>
                                        <div>{formatCurrency(results.unadjusted.hourly)}</div>
                                        <div>{formatCurrency(results.adjusted.hourly)}</div>
                                    </div>
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Daily</div>
                                        <div>{formatCurrency(results.unadjusted.daily)}</div>
                                        <div>{formatCurrency(results.adjusted.daily)}</div>
                                    </div>
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Weekly</div>
                                        <div>{formatCurrency(results.unadjusted.weekly)}</div>
                                        <div>{formatCurrency(results.adjusted.weekly)}</div>
                                    </div>
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Bi-weekly</div>
                                        <div>{formatCurrency(results.unadjusted.biweekly)}</div>
                                        <div>{formatCurrency(results.adjusted.biweekly)}</div>
                                    </div>
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Semi-monthly</div>
                                        <div>{formatCurrency(results.unadjusted.semimonthly)}</div>
                                        <div>{formatCurrency(results.adjusted.semimonthly)}</div>
                                    </div>
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Monthly</div>
                                        <div>{formatCurrency(results.unadjusted.monthly)}</div>
                                        <div>{formatCurrency(results.adjusted.monthly)}</div>
                                    </div>
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Quarterly</div>
                                        <div>{formatCurrency(results.unadjusted.quarterly)}</div>
                                        <div>{formatCurrency(results.adjusted.quarterly)}</div>
                                    </div>
                                    <div className="salary-table-row">
                                        <div className="salary-frequency">Annual</div>
                                        <div>{formatCurrency(results.unadjusted.annual)}</div>
                                        <div>{formatCurrency(results.adjusted.annual)}</div>
                                    </div>
                                </div>
                            </div>

                            <p className="salary-note">
                                This salary calculator assumes the hourly and daily salary inputs to be unadjusted values.
                                All other pay frequency inputs are assumed to be holidays and vacation days adjusted values.
                                This calculator also assumes 52 working weeks or 260 weekdays per year in its calculations.
                                The unadjusted results ignore the holidays and paid vacation days.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Educational Content */}
            <div className="age-content" style={{ marginTop: "2.3rem" }}>
                <p>
                    A salary or wage is the payment from an employer to a worker for the time and works contributed. To
                    protect workers, many countries enforce minimum wages set by either central or local governments.
                    Also, unions may be formed in order to set standards in certain companies or industries.
                </p>

                <h3 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '1rem' }}>Salary</h3>
                <p>
                    A salary is normally paid on a regular basis, and the amount normally does not fluctuate based on the
                    quality or quantity of work performed. An employee's salary is commonly defined as an annual figure in
                    an employment contract that is signed upon hiring. Salary can sometimes be accompanied by
                    additional compensation such as goods or services.
                </p>

                <h3 style={{ color: '#00ff94', marginTop: '1.5rem', marginBottom: '1rem' }}>Wage</h3>
                <p>
                    There are several technical differences between the terms "wage" and "salary." For starters, while the
                    word "salary" is best associated with employee compensation on an annual basis, the word "wage" is
                    best associated with employee compensation based on the number of hours worked multiplied by an
                    hourly rate of pay. Also, wage-earners tend to be non-exempt, which means they are subject to
                    overtime wage regulations set by the government to protect workers. In the U.S., these regulations are
                    part of the Fair Labor Standards Act (FLSA). Non-exempt employees often receive 1.5 times their pay
                    for any hours they work after surpassing 40 hours a week, also known as overtime pay, and
                    sometimes double (and less commonly triple) their pay if they work on holidays. Salaried employees
                    generally do not receive such benefits; if they work over 40 hours a week or on holiday, they will not be
                    directly financially compensated for doing so. Generally speaking, wage-earners tend to earn less than
                    salaried employees. For instance, a barista that works in a cafe may earn a "wage," while a
                    professional that works in an office setting may earn a "salary." As a result, salaried positions often
                    have a higher perceived status in society.
                </p>

                <p>
                    Most salaries and wages are paid periodically, typically monthly, semi-monthly, bi-weekly, weekly, etc.
                    Although it is called a Salary Calculator, wage-earners may still use the calculator to convert amounts.
                </p>
            </div>
        </div>
    );
};

export default SalaryCalculator;
