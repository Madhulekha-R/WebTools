import React, { useState } from "react";
import "./PaceCalculator.css";

// Helper functions
function parseTime(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatPace(secondsPerUnit) {
    const minutes = Math.floor(secondsPerUnit / 60);
    const seconds = Math.round(secondsPerUnit % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function PaceCalculator() {
    // Basic Pace Calculator - Tab state
    const [activeTab, setActiveTab] = useState('pace');

    // Pace tab
    const [paceTime, setPaceTime] = useState('00:50:25');
    const [paceDistance, setPaceDistance] = useState('5');
    const [paceUnit, setPaceUnit] = useState('Kilometers');
    const [paceEvent, setPaceEvent] = useState('');
    const [paceResult, setPaceResult] = useState('');

    // Time tab
    const [timePace, setTimePace] = useState('');
    const [timeDistance, setTimeDistance] = useState('');
    const [timeUnit, setTimeUnit] = useState('Kilometers');
    const [timeResult, setTimeResult] = useState('');

    // Distance tab
    const [distTime, setDistTime] = useState('');
    const [distPace, setDistPace] = useState('');
    const [distUnit, setDistUnit] = useState('Kilometers');
    const [distResult, setDistResult] = useState('');

    // Multipoint Pace Calculator
    const [segments, setSegments] = useState(Array(12).fill().map(() => ({ distance: '', unit: 'Kilometers', time: '' })));
    const [preferredPaceUnit, setPreferredPaceUnit] = useState('Per Mile');
    const [multipointResult, setMultipointResult] = useState(null);

    // Pace Converter
    const [convertPace, setConvertPace] = useState('5:30');
    const [convertFrom, setConvertFrom] = useState('Per Mile');
    const [convertResult, setConvertResult] = useState('');

    // Finish Time Calculator
    const [currentDistance, setCurrentDistance] = useState('1');
    const [currentUnit, setCurrentUnit] = useState('Kilometers');
    const [elapsedTime, setElapsedTime] = useState('6:15');
    const [fullDistance, setFullDistance] = useState('5');
    const [fullUnit, setFullUnit] = useState('Kilometers');
    const [finishResult, setFinishResult] = useState('');

    // Event presets
    const events = {
        '5K': { distance: 5, unit: 'Kilometers' },
        '10K': { distance: 10, unit: 'Kilometers' },
        'Half Marathon': { distance: 21.0975, unit: 'Kilometers' },
        'Marathon': { distance: 42.195, unit: 'Kilometers' },
        '1 Mile': { distance: 1, unit: 'Miles' },
        '5 Miles': { distance: 5, unit: 'Miles' }
    };

    // Basic Pace Calculator - Calculate Pace
    function calculatePace() {
        const totalSeconds = parseTime(paceTime);
        const dist = parseFloat(paceDistance);

        if (!dist || totalSeconds === 0) return;

        const paceSeconds = totalSeconds / dist;
        setPaceResult(formatPace(paceSeconds));
    }

    function clearPace() {
        setPaceTime('00:50:25');
        setPaceDistance('5');
        setPaceUnit('Kilometers');
        setPaceEvent('');
        setPaceResult('');
    }

    // Time Calculator
    function calculateTimeFromPace() {
        const paceSeconds = parseTime(timePace);
        const dist = parseFloat(timeDistance);

        if (!dist || paceSeconds === 0) return;

        const totalSeconds = paceSeconds * dist;
        setTimeResult(formatTime(totalSeconds));
    }

    function clearTime() {
        setTimePace('');
        setTimeDistance('');
        setTimeUnit('Kilometers');
        setTimeResult('');
    }

    // Distance Calculator
    function calculateDistanceFromPace() {
        const totalSeconds = parseTime(distTime);
        const paceSeconds = parseTime(distPace);

        if (paceSeconds === 0 || totalSeconds === 0) return;

        const distance = totalSeconds / paceSeconds;
        setDistResult(distance.toFixed(2));
    }

    function clearDistance() {
        setDistTime('');
        setDistPace('');
        setDistUnit('Kilometers');
        setDistResult('');
    }

    // Multipoint Pace Calculator
    function calculateMultipoint() {
        const validSegments = segments.filter(s => s.distance && s.time);
        if (validSegments.length === 0) return;

        let totalDistance = 0;
        let totalSeconds = 0;

        validSegments.forEach(seg => {
            let dist = parseFloat(seg.distance);
            if (seg.unit === 'Miles' && preferredPaceUnit === 'Per Kilometer') {
                dist *= 1.60934;
            } else if (seg.unit === 'Kilometers' && preferredPaceUnit === 'Per Mile') {
                dist /= 1.60934;
            }
            totalDistance += dist;
            totalSeconds += parseTime(seg.time);
        });

        if (totalDistance === 0) return;

        const avgPace = totalSeconds / totalDistance;
        setMultipointResult(formatPace(avgPace));
    }

    function clearMultipoint() {
        setSegments(Array(12).fill().map(() => ({ distance: '', unit: 'Kilometers', time: '' })));
        setPreferredPaceUnit('Per Mile');
        setMultipointResult(null);
    }

    function updateSegment(index, field, value) {
        const newSegments = [...segments];
        newSegments[index][field] = value;
        setSegments(newSegments);
    }

    // Pace Converter
    function convertPaceUnits() {
        const paceSeconds = parseTime(convertPace);
        if (paceSeconds === 0) return;

        let convertedPace;
        if (convertFrom === 'Per Mile') {
            convertedPace = paceSeconds / 1.60934; // Mile to Kilometer
        } else {
            convertedPace = paceSeconds * 1.60934; // Kilometer to Mile
        }

        setConvertResult(formatPace(convertedPace));
    }

    function clearConverter() {
        setConvertPace('5:30');
        setConvertFrom('Per Mile');
        setConvertResult('');
    }

    // Finish Time Calculator
    function calculateFinishTime() {
        const currDist = parseFloat(currentDistance);
        const fullDist = parseFloat(fullDistance);
        const elapsed = parseTime(elapsedTime);

        if (!currDist || !fullDist || elapsed === 0) return;

        // Convert to same units if needed
        let currDistConverted = currDist;
        if (currentUnit !== fullUnit) {
            if (currentUnit === 'Miles') {
                currDistConverted *= 1.60934;
            } else {
                currDistConverted /= 1.60934;
            }
        }

        const pace = elapsed / currDistConverted;
        const estimatedTotal = pace * fullDist;

        setFinishResult(formatTime(estimatedTotal));
    }

    function clearFinishTime() {
        setCurrentDistance('1');
        setCurrentUnit('Kilometers');
        setElapsedTime('6:15');
        setFullDistance('5');
        setFullUnit('Kilometers');
        setFinishResult('');
    }

    // Handle event selection
    function handleEventSelect(e) {
        const eventName = e.target.value;
        setPaceEvent(eventName);
        if (eventName && events[eventName]) {
            setPaceDistance(events[eventName].distance.toString());
            setPaceUnit(events[eventName].unit);
        }
    }

    return (
        <div className="age-calc-root percent-bg">
            <div className="age-calc-heading-wrapper">
                <h2 className="age-calc-heading">PACE CALCULATOR</h2>
            </div>

            <div className="pace-intro">
                Use the following calculator to estimate the pace for a variety of activities, including running, walking,
                and biking. The calculator can also be used to estimate the time taken or distance traveled with a
                given pace and time or distance
            </div>

            {/* Basic Pace Calculator with Tabs */}
            <div className="age-calc-card percent-card">
                <div className="pace-tabs">
                    <button
                        className={`pace-tab ${activeTab === 'pace' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pace')}
                    >
                        Pace
                    </button>
                    <button
                        className={`pace-tab ${activeTab === 'time' ? 'active' : ''}`}
                        onClick={() => setActiveTab('time')}
                    >
                        Time
                    </button>
                    <button
                        className={`pace-tab ${activeTab === 'distance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('distance')}
                    >
                        Distance
                    </button>
                </div>

                {activeTab === 'pace' && (
                    <div className="pace-tab-content">
                        <div className="pace-row">
                            <label className="pace-label">Time</label>
                            <input
                                className="age-input percent-input pace-input"
                                value={paceTime}
                                onChange={e => setPaceTime(e.target.value)}
                                placeholder="hh:mm:ss"
                            />
                            <span className="pace-hint">hh:mm:ss</span>
                        </div>
                        <div className="pace-row">
                            <label className="pace-label">Distance</label>
                            <input
                                className="age-input percent-input pace-input"
                                type="number"
                                value={paceDistance}
                                onChange={e => setPaceDistance(e.target.value)}
                            />
                            <select
                                className="pace-select"
                                value={paceUnit}
                                onChange={e => setPaceUnit(e.target.value)}
                            >
                                <option>Kilometers</option>
                                <option>Miles</option>
                            </select>
                            <select
                                className="pace-select pace-event-select"
                                value={paceEvent}
                                onChange={handleEventSelect}
                            >
                                <option value="">-- Or pick an event --</option>
                                {Object.keys(events).map(event => (
                                    <option key={event} value={event}>{event}</option>
                                ))}
                            </select>
                        </div>
                        <div className="percent-btn-row">
                            <button className="age-calc-btn percent-main-btn" onClick={calculatePace}>Calculate</button>
                            <button className="age-calc-btn percent-clear-btn" onClick={clearPace}>Clear</button>
                        </div>
                        {paceResult && (
                            <div className="pace-result">
                                <span className="result-label">Pace:</span> {paceResult} per {paceUnit === 'Kilometers' ? 'km' : 'mile'}
                            </div>
                        )}
                        <div className="pace-note">
                            Note that placeholder zeros do not need to be entered in the "Time" or "Pace" field. For example, the time 5 minutes 3
                            seconds does not need to be entered as 00:05:03, and can be entered as 5:3
                        </div>
                    </div>
                )}

                {activeTab === 'time' && (
                    <div className="pace-tab-content">
                        <div className="pace-row">
                            <label className="pace-label">Pace</label>
                            <input
                                className="age-input percent-input pace-input"
                                value={timePace}
                                onChange={e => setTimePace(e.target.value)}
                                placeholder="mm:ss"
                            />
                            <span className="pace-hint">mm:ss per {timeUnit === 'Kilometers' ? 'km' : 'mile'}</span>
                        </div>
                        <div className="pace-row">
                            <label className="pace-label">Distance</label>
                            <input
                                className="age-input percent-input pace-input"
                                type="number"
                                value={timeDistance}
                                onChange={e => setTimeDistance(e.target.value)}
                            />
                            <select
                                className="pace-select"
                                value={timeUnit}
                                onChange={e => setTimeUnit(e.target.value)}
                            >
                                <option>Kilometers</option>
                                <option>Miles</option>
                            </select>
                        </div>
                        <div className="percent-btn-row">
                            <button className="age-calc-btn percent-main-btn" onClick={calculateTimeFromPace}>Calculate</button>
                            <button className="age-calc-btn percent-clear-btn" onClick={clearTime}>Clear</button>
                        </div>
                        {timeResult && (
                            <div className="pace-result">
                                <span className="result-label">Time:</span> {timeResult}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'distance' && (
                    <div className="pace-tab-content">
                        <div className="pace-row">
                            <label className="pace-label">Time</label>
                            <input
                                className="age-input percent-input pace-input"
                                value={distTime}
                                onChange={e => setDistTime(e.target.value)}
                                placeholder="hh:mm:ss"
                            />
                            <span className="pace-hint">hh:mm:ss</span>
                        </div>
                        <div className="pace-row">
                            <label className="pace-label">Pace</label>
                            <input
                                className="age-input percent-input pace-input"
                                value={distPace}
                                onChange={e => setDistPace(e.target.value)}
                                placeholder="mm:ss"
                            />
                            <span className="pace-hint">mm:ss per {distUnit === 'Kilometers' ? 'km' : 'mile'}</span>
                        </div>
                        <div className="pace-row">
                            <label className="pace-label">Unit</label>
                            <select
                                className="pace-select"
                                value={distUnit}
                                onChange={e => setDistUnit(e.target.value)}
                            >
                                <option>Kilometers</option>
                                <option>Miles</option>
                            </select>
                        </div>
                        <div className="percent-btn-row">
                            <button className="age-calc-btn percent-main-btn" onClick={calculateDistanceFromPace}>Calculate</button>
                            <button className="age-calc-btn percent-clear-btn" onClick={clearDistance}>Clear</button>
                        </div>
                        {distResult && (
                            <div className="pace-result">
                                <span className="result-label">Distance:</span> {distResult} {distUnit === 'Kilometers' ? 'km' : 'miles'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Multipoint Pace Calculator */}
            <h2 className="age-calc-heading percent-section-title">MULTIPOINT PACE CALCULATOR</h2>
            <div className="multipoint-intro">
                The following calculator can determine the pace of segments of a run (or other activity) for those with
                access to the time at intermittent points during the run
            </div>

            <div className="age-calc-card percent-card">
                <div className="multipoint-table">
                    <div className="multipoint-header">
                        <div className="multipoint-col-num"></div>
                        <div className="multipoint-col-label">Distance</div>
                        <div className="multipoint-col-label">Time (hh:mm:ss)</div>
                    </div>
                    {segments.map((seg, idx) => (
                        <div key={idx} className="multipoint-row">
                            <div className="multipoint-num">{idx + 1}.</div>
                            <div className="multipoint-inputs">
                                <input
                                    className="age-input percent-input multipoint-input"
                                    type="number"
                                    value={seg.distance}
                                    onChange={e => updateSegment(idx, 'distance', e.target.value)}
                                    placeholder={idx < 5 ? (idx + 1).toString() : ''}
                                />
                                <select
                                    className="pace-select multipoint-select"
                                    value={seg.unit}
                                    onChange={e => updateSegment(idx, 'unit', e.target.value)}
                                >
                                    <option>Kilometers</option>
                                    <option>Miles</option>
                                </select>
                            </div>
                            <input
                                className="age-input percent-input multipoint-input"
                                value={seg.time}
                                onChange={e => updateSegment(idx, 'time', e.target.value)}
                                placeholder={idx < 5 ? `${idx * 3 + 3}:${25 + idx * 30}` : ''}
                            />
                        </div>
                    ))}
                    <div className="multipoint-footer">
                        <label className="pace-label">Your Preferred Pace Unit</label>
                        <select
                            className="pace-select"
                            value={preferredPaceUnit}
                            onChange={e => setPreferredPaceUnit(e.target.value)}
                        >
                            <option>Per Mile</option>
                            <option>Per Kilometer</option>
                        </select>
                    </div>
                </div>
                <div className="percent-btn-row">
                    <button className="age-calc-btn percent-main-btn" onClick={calculateMultipoint}>Calculate</button>
                    <button className="age-calc-btn percent-clear-btn" onClick={clearMultipoint}>Clear</button>
                </div>
                {multipointResult && (
                    <div className="pace-result">
                        <span className="result-label">Average Pace:</span> {multipointResult} {preferredPaceUnit === 'Per Mile' ? 'per mile' : 'per km'}
                    </div>
                )}
            </div>

            {/* Pace Converter */}
            <h2 className="age-calc-heading percent-section-title">PACE CONVERTER</h2>
            <div className="age-calc-card percent-card">
                <div className="converter-row">
                    <input
                        className="age-input percent-input pace-input"
                        value={convertPace}
                        onChange={e => setConvertPace(e.target.value)}
                        placeholder="5:30"
                    />
                    <select
                        className="pace-select"
                        value={convertFrom}
                        onChange={e => setConvertFrom(e.target.value)}
                    >
                        <option>Per Mile</option>
                        <option>Per Kilometer</option>
                    </select>
                    <span className="pace-eq">=</span>
                    <input
                        className="age-input percent-input pace-input"
                        readOnly
                        value={convertResult}
                        placeholder="?"
                    />
                    <select
                        className="pace-select"
                        value={convertFrom === 'Per Mile' ? 'Per Kilometer' : 'Per Mile'}
                        disabled
                    >
                        <option>Per Kilometer</option>
                        <option>Per Mile</option>
                    </select>
                </div>
                <div className="pace-hint" style={{ textAlign: 'center', marginTop: 8 }}>hh:mm:ss</div>
                <div className="percent-btn-row">
                    <button className="age-calc-btn percent-main-btn" onClick={convertPaceUnits}>Calculate</button>
                    <button className="age-calc-btn percent-clear-btn" onClick={clearConverter}>Clear</button>
                </div>
            </div>

            {/* Finish Time Calculator */}
            <h2 className="age-calc-heading percent-section-title">FINISH TIME CALCULATOR</h2>
            <div className="finish-intro">
                The following calculator can be used to estimate a person's finish time based on the time and distance
                covered in a race at the point the calculator is used.
            </div>

            <div className="age-calc-card percent-card">
                <div className="pace-row">
                    <label className="pace-label">Current Distance Traveled</label>
                    <input
                        className="age-input percent-input pace-input"
                        type="number"
                        value={currentDistance}
                        onChange={e => setCurrentDistance(e.target.value)}
                    />
                    <select
                        className="pace-select"
                        value={currentUnit}
                        onChange={e => setCurrentUnit(e.target.value)}
                    >
                        <option>Kilometers</option>
                        <option>Miles</option>
                    </select>
                </div>
                <div className="pace-row">
                    <label className="pace-label">Elapsed Time</label>
                    <input
                        className="age-input percent-input pace-input"
                        value={elapsedTime}
                        onChange={e => setElapsedTime(e.target.value)}
                        placeholder="hh:mm:ss"
                    />
                    <span className="pace-hint">hh:mm:ss</span>
                </div>
                <div className="pace-row">
                    <label className="pace-label">Full Distance</label>
                    <input
                        className="age-input percent-input pace-input"
                        type="number"
                        value={fullDistance}
                        onChange={e => setFullDistance(e.target.value)}
                    />
                    <select
                        className="pace-select"
                        value={fullUnit}
                        onChange={e => setFullUnit(e.target.value)}
                    >
                        <option>Kilometers</option>
                        <option>Miles</option>
                    </select>
                </div>
                <div className="percent-btn-row">
                    <button className="age-calc-btn percent-main-btn" onClick={calculateFinishTime}>Calculate</button>
                    <button className="age-calc-btn percent-clear-btn" onClick={clearFinishTime}>Clear</button>
                </div>
                {finishResult && (
                    <div className="pace-result">
                        <span className="result-label">Estimated Finish Time:</span> {finishResult}
                    </div>
                )}
            </div>

            {/* Educational Content */}
            <div className="age-content percent-description" style={{ maxWidth: 1000, marginBottom: '40px' }}>
                <h2>Typical Races and World Record Paces</h2>
                <table className="pace-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Men's World Record Pace</th>
                            <th>Women's World Record Pace</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>100 meters</td><td>2:35/mile or 1:36/km</td><td>2:49/mile or 1:45/km</td></tr>
                        <tr><td>200 meters</td><td>2:35/mile or 1:36/km</td><td>2:52/mile or 1:47/km</td></tr>
                        <tr><td>400 meters</td><td>2:54/mile or 1:48/km</td><td>3:12/mile or 1:59/km</td></tr>
                        <tr><td>800 meters</td><td>3:23/mile or 2:06/km</td><td>3:48/mile or 2:21/km</td></tr>
                        <tr><td>1,500 meters</td><td>3:41/mile or 2:17/km</td><td>4:07/mile or 2:34/km</td></tr>
                        <tr><td>1 mile</td><td>3:43/mile or 2:19/km</td><td>4:13/mile or 2:37/km</td></tr>
                        <tr><td>5K</td><td>4:04/mile or 2:31/km</td><td>4:34/mile or 2:50/km</td></tr>
                        <tr><td>10K</td><td>4:14/mile or 2:38/km</td><td>4:45/mile or 2:57/km</td></tr>
                        <tr><td>Half Marathon<br />(13.11 miles / 21.098 km)</td><td>4:27/mile or 2:46/km</td><td>4:58/mile or 3:05/km</td></tr>
                        <tr><td>Marathon<br />(26.22 miles / 42.195 km)</td><td>4:41/mile or 2:55/km</td><td>5:10/mile or 3:13/km</td></tr>
                    </tbody>
                </table>

                <h2>Training Through Pace and Heart Rate</h2>
                <p>
                    Pace is a rate of activity or movement, while heart rate is measured as the number of times that a
                    person's heart contracts over a minute. Pace and heart rate have a positive correlation; higher pace
                    corresponds to higher heart rate. The use of both in training can help a person improve performance,
                    avoid over-training, as well as track progress and fitness over time.
                </p>

                <h2>Measuring and Estimating Heart Rate and Heart Rate Zones:</h2>
                <p>
                    Heart rate can be measured in different ways, from using devices such as heart rate monitors, to
                    simply looking at a watch while measuring pulse at some peripheral point such as the wrist or neck.
                    Some of the more notable measurements of heart rate include resting heart rate and maximum heart
                    rate, which are often used to estimate specific target heart rate zones to determine different levels of
                    exercise.
                </p>
            </div>
        </div>
    );
}

