import React, { useState } from "react";
import "./GradeCalculator.css";

const gradeToPercentage = {
  'A+': 98.5, 'A': 94.5, 'A-': 91,
  'B+': 88, 'B': 84.5, 'B-': 81,
  'C+': 78, 'C': 74.5, 'C-': 71,
  'D+': 68, 'D': 64.5, 'D-': 61,
  'F': 30
};

const gradeToGPA = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0
};

function convertToPercentage(input) {
  if (gradeToPercentage[input]) return gradeToPercentage[input];
  const num = Number(input);
  return !isNaN(num) ? num : null;
}

export default function GradeCalculator() {
  // Grade Calculator states
  const [assignments, setAssignments] = useState([
    { name: 'Homework 1', grade: '90', weight: '5' },
    { name: 'Project', grade: 'B', weight: '20' },
    { name: 'Midterm exam', grade: '88', weight: '20' },
    { name: '', grade: '', weight: '' },
    { name: '', grade: '', weight: '' }
  ]);
  const [gradeResult, setGradeResult] = useState(null);
  const [finalGoal, setFinalGoal] = useState('');
  const [remainingWeight, setRemainingWeight] = useState('');
  const [planningResult, setPlanningResult] = useState(null);

  // Final Grade Calculator states
  const [currentGrade, setCurrentGrade] = useState('88');
  const [desiredGrade, setDesiredGrade] = useState('85');
  const [finalWeight, setFinalWeight] = useState('40');
  const [finalResult, setFinalResult] = useState(null);

  function handleAssignmentChange(index, field, value) {
    const newAssignments = [...assignments];
    newAssignments[index][field] = value;
    setAssignments(newAssignments);
  }

  function addAssignment() {
    setAssignments([...assignments, { name: '', grade: '', weight: '' }]);
  }

  function calculateGrade(e) {
    e.preventDefault();
    let totalWeightedGrade = 0;
    let totalWeight = 0;

    assignments.forEach(assignment => {
      if (assignment.grade && assignment.weight) {
        const gradePercent = convertToPercentage(assignment.grade);
        const weight = Number(assignment.weight);
        if (gradePercent !== null) {
          totalWeightedGrade += (gradePercent * weight) / 100;
          totalWeight += weight;
        }
      }
    });

    const finalGrade = totalWeight > 0 ? (totalWeightedGrade / totalWeight) * 100 : 0;
    setGradeResult({ grade: finalGrade.toFixed(2), totalWeight });
  }

  function calculatePlanning() {
    if (!finalGoal || !remainingWeight) return;
    
    let currentWeightedGrade = 0;
    let currentTotalWeight = 0;

    assignments.forEach(assignment => {
      if (assignment.grade && assignment.weight) {
        const gradePercent = convertToPercentage(assignment.grade);
        const weight = Number(assignment.weight);
        if (gradePercent !== null) {
          currentWeightedGrade += (gradePercent * weight) / 100;
          currentTotalWeight += weight;
        }
      }
    });

    const targetGrade = Number(finalGoal);
    const remWeight = Number(remainingWeight);
    const totalWeight = currentTotalWeight + remWeight;
    
    const requiredWeightedGrade = (targetGrade * totalWeight) / 100 - currentWeightedGrade;
    const requiredGrade = (requiredWeightedGrade / remWeight) * 100;
    
    setPlanningResult({ requiredGrade: requiredGrade.toFixed(2), totalWeight });
  }

  function calculateFinalGrade(e) {
    e.preventDefault();
    const current = Number(currentGrade);
    const desired = Number(desiredGrade);
    const finalW = Number(finalWeight);
    
    const currentWeight = 100 - finalW;
    const requiredFinal = ((desired * 100) - (current * currentWeight)) / finalW;
    
    setFinalResult(requiredFinal.toFixed(2));
  }

  function clearGrade() {
    setAssignments([
      { name: '', grade: '', weight: '' },
      { name: '', grade: '', weight: '' },
      { name: '', grade: '', weight: '' }
    ]);
    setGradeResult(null);
    setPlanningResult(null);
  }

  return (
    <div className="grade-calc-root">
      {/* GRADE CALCULATOR */}
      <div className="grade-calc-heading-wrapper">
        <h2 className="grade-calc-heading">Grade Calculator</h2>
        <div className="grade-calc-subheading">
          Use this calculator to find out the grade of a course based on weighted averages. This calculator accepts both numerical as well as letter grades. It also can calculate the grade needed for the remaining assignments in order to get a desired grade for an ongoing course
        </div>
      </div>
      <div className="grade-calc-card">
        <div className="grade-calc-info">Modify the values and click the Calculate button to use</div>
        <form onSubmit={calculateGrade} className="grade-calc-form">
          <div className="grade-table-header">
            <span className="grade-col-assignment">Assignment/Exam<br/>(optional)</span>
            <span className="grade-col-grade">Grade</span>
            <span className="grade-col-weight">Weight</span>
          </div>
          {assignments.map((assignment, index) => (
            <div key={index} className="grade-assignment-row">
              <input
                type="text"
                value={assignment.name}
                onChange={e => handleAssignmentChange(index, 'name', e.target.value)}
                placeholder="Assignment name"
                className="grade-input-assignment"
              />
              <input
                type="text"
                value={assignment.grade}
                onChange={e => handleAssignmentChange(index, 'grade', e.target.value)}
                placeholder="Grade"
                className="grade-input-grade"
              />
              <div className="grade-weight-input-wrapper">
                <input
                  type="number"
                  value={assignment.weight}
                  onChange={e => handleAssignmentChange(index, 'weight', e.target.value)}
                  min="0"
                  placeholder="0"
                  className="grade-input-weight"
                />
                <span className="grade-percent-symbol">%</span>
              </div>
            </div>
          ))}
          <div className="grade-add-assignment">
            <button type="button" onClick={addAssignment} className="grade-add-btn">+ add more rows</button>
          </div>

          {/* Final Grade Planning Section */}
          <div className="grade-planning-section">
            <div className="grade-planning-header">Final Grade Planning (Optional)</div>
            <div className="grade-planning-row">
              <label className="grade-planning-label">Final Grade Goal</label>
              <input
                type="number"
                value={finalGoal}
                onChange={e => setFinalGoal(e.target.value)}
                className="grade-planning-input"
              />
            </div>
            <div className="grade-planning-row">
              <label className="grade-planning-label">Weight of Remaining Tasks</label>
              <div className="grade-weight-input-wrapper">
                <input
                  type="number"
                  value={remainingWeight}
                  onChange={e => setRemainingWeight(e.target.value)}
                  className="grade-planning-input"
                />
                <span className="grade-percent-symbol">%</span>
              </div>
            </div>
          </div>

          <div className="grade-btn-row">
            <button type="submit" className="grade-calc-btn">Calculate</button>
            <button type="button" className="grade-clear-btn" onClick={clearGrade}>Clear</button>
          </div>
        </form>
        {gradeResult && (
          <div className="grade-result">
            <strong>Course Grade: {gradeResult.grade}%</strong> (Total Weight: {gradeResult.totalWeight}%)
            {planningResult && (
              <div style={{marginTop: '10px'}}>
                <strong>Required Grade for Remaining Assignments: {planningResult.requiredGrade}%</strong>
              </div>
            )}
          </div>
        )}
        {finalGoal && remainingWeight && (
          <button type="button" onClick={calculatePlanning} className="grade-calc-planning-btn">
            Calculate Planning
          </button>
        )}
      </div>

      {/* FINAL GRADE CALCULATOR */}
      <div className="grade-calc-heading-wrapper">
        <h2 className="grade-calc-heading1">Final Grade Calculator</h2>
        <div className="grade-calc-subheading">
          Use this calculator to find out the grade needed on the final exam in order to get a desired grade in a course. It accepts letter grades, percentage grades, and other numerical inputs
        </div>
      </div>
      <div className="grade-calc-card grade-final-card">
        <form onSubmit={calculateFinalGrade} className="grade-final-form">
          <div className="grade-final-row">
            <label className="grade-final-label">Your current grade:</label>
            <input
              type="text"
              value={currentGrade}
              onChange={e => setCurrentGrade(e.target.value)}
              required
              className="grade-final-input"
            />
          </div>
          <div className="grade-final-row">
            <label className="grade-final-label">The grade you want:</label>
            <input
              type="text"
              value={desiredGrade}
              onChange={e => setDesiredGrade(e.target.value)}
              required
              className="grade-final-input"
            />
          </div>
          <div className="grade-final-row">
            <label className="grade-final-label">Your final is worth:</label>
            <div className="grade-weight-input-wrapper">
              <input
                type="number"
                value={finalWeight}
                onChange={e => setFinalWeight(e.target.value)}
                required
                className="grade-final-input"
              />
              <span className="grade-percent-symbol">%</span>
            </div>
          </div>
          <div className="grade-btn-row">
            <button type="submit" className="grade-calc-btn">Calculate</button>
            <button type="button" className="grade-clear-btn" onClick={() => setFinalResult(null)}>Clear</button>
          </div>
        </form>
        {finalResult && (
          <div className="grade-result">
            <strong>Grade needed on final exam: {finalResult}%</strong>
          </div>
        )}
      </div>

      {/* EDUCATIONAL CONTENT */}
      <div className="grade-content">
        <p>The calculators above use the following letter grades and their typical corresponding numerical equivalents based on grade points</p>
        
        <table className="grade-conversion-table">
          <thead>
            <tr>
              <th>Letter Grade</th>
              <th>GPA</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>A+</td><td>4.3</td><td>97-100%</td></tr>
            <tr><td>A</td><td>4</td><td>93-96%</td></tr>
            <tr><td>A-</td><td>3.7</td><td>90-92%</td></tr>
            <tr><td>B+</td><td>3.3</td><td>87-89%</td></tr>
            <tr><td>B</td><td>3</td><td>83-86%</td></tr>
            <tr><td>B-</td><td>2.7</td><td>80-82%</td></tr>
            <tr><td>C+</td><td>2.3</td><td>77-79%</td></tr>
            <tr><td>C</td><td>2</td><td>73-76%</td></tr>
            <tr><td>C-</td><td>1.7</td><td>70-72%</td></tr>
            <tr><td>D+</td><td>1.3</td><td>67-69%</td></tr>
            <tr><td>D</td><td>1</td><td>63-66%</td></tr>
            <tr><td>D-</td><td>0.7</td><td>60-62%</td></tr>
            <tr><td>F</td><td>0</td><td>0-59%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
