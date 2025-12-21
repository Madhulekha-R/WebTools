import React, { useState } from "react";
import "./AgeCalculator.css"; // Change to separate CSS file

function getAgeDetails(birthDateStr, targetDateStr) {
  if (!birthDateStr || !targetDateStr) return null;
  const birth = new Date(birthDateStr);
  const target = new Date(targetDateStr);

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(target.getFullYear(), target.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = target - birth;
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffMs / (1000 * 60));
  const seconds = Math.floor(diffMs / 1000);

  return { years, months, days, weeks, hours, minutes, seconds };
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [ageDetails, setAgeDetails] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setAgeDetails(getAgeDetails(birthDate, targetDate));
  }

  return (
    <div className="age-calc-root">
      <div className="age-calc-heading-wrapper">
        <h2 className="age-calc-heading">Age Calculator</h2>
        <div className="age-calc-subheading">
          The Age Calculator can determine the age or interval between two dates. The calculated age will be displayed in years, months, weeks, days, hours, minutes, and seconds
        </div>
      </div>
      <div className={`age-calc-card ${ageDetails ? 'expanded' : ''}`}>
        <div className="age-calc-card-content">
          <div className="age-calc-icon">🎂</div>
          <form onSubmit={handleSubmit} className="age-calc-form">
            <div className="age-label">Date of Birth:</div>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              required
              className="age-input"
            />
            <div className="age-label">Age at the Date of:</div>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              required
              className="age-input"
            />
            <button type="submit" className="age-calc-btn">
              Calculate
            </button>
          </form>
          {ageDetails && (
            <div className="age-result">
              <div><span className="result-label">Result:</span></div>
              <div>Years: {ageDetails.years}</div>
              <div>Months: {ageDetails.months}</div>
              <div>Days: {ageDetails.days}</div>
              <div>Weeks: {ageDetails.weeks}</div>
              <div>Hours: {ageDetails.hours}</div>
              <div>Minutes: {ageDetails.minutes}</div>
              <div>Seconds: {ageDetails.seconds}</div>
            </div>
          )}
        </div>
      </div>
      <div className="age-content">
        The age of a person can be counted differently in different cultures. This calculator is based on the most common age system. In this system, age increases on a person's birthday. For example, the age of a person who has lived for 3 years and 11 months is 3, and their age will increase to 4 on their next birthday one month later. Most western countries use this age system.<br /><br />
        In some cultures, age is expressed by counting years with or without including the current year. For example, a person who is twenty years old is the same age as another person who is in their twenty-first year of life. In one of the traditional Chinese age systems, people are born at age 1 and their age increases up at the Traditional Chinese New Year rather than their birthday. For example, if one baby is born just one day before the Traditional Chinese New Year, 2 days later, the baby will be 2 even though he/she is only 2 days old.<br /><br />
        In some situations, the months and day result of this age calculator may be confusing, especially when the starting date is the end of a month. For example, we count Feb. 20 to Mar. 20 to be one month. However, there are two ways to calculate the age from Feb. 28, 2022 to Mar. 31, 2022. If we consider Feb. 28 to Mar. 28 to be one month, then the result is one month and 3 days. If we consider both Feb. 28 and Mar. 31 as the end of the month, then the result is one month. Both calculation results are reasonable. Similar situations exist for dates like Apr. 30 to May 31, May 30 to June 30, etc. The confusion comes from the uneven number of days in different months. In our calculations, we use the former method.
      </div>
    </div>
  );
}
