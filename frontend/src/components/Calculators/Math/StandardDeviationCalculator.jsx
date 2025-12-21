import React, { useState } from "react";
import "./StandardDeviationCalculator.css";

export default function StandardDeviationCalculator() {
    const [numbers, setNumbers] = useState("10, 12, 23, 23, 16, 23, 21, 16");
    const [dataType, setDataType] = useState("population");
    const [results, setResults] = useState(null);

    const calculate = () => {
        // Parse numbers from comma-separated string
        const numArray = numbers
            .split(",")
            .map(n => parseFloat(n.trim()))
            .filter(n => !isNaN(n));

        if (numArray.length === 0) {
            alert("Please enter valid numbers");
            return;
        }

        // Calculate mean
        const mean = numArray.reduce((sum, n) => sum + n, 0) / numArray.length;

        // Calculate variance
        const squaredDiffs = numArray.map(n => Math.pow(n - mean, 2));
        const sumSquaredDiffs = squaredDiffs.reduce((sum, n) => sum + n, 0);

        let variance, stdDev, marginOfError;

        if (dataType === "population") {
            variance = sumSquaredDiffs / numArray.length;
            stdDev = Math.sqrt(variance);
            marginOfError = 1.96 * (stdDev / Math.sqrt(numArray.length));
        } else {
            variance = sumSquaredDiffs / (numArray.length - 1);
            stdDev = Math.sqrt(variance);
            marginOfError = 1.96 * (stdDev / Math.sqrt(numArray.length));
        }

        const sum = numArray.reduce((s, n) => s + n, 0);

        setResults({
            count: numArray.length,
            sum: sum.toFixed(4),
            mean: mean.toFixed(4),
            variance: variance.toFixed(4),
            stdDev: stdDev.toFixed(4),
            marginOfError: marginOfError.toFixed(4),
        });
    };

    const clear = () => {
        setNumbers("");
        setResults(null);
    };

    return (
        <div className="age-calc-root percent-bg">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">STANDARD DEVIATION CALCULATOR</h2>
            </div>

            <div className="age-calc-card percent-card stddev-card">
                <p className="stddev-description-text">
                    Please provide numbers separated by commas to calculate the standard deviation, variance, mean, sum, and margin of error.
                </p>

                <form className="percent-each-form" onSubmit={(e) => { e.preventDefault(); calculate(); }}>
                    <div className="stddev-input-group">
                        <textarea
                            className="stddev-textarea"
                            value={numbers}
                            onChange={(e) => setNumbers(e.target.value)}
                            placeholder="Enter numbers separated by commas"
                            rows="4"
                        />
                    </div>

                    <div className="stddev-radio-group">
                        <label className="stddev-radio-label-text">It is a</label>
                        <div className="stddev-radio-options">
                            <label className="rng-radio-label">
                                <input
                                    type="radio"
                                    name="dataType"
                                    value="population"
                                    checked={dataType === "population"}
                                    onChange={(e) => setDataType(e.target.value)}
                                />
                                <span>Population</span>
                            </label>
                            <label className="rng-radio-label">
                                <input
                                    type="radio"
                                    name="dataType"
                                    value="sample"
                                    checked={dataType === "sample"}
                                    onChange={(e) => setDataType(e.target.value)}
                                />
                                <span>Sample</span>
                            </label>
                        </div>
                    </div>

                    {results && (
                        <div className="stddev-results">
                            <h3 className="stddev-results-title">Results:</h3>
                            <div className="stddev-results-grid">
                                <div className="stddev-result-item">
                                    <span className="result-label">Count:</span> {results.count}
                                </div>
                                <div className="stddev-result-item">
                                    <span className="result-label">Sum:</span> {results.sum}
                                </div>
                                <div className="stddev-result-item">
                                    <span className="result-label">Mean (μ):</span> {results.mean}
                                </div>
                                <div className="stddev-result-item">
                                    <span className="result-label">Variance:</span> {results.variance}
                                </div>
                                <div className="stddev-result-item">
                                    <span className="result-label">Std Deviation (σ):</span> {results.stdDev}
                                </div>
                                <div className="stddev-result-item">
                                    <span className="result-label">Margin of Error:</span> {results.marginOfError}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="percent-btn-row">
                        <button className="age-calc-btn percent-main-btn" type="button" onClick={calculate}>
                            Calculate
                        </button>
                        <button className="age-calc-btn percent-clear-btn" type="button" onClick={clear}>
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            {/* Description section */}
            <div className="age-content percent-description stddev-description-content">
                <p>
                    Standard deviation in statistics, typically denoted by <strong>σ</strong>, is a measure of variation or dispersion
                    (refers to a distribution's extent of stretching or squeezing) between values in a set of data. The lower the
                    standard deviation, the closer the data points tend to be to the mean (or expected value), <strong>μ</strong>.
                    Conversely, a higher standard deviation indicates a wider range of values. Similar to other mathematical and
                    statistical concepts, there are many different situations in which standard deviation can be used, and thus many
                    different equations. In addition to expressing population variability, the standard deviation is also often used
                    to measure statistical results such as the margin of error. When used in this manner, standard deviation is often
                    called the standard error of the mean, or standard error of the estimate with regard to a mean. The calculator
                    above computes population standard deviation and sample standard deviation, as well as{" "}
                    <span style={{ color: "#00cfff" }}>confidence interval</span> approximations.
                </p>
            </div>
        </div>
    );
}
