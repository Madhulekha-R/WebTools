import React, { useState } from "react";
import "./HoursCalculator.css";

// Helper to calculate hours and minutes between two times
function calculateHoursBetweenTimes(startTime, startPeriod, endTime, endPeriod) {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let start24 = startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : startHour;
  if (startPeriod === 'AM' && startHour === 12) start24 = 0;
  
  let end24 = endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : endHour;
  if (endPeriod === 'AM' && endHour === 12) end24 = 0;
  
  let totalMinutes = (end24 * 60 + endMin) - (start24 * 60 + startMin);
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes };
}

// Helper to calculate hours between two dates with times
function calculateHoursBetweenDates(startDate, startTime, startPeriod, endDate, endTime, endPeriod) {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let start24 = startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : startHour;
  if (startPeriod === 'AM' && startHour === 12) start24 = 0;
  
  let end24 = endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : endHour;
  if (endPeriod === 'AM' && endHour === 12) end24 = 0;
  
  const startDateTime = new Date(startDate);
  startDateTime.setHours(start24, startMin, 0, 0);
  
  const endDateTime = new Date(endDate);
  endDateTime.setHours(end24, endMin, 0, 0);
  
  const diffMs = endDateTime - startDateTime;
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes };
}

export default function HoursCalculator() {
  // Hours Calculator states
  const [startTime, setStartTime] = useState("8:30");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endTime, setEndTime] = useState("5:30");
  const [endPeriod, setEndPeriod] = useState("PM");
  const [hoursResult, setHoursResult] = useState(null);

  // Hours Between Two Dates states
  const [startDate, setStartDate] = useState("");
  const [startDateTime, setStartDateTime] = useState("8:30");
  const [startDatePeriod, setStartDatePeriod] = useState("AM");
  const [endDate, setEndDate] = useState("");
  const [endDateTime, setEndDateTime] = useState("5:30");
  const [endDatePeriod, setEndDatePeriod] = useState("PM");
  const [dateHoursResult, setDateHoursResult] = useState(null);

  function handleHoursCalculation(e) {
    e.preventDefault();
    setHoursResult(calculateHoursBetweenTimes(startTime, startPeriod, endTime, endPeriod));
  }

  function handleDateHoursCalculation(e) {
    e.preventDefault();
    setDateHoursResult(calculateHoursBetweenDates(startDate, startDateTime, startDatePeriod, endDate, endDateTime, endDatePeriod));
  }

  return (
    <div className="hours-calc-root">
      {/* HOURS CALCULATOR */}
      <div className="hours-calc-heading-wrapper">
        <h2 className="hours-calc-heading">Hours Calculator</h2>
        <div className="hours-calc-subheading">
          Use the calculators below to find the number of hours and minutes between two times
        </div>
      </div>
      <div className="hours-calc-card">
        <div className="hours-calc-info">Modify the values and click the Calculate button to use</div>
        <form onSubmit={handleHoursCalculation} className="hours-calc-form">
          <div className="hours-time-row">
            <label className="hours-label">Start Time:</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="hours-time-input"/>
            <select value={startPeriod} onChange={e => setStartPeriod(e.target.value)} className="hours-period-select">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div className="hours-time-row">
            <label className="hours-label">End Time:</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="hours-time-input"/>
            <select value={endPeriod} onChange={e => setEndPeriod(e.target.value)} className="hours-period-select">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div className="hours-btn-row">
            <button type="submit" className="hours-calc-btn">Calculate</button>
            <button type="button" className="hours-clear-btn" onClick={() => setHoursResult(null)}>Clear</button>
          </div>
        </form>
        {hoursResult && (
          <div className="hours-result">
            Result: {hoursResult.hours} hours and {hoursResult.minutes} minutes
          </div>
        )}
      </div>

      {/* HOURS BETWEEN TWO DATES */}
      <div className="hours-calc-heading-wrapper">
        <h2 className="hours-calc-heading1">Hours Between Two Dates</h2>
      </div>
      <div className="hours-calc-card">
        <form onSubmit={handleDateHoursCalculation} className="hours-calc-form">
          <div className="hours-date-row">
            <label className="hours-label">Start Time:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="hours-date-input"/>
            <input type="time" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} className="hours-time-input-sm"/>
            <select value={startDatePeriod} onChange={e => setStartDatePeriod(e.target.value)} className="hours-period-select">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div className="hours-date-row">
            <label className="hours-label">End Time:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="hours-date-input"/>
            <input type="time" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} className="hours-time-input-sm"/>
            <select value={endDatePeriod} onChange={e => setEndDatePeriod(e.target.value)} className="hours-period-select">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div className="hours-btn-row">
            <button type="submit" className="hours-calc-btn">Calculate</button>
            <button type="button" className="hours-clear-btn" onClick={() => setDateHoursResult(null)}>Clear</button>
          </div>
        </form>
        {dateHoursResult && (
          <div className="hours-result">
            Result: {dateHoursResult.hours} hours and {dateHoursResult.minutes} minutes
          </div>
        )}
      </div>

      {/* EDUCATIONAL CONTENT */}
      <div className="hours-content">
        <p style={{textAlign: "justify"}}>An hour is most commonly defined as a period of time equal to 60 minutes, where a minute is equal to 60 seconds, and a second has a rigorous scientific definition. There are also 24 hours in a day. Most people read time using either a 12-hour clock or a 24-hour clock.</p>
        
        <h3 className="hours-subheading">12-hour clock:</h3>
        <p style={{textAlign: "justify"}}>A 12-hour clock uses the numbers 1-12. Depending on the clock being used, most analog clocks or watches may not include an indication of whether the time is in the morning or evening. On digital clocks and watches, "AM" stands for ante meridiem, meaning "before midday," while "PM" stands for post meridiem, or "after noon." By convention, 12 AM denotes midnight, while 12 PM denotes noon. Using the terms "12 midnight" and "12 noon" can remove ambiguity in cases where a person may not be accustomed to conventions.</p>
        
        <h3 className="hours-subheading">24-hour clock:</h3>
        <p style={{textAlign: "justify"}}>A 24-hour clock typically uses the numbers 0-23, where 00:00 indicates midnight, and a day runs from midnight to midnight over the course of 24 hours. This time format is an international standard, and is often used to avoid the ambiguity resulting from the use of a 12-hour clock. The hours from 0-11 denote what would be the AM hours on a 12-hour clock, while hours 12-23 denote the PM hours of a 12-hour clock. In certain countries, 24-hour time is referred to as military time, since this is the time format used by militaries (and other entities) around the world, where unambiguous time measurement is particularly important.</p>
        
        <h3 className="hours-subheading">Hours in different time periods</h3>
        <table className="hours-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hours in a day</td>
              <td>24</td>
            </tr>
            <tr>
              <td>Hours in a week</td>
              <td>168</td>
            </tr>
            <tr>
              <td>Hours in a month</td>
              <td>672 for a 28-day month<br/>696 for a 29-day month<br/>720 for a 30-day month<br/>744 for a 31-day month<br/>730.5 on average</td>
            </tr>
            <tr>
              <td>Hours in a year</td>
              <td>8,760 for a 365-day year<br/>8,784 for a 366-day year<br/>8,766 on average</td>
            </tr>
            <tr>
              <td>Hours in a decade</td>
              <td>87,648 for a 2-leap-year decade<br/>87,672 for a 3-leap-year decade<br/>87,660 on average</td>
            </tr>
            <tr>
              <td>Hours in a century</td>
              <td>876,600</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
