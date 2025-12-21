import React, { useState } from "react";
import "./GPACalculator.css";

const gradePoints = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0, '-': 0
};

export default function GPACalculator() {
  // GPA Calculator states
  const [courses, setCourses] = useState([
    { name: 'Math', credits: 3, grade: 'A' },
    { name: 'English', credits: 3, grade: 'B+' },
    { name: 'History', credits: 2, grade: 'A-' },
    { name: '', credits: '', grade: '-' },
    { name: '', credits: '', grade: '-' }
  ]);
  const [gpaResult, setGpaResult] = useState(null);

  // GPA Planning Calculator states
  const [currentGPA, setCurrentGPA] = useState('2.8');
  const [targetGPA, setTargetGPA] = useState('3');
  const [currentCredits, setCurrentCredits] = useState('25');
  const [additionalCredits, setAdditionalCredits] = useState('15');
  const [planResult, setPlanResult] = useState(null);

  function handleCourseChange(index, field, value) {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  }

  function addCourse() {
    setCourses([...courses, { name: '', credits: '', grade: '-' }]);
  }

  function calculateGPA(e) {
    e.preventDefault();
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      if (course.credits && course.grade && course.grade !== '-') {
        const credits = Number(course.credits);
        const points = gradePoints[course.grade];
        totalPoints += credits * points;
        totalCredits += credits;
      }
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    setGpaResult({ gpa, totalCredits, totalPoints });
  }

  function calculatePlanning(e) {
    e.preventDefault();
    const current = Number(currentGPA);
    const target = Number(targetGPA);
    const currentCr = Number(currentCredits);
    const additionalCr = Number(additionalCredits);
    
    const currentPoints = current * currentCr;
    const totalCreditsNeeded = currentCr + additionalCr;
    const totalPointsNeeded = target * totalCreditsNeeded;
    const additionalPointsNeeded = totalPointsNeeded - currentPoints;
    const requiredGPA = (additionalPointsNeeded / additionalCr).toFixed(2);
    
    setPlanResult({ requiredGPA, totalCreditsNeeded });
  }

  function clearGPA() {
    setCourses([
      { name: '', credits: '', grade: '-' },
      { name: '', credits: '', grade: '-' },
      { name: '', credits: '', grade: '-' }
    ]);
    setGpaResult(null);
  }

  return (
    <div className="gpa-calc-root">
      {/* GPA CALCULATOR */}
      <div className="gpa-calc-heading-wrapper">
        <h2 className="gpa-calc-heading">GPA Calculator</h2>
        <div className="gpa-calc-subheading">
          Use this calculator to calculate grade point average (GPA) and generate a GPA report. Modify the values and click the Calculate button to use
        </div>
      </div>
      <div className="gpa-calc-card">
        <div className="gpa-calc-info">Modify the values and click the Calculate button to use</div>
        <form onSubmit={calculateGPA} className="gpa-calc-form">
          <div className="gpa-table-header">
            <span className="gpa-col-course">Course (optional)</span>
            <span className="gpa-col-credits">Credits</span>
            <span className="gpa-col-grade">Grade</span>
          </div>
          {courses.map((course, index) => (
            <div key={index} className="gpa-course-row">
              <input
                type="text"
                value={course.name}
                onChange={e => handleCourseChange(index, 'name', e.target.value)}
                placeholder="Course name"
                className="gpa-input-course"
              />
              <input
                type="number"
                value={course.credits}
                onChange={e => handleCourseChange(index, 'credits', e.target.value)}
                min="0"
                step="0.5"
                className="gpa-input-credits"
              />
              <select
                value={course.grade}
                onChange={e => handleCourseChange(index, 'grade', e.target.value)}
                className="gpa-select-grade"
              >
                <option value="-">-</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="D-">D-</option>
                <option value="F">F</option>
              </select>
            </div>
          ))}
          <div className="gpa-add-course">
            <button type="button" onClick={addCourse} className="gpa-add-btn">+ add more courses</button>
          </div>
          <div className="gpa-btn-row">
            <button type="submit" className="gpa-calc-btn">Calculate</button>
            <button type="button" className="gpa-clear-btn" onClick={clearGPA}>Clear</button>
          </div>
        </form>
        {gpaResult && (
          <div className="gpa-result">
            <strong>GPA: {gpaResult.gpa}</strong> (Total Credits: {gpaResult.totalCredits}, Total Points: {gpaResult.totalPoints.toFixed(2)})
          </div>
        )}
      </div>

      {/* GPA PLANNING CALCULATOR */}
      <div className="gpa-calc-heading-wrapper">
        <h2 className="gpa-calc-heading1">GPA Planning Calculator</h2>
        <div className="gpa-calc-subheading">
          The calculator can be used to determine the minimum GPA required in future courses to raise GPA to a desired level or maintain the GPA above a certain level
        </div>
      </div>
      <div className="gpa-calc-card gpa-planning-card">
        <form onSubmit={calculatePlanning} className="gpa-planning-form">
          <div className="gpa-planning-row">
            <label className="gpa-planning-label">Current GPA</label>
            <input type="number" step="0.01" value={currentGPA} onChange={e => setCurrentGPA(e.target.value)} required className="gpa-planning-input"/>
          </div>
          <div className="gpa-planning-row">
            <label className="gpa-planning-label">Target GPA</label>
            <input type="number" step="0.01" value={targetGPA} onChange={e => setTargetGPA(e.target.value)} required className="gpa-planning-input"/>
          </div>
          <div className="gpa-planning-row">
            <label className="gpa-planning-label">Current Credit</label>
            <input type="number" step="0.5" value={currentCredits} onChange={e => setCurrentCredits(e.target.value)} required className="gpa-planning-input"/>
          </div>
          <div className="gpa-planning-row">
            <label className="gpa-planning-label">Additional Credit</label>
            <input type="number" step="0.5" value={additionalCredits} onChange={e => setAdditionalCredits(e.target.value)} required className="gpa-planning-input"/>
          </div>
          <div className="gpa-btn-row">
            <button type="submit" className="gpa-calc-btn">Calculate</button>
            <button type="button" className="gpa-clear-btn" onClick={() => setPlanResult(null)}>Clear</button>
          </div>
        </form>
        {planResult && (
          <div className="gpa-result">
            <strong>Required GPA in future courses: {planResult.requiredGPA}</strong> (Total credits needed: {planResult.totalCreditsNeeded})
          </div>
        )}
      </div>

      {/* EDUCATIONAL CONTENT */}
      <div className="gpa-content">
        <h2 className="gpa-content-heading">Letter grade and the numerical equivalents used for this calculator</h2>
        <p style={{textAlign: "justify"}}>Grade point average (GPA) is a commonly used indicator of an individual's academic achievement in school. It is the average of the grades attained in each course, taking course credit into consideration. Grading systems vary in different countries, or even schools. This calculator accepts letter grades as well as numerical inputs. These letter grades are translated into numerical values as shown below.</p>
        
        <div className="gpa-grade-list">
          <div>A+ = 4.3 grade points</div>
          <div>A = 4 grade points</div>
          <div>A- = 3.7 grade points</div>
          <div>B+ = 3.3 grade points</div>
          <div>B = 3 grade points</div>
          <div>B- = 2.7 grade points</div>
          <div>C+ = 2.3 grade points</div>
          <div>C = 2 grade points</div>
          <div>C- = 1.7 grade points</div>
          <div>D+ = 1.3 grade points</div>
          <div>D = 1 grade point</div>
          <div>D- = 0.7 grade points</div>
          <div>F = 0 grade points</div>
          <div>P (pass), NP (not pass), I (incomplete), W (withdrawal) will be ignored.</div>
        </div>

        <p style={{textAlign: "justify"}}>Most schools, colleges, and universities in the United States use a grading system based on the letters above, though E is sometimes used instead of F. Grading systems do differ however based on what constitutes an A or B, and some do not include grades such as an A+ or a B-. Others may attribute more weight to certain courses, and thus whatever grade is attained in the course will have a larger effect on overall GPA. The calculator can account for this based on the number of credits attributed to a course, where credit is the "weighting" of the course, as shown in the examples below.</p>

        <h3 className="gpa-subheading">Examples</h3>
        <table className="gpa-example-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Credit</th>
              <th>Score</th>
              <th>Grade Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Math</td>
              <td>4</td>
              <td>A+</td>
              <td>4 x 4.3 = 17.2</td>
            </tr>
            <tr>
              <td>Physics</td>
              <td>2</td>
              <td>B</td>
              <td>2 x 3 = 6</td>
            </tr>
            <tr>
              <td>English</td>
              <td>3</td>
              <td>A</td>
              <td>3 x 4 = 12</td>
            </tr>
            <tr className="gpa-total-row">
              <td><strong>Total</strong></td>
              <td><strong>9</strong></td>
              <td><strong>NA</strong></td>
              <td><strong>35.2</strong></td>
            </tr>
            <tr className="gpa-total-row">
              <td colSpan="4"><strong>GPA: 35.2 / 9 = 3.91</strong></td>
            </tr>
          </tbody>
        </table>

        <h3 className="gpa-subheading">Guidelines for raising GPA</h3>
        <p className="gpa-subheading1">There is no sure formula for raising a person's GPA, and strategies that work for one person may not work for another. However, there are some common guidelines and study habits that can be helpful when trying to raise GPA. The guidelines below are mostly anecdotal and are not intended as fail-safe ways to raise one's GPA, but are generally good habits that can have positive effects on learning, which may in turn increase GPA.</p>

        <h3 className="gpa-subheading">Actively attending classes:</h3>
        <p className="gpa-subheading1">Classes are being paid for likely either by a student or their parent, and not attending classes is both a financial loss, as well as a loss in potential education. While a student may decide that attending a particular class is not beneficial to their learning, or not a good use of their time, even if the professor is largely ineffective, there is usually valuable information that can be obtained simply by attending class. Not attending class for example, could result in negative effects on a student's GPA if for some reason the student misses information about a change in exam location or material.</p>

        <h3 className="gpa-subheading">Planning:</h3>
        <p className="gpa-subheading1">Every student has his or her own learning style. Some like to work for hours at a time to complete an assignment, while others may take many breaks. There is no ideal strategy, and how a person approaches learning is highly dependent on learning style, as well as adhering to a study strategy that complements their schedule and desires. The method that maximizes the value of the time spent is likely the most effective for improving learning, and subsequently, GPA.</p>
        <p className="gpa-subheading1">Organization of work that needs to be done, as well as notes taken is also important. It is as important to be able to find relevant information as it is to take notes in class. Notes are most valuable when they can be used to supplement learning. Professors present large amounts of information during the course of a lecture, not all of which a student may have time to process. It is important to practice taking notes in a manner that enables the student to look back and learn (or lookup) the information.
        Time management is also an important aspect of planning. There are only 24 hours in a day, not all of which a person can use effectively. While learning is important, taking more courses or activities than a person can handle can be detrimental both to learning, as well as to average GPA. Once all courses have been selected, budgeting and scheduling time for each course can help to put the amount of work and time necessary into perspective. While the amount of work necessary for a number of courses may initially seem daunting, planning how and when to approach the work for each course may help reduce stress and improve efficiency once the work is quantified (or could help a person realize that they are tackling more than they can handle).
        Reviewing work regularly, in terms of studying, is another aspect of time management. A substantial amount of information is covered in a course by the time of the final exam, and reviewing some of the information regularly over a period of time is often more effective than attempting to memorize all of the information right before an exam. Learning the information through periodic review can ultimately save a person more time, and potentially position them to perform better on an exam, and thereby improve GPA.</p>
      </div>
    </div>
  );
}
