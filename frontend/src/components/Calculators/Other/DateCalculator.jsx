import React, { useState } from "react";
import "./DateCalculator.css"; // Change this from CalculatorDashboard.css

function getDaysBetweenDetails(startDateStr, endDateStr, includeEnd = false) {
  if (!startDateStr || !endDateStr) return null;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  let adjustedEnd = new Date(end);
  if (includeEnd) {
    adjustedEnd.setDate(adjustedEnd.getDate() + 1);
  }
  let years = adjustedEnd.getFullYear() - start.getFullYear();
  let months = adjustedEnd.getMonth() - start.getMonth();
  let days = adjustedEnd.getDate() - start.getDate();

  if (days < 0) {
    months--;
    days += new Date(adjustedEnd.getFullYear(), adjustedEnd.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const diffMs = adjustedEnd - start;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);

  return { years, months, weeks, days, totalDays };
}

function addOrSubtract(dateStr, years, months, weeks, days, sign) {
  if (!dateStr) return null;
  let date = new Date(dateStr);
  date.setFullYear(date.getFullYear() + sign * Number(years));
  date.setMonth(date.getMonth() + sign * Number(months));
  date.setDate(date.getDate() + sign * (Number(days) + 7 * Number(weeks)));
  let yyyy = date.getFullYear();
  let mm = (date.getMonth() + 1).toString().padStart(2, "0");
  let dd = date.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function DateDashboardCalculators() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);
  const [daysResult, setDaysResult] = useState(null);

  const [date, setDate] = useState("");
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);
  const [isAdd, setIsAdd] = useState(true);
  const [addSubResult, setAddSubResult] = useState(null);

  function handleDaysBetweenSubmit(e) {
    e.preventDefault();
    setDaysResult(getDaysBetweenDetails(startDate, endDate, includeEnd));
  }

  function handleAddSubtractSubmit(e) {
    e.preventDefault();
    setAddSubResult(addOrSubtract(date, years, months, weeks, days, isAdd ? 1 : -1));
  }

  return (
    <div className="date-calc-root">
      <h3 className="date-calc-main-heading">Date Calculator</h3>
      
      {/* DAYS BETWEEN TWO DATES */}
      <div className="date-calc-heading-wrapper">
        <p className="date-calc-section-title">Days Between Two Dates</p>
        <div className="date-calc-subheading">
          Find the number of years, months, weeks, and days between dates
        </div>
      </div>
      <div className={`date-calc-card ${daysResult ? 'expanded' : ''}`}>
        <div className="date-calc-card-content">
          <form onSubmit={handleDaysBetweenSubmit} className="date-calc-form">
            <div className="date-label">Start Date</div>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="date-input"/>
            
            <div className="date-label">End Date</div>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="date-input"/>
            
            <div className="date-checkbox-wrapper">
              <input type="checkbox" checked={includeEnd} onChange={e => setIncludeEnd(e.target.checked)} id="includeEnd" className="date-checkbox"/>
              <label htmlFor="includeEnd" className="date-checkbox-label">include end day (add 1 day)</label>
            </div>
            
            <button type="submit" className="date-calc-btn">Calculate</button>
          </form>
          
          {daysResult && (
            <div className="date-result">
              <div><span className="result-label">Result:</span></div>
              <div>Total Days: {daysResult.totalDays}</div>
              <div>Years: {daysResult.years}</div>
              <div>Months: {daysResult.months}</div>
              <div>Weeks: {daysResult.weeks}</div>
              <div>Days: {daysResult.days}</div>
            </div>
          )}
        </div>
      </div>

      {/* ADD TO OR SUBTRACT FROM A DATE */}
      <div className="date-calc-heading-wrapper">
        <h3 className="date-calc-section-title">Add to or Subtract from a Date</h3>
        <div className="date-calc-subheading">
          Enter a start date, select + or –, and specify years, months, weeks, and days to add or subtract
        </div>
      </div>
      <div className={`date-calc-card date-calc-card-compact ${addSubResult ? 'expanded' : ''}`}>
        <div className="date-calc-card-content">
          <form onSubmit={handleAddSubtractSubmit} className="date-calc-form">
            <div className="date-label">Start Date</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="date-input"/>
            
            <div className="date-operation-btns">
              <button type="button" onClick={() => setIsAdd(true)} className={`date-op-btn ${isAdd ? 'active' : ''}`}>+</button>
              <button type="button" onClick={() => setIsAdd(false)} className={`date-op-btn ${!isAdd ? 'active' : ''}`}>-</button>
            </div>
            
            <div className="date-grid-inputs">
              <input type="number" value={years} min="0" onChange={e => setYears(e.target.value)} className="date-number-input"/>
              <span className="date-input-label">years</span>
              
              <input type="number" value={months} min="0" onChange={e => setMonths(e.target.value)} className="date-number-input"/>
              <span className="date-input-label">months</span>
              
              <input type="number" value={weeks} min="0" onChange={e => setWeeks(e.target.value)} className="date-number-input"/>
              <span className="date-input-label">weeks</span>
              
              <input type="number" value={days} min="0" onChange={e => setDays(e.target.value)} className="date-number-input"/>
              <span className="date-input-label">days</span>
            </div>
            
            <button type="submit" className="date-calc-btn">Calculate</button>
          </form>
          
          {addSubResult && (
            <div className="date-result">
              <span className="result-label">Result Date: </span>
              <span>{addSubResult}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
