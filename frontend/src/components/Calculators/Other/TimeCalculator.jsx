import React, { useState } from "react";
import "./TimeCalculator.css";

// Helper function to add/subtract time values
function calculateTime(day1, hour1, min1, sec1, day2, hour2, min2, sec2, isAdd) {
  let totalSeconds1 = Number(day1) * 86400 + Number(hour1) * 3600 + Number(min1) * 60 + Number(sec1);
  let totalSeconds2 = Number(day2) * 86400 + Number(hour2) * 3600 + Number(min2) * 60 + Number(sec2);
  
  let result = isAdd ? totalSeconds1 + totalSeconds2 : totalSeconds1 - totalSeconds2;
  
  const days = Math.floor(Math.abs(result) / 86400);
  result = Math.abs(result) % 86400;
  const hours = Math.floor(result / 3600);
  result = result % 3600;
  const minutes = Math.floor(result / 60);
  const seconds = result % 60;
  
  return { days, hours, minutes, seconds };
}

// Helper to add time to a date
function addTimeToDate(dateStr, timeStr, days, hours, minutes, seconds) {
  if (!dateStr || !timeStr) return null;
  const [hour, min] = timeStr.split(':');
  const date = new Date(dateStr);
  date.setHours(Number(hour), Number(min), 0);
  
  const totalSeconds = Number(days) * 86400 + Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  date.setSeconds(date.getSeconds() + totalSeconds);
  
  return date.toLocaleString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });
}

export default function TimeCalculator() {
  // Time Calculator states
  const [day1, setDay1] = useState(0);
  const [hour1, setHour1] = useState(0);
  const [min1, setMin1] = useState(0);
  const [sec1, setSec1] = useState(0);
  const [day2, setDay2] = useState(0);
  const [hour2, setHour2] = useState(0);
  const [min2, setMin2] = useState(0);
  const [sec2, setSec2] = useState(0);
  const [isAddTime, setIsAddTime] = useState(true);
  const [timeResult, setTimeResult] = useState(null);

  // Add/Subtract Time from Date states
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [addDays, setAddDays] = useState(0);
  const [addHours, setAddHours] = useState(0);
  const [addMinutes, setAddMinutes] = useState(0);
  const [addSeconds, setAddSeconds] = useState(0);
  const [dateTimeResult, setDateTimeResult] = useState(null);

  function handleTimeCalculation(e) {
    e.preventDefault();
    setTimeResult(calculateTime(day1, hour1, min1, sec1, day2, hour2, min2, sec2, isAddTime));
  }

  function handleDateTimeCalculation(e) {
    e.preventDefault();
    setDateTimeResult(addTimeToDate(startDate, startTime, addDays, addHours, addMinutes, addSeconds));
  }

  return (
    <div className="time-calc-root">
      {/* TIME CALCULATOR */}
      <div className="time-calc-heading-wrapper">
        <h2 className="time-calc-heading">Time Calculator</h2>
        <div className="time-calc-subheading">
          This calculator can be used to "add" or "subtract" two time values
        </div>
      </div>
      <div className="time-calc-card">
        <form onSubmit={handleTimeCalculation} className="time-calc-form">
          <div className="time-input-row">
            <div className="time-input-col">
              <span className="time-label">Day</span>
              <input type="number" value={day1} min="0" onChange={e => setDay1(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Hour</span>
              <input type="number" value={hour1} min="0" onChange={e => setHour1(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Minute</span>
              <input type="number" value={min1} min="0" onChange={e => setMin1(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Second</span>
              <input type="number" value={sec1} min="0" onChange={e => setSec1(e.target.value)} className="time-input"/>
            </div>
          </div>
          <div className="time-operation-btns">
            <button type="button" onClick={() => setIsAddTime(true)} className={`time-op-btn ${isAddTime ? 'active' : ''}`}>+</button>
            <button type="button" onClick={() => setIsAddTime(false)} className={`time-op-btn ${!isAddTime ? 'active' : ''}`}>−</button>
          </div>
          <div className="time-input-row">
            <div className="time-input-col">
              <span className="time-label">Day</span>
              <input type="number" value={day2} min="0" onChange={e => setDay2(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Hour</span>
              <input type="number" value={hour2} min="0" onChange={e => setHour2(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Minute</span>
              <input type="number" value={min2} min="0" onChange={e => setMin2(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Second</span>
              <input type="number" value={sec2} min="0" onChange={e => setSec2(e.target.value)} className="time-input"/>
            </div>
          </div>
          <button type="submit" className="time-calc-btn">Calculate</button>
        </form>
        {timeResult && (
          <div className="time-result">
            <span className="result-label">Result: </span>
            {timeResult.days}d {timeResult.hours}h {timeResult.minutes}m {timeResult.seconds}s
          </div>
        )}
      </div>

      {/* ADD OR SUBTRACT TIME FROM A DATE */}
      <div className="time-calc-heading-wrapper">
        <h2 className="time-calc-heading1">Add or Subtract Time from a Date</h2>
        <div className="time-calc-subheading">
          Use this calculator to add or subtract time (days, hours, minutes, seconds) from a starting time and date
        </div>
      </div>
      <div className="time-calc-card">
        <form onSubmit={handleDateTimeCalculation} className="time-calc-form">
          <div className="time-label" style={{marginBottom: "10px"}}>Start Time</div>
          <div className="date-time-inputs">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="date-input"/>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="time-input-small"/>
          </div>
          <div className="time-input-row">
            <div className="time-input-col">
              <span className="time-label">Day</span>
              <input type="number" value={addDays} min="0" onChange={e => setAddDays(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Hour</span>
              <input type="number" value={addHours} min="0" onChange={e => setAddHours(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Minute</span>
              <input type="number" value={addMinutes} min="0" onChange={e => setAddMinutes(e.target.value)} className="time-input"/>
            </div>
            <div className="time-input-col">
              <span className="time-label">Second</span>
              <input type="number" value={addSeconds} min="0" onChange={e => setAddSeconds(e.target.value)} className="time-input"/>
            </div>
          </div>
          <button type="submit" className="time-calc-btn">Calculate</button>
        </form>
        {dateTimeResult && (
          <div className="time-result">
            <span className="result-label">Result: </span>
            {dateTimeResult}
          </div>
        )}
      </div>

      {/* CONCEPTS OF TIME */}
      <div className="time-concepts">
        <h2 className="concepts-heading">Concepts of Time:</h2>
        
        <h3 className="concepts-subheading">Ancient Greece</h3>
        <p style={{textAlign: "justify"}}>There exist various concepts of time that have been postulated by different philosophers and scientists over an extensive period of human history. One of the earlier views was presented by the ancient Greek philosopher Aristotle (384-322 BC), who defined time as "a number of movement in respect of the before and after." Essentially, Aristotle's view of time defined it as a measurement of change requiring the existence of some kind of motion or change. He also believed that time was infinite and continuous, and that the universe always did, and always will exist. Interestingly, he was also one of the first people, if not the first person, to frame the idea that time existing of two different kinds of non-existence makes time existing at all, questionable. Aristotle's view is solely one amongst many in the discussion of time, the most controversial of which began with Sir Isaac Newton, and Gottfried Leibniz.</p>
        
        <h3 className="concepts-subheading">Newton & Leibniz</h3>
        <p style={{textAlign: "justify"}}>In Newton's Philosophiæ Naturalis Principia Mathematica, Newton tackled the concepts of space and time as absolutes. He argued that absolute time exists and flows without any regard to external factors, and called this "duration." According to Newton, absolute time can only be understood mathematically, since it is imperceptible. Relative time on the other hand, is what humans actually perceive and is a measurement of "duration" through the motion of objects, such as the sun and the moon. Newton's realist view is sometimes referred to as Newtonian time.</p>
        <p style={{textAlign: "justify"}}>Contrary to Newton's assertions, Leibniz believed that time only makes sense in the presence of objects with which it can interact. According to Leibniz, time is nothing more than a concept similar to space and numbers that allows humans to compare and sequence events. Within this argument, known as relational time, time itself cannot be measured. It is simply the way in which humans subjectively perceive and sequence the objects, events, and experiences accumulated throughout their lifetimes.</p>
        <p style={{textAlign: "justify"}}>One of the prominent arguments that arose from the correspondence between Newton's spokesman Samuel Clarke and Leibniz is referred to as the bucket argument, or Newton's bucket. In this argument, water in a bucket hanging stationary from a rope begins with a flat surface, which becomes concave as the water and bucket are made to spin. If the bucket's rotation is then stopped, the water remains concave during the period it continues to spin. Since this example showed that the concavity of the water was not based on an interaction between the bucket and the water, Newton claimed that the water was rotating in relation to a third entity, absolute space. He argued that absolute space was necessary in order to account for cases where a relationalist perspective could not fully explain an object's rotation and acceleration. Despite Leibniz's efforts, this Newtonian concept of physics remained prevalent for nearly two centuries.</p>

        <h3 className="concepts-subheading">Einstein</h3>
        <p style={{textAlign: "justify"}}>While many scientists, including Ernst Mach, Albert A. Michelson, Hendrik Lorentz, and Henri Poincare among others, contributed to what would ultimately transform theoretical physics and astronomy, the scientist credited with compiling and describing the theory of relativity and the Lorentz Transformation was Albert Einstein. Unlike Newton, who believed that time moved identically for all observers regardless of the frame of reference, Einstein, building on Leibniz's view that time is relative, introduced the idea of spacetime as connected, rather than separate concepts of space and time. Einstein posited that the speed of light, c, in vacuum, is the same for all observers, independent of the motion of the light source, and relates distances measured in space with distances measured in time. Essentially, for observers within different inertial frames of reference (different relative velocities), both the shape of space as well as the measurement of time simultaneously change due to the invariance of the speed of light – a view vastly different from Newton's. A common example depicting this involves a spaceship moving near the speed of light. To an observer on another spaceship moving at a different speed, time would move slower on the spaceship traveling at near the speed of light, and would theoretically stop if the spaceship could actually reach the speed of light.</p>
        <p style={{textAlign: "justify"}}>To put it simply, if an object moves faster through space, it will move slower through time, and if an object moves slower through space, it will move faster through time. This has to occur in order for the speed of light to remain constant.</p>
        <p style={{textAlign: "justify"}}>It is worth noting that Einstein's theory of general relativity, after nearly two centuries, finally gave answer to Newton's bucket argument. Within general relativity, an inertial frame of reference is one that follows a geodesic of spacetime, where a geodesic generalizes the idea of a straight line to that of curved spacetime. General relativity states: an object moving against a geodesic experiences a force; an object in free fall does not experience a force because it is following a geodesic; and an object on earth does experience a force because the surface of the planet applies a force against the geodesic to hold the object in place. As such, rather than rotating with respect to "absolute space" or with respect to distant stars (as postulated by Ernst Mach), the water in the bucket is concave because it is rotating with respect to a geodesic.</p>
        <p style={{textAlign: "justify"}}>The various concepts of time that have prevailed throughout different periods of history make it evident that even the most well-conceived theories can be overturned. Despite all of the advances made in quantum physics and other areas of science, time is still not fully understood. It may only be a matter of time before Einstein's absolute constant of light is revoked, and humanity succeeds in traveling to the past!</p>

        <h3 className="concepts-subheading">How we measure time:</h3>
        <p style={{textAlign: "justify"}}>There are two distinct forms of measurement typically used today to determine time: the calendar and the clock. These measurements of time are based on the sexagesimal numeral system, which uses 60 as its base. This system originated from ancient Sumer within the 3rd millennium BC, and was adopted by the Babylonians. It is now used in a modified form for measuring time, as well as angles and geographic coordinates. Base 60 is used due to the number 60's status as a superior highly composite number having 12 factors. A superior highly composite number is a natural number, that relative to any other number scaled to some power of itself, has more divisors. The number 60, having as many factors as it does, simplifies many fractions involving sexagesimal numbers, and its mathematical advantage is one of the contributing factors to its continued use today. For example, 1 hour, or 60 minutes, can be evenly divided into 30, 20, 15, 12, 10, 6, 5, 4, 3, 2, and 1 minute, illustrating some of the reasoning behind the sexagesimal system's use in measuring time.</p>
      
        <h3 className="concepts-subheading">Development of the second, minute, and concept of a 24-hour day:</h3>
        <p style={{textAlign: "justify"}}>The Egyptian civilization is often credited as being the first civilization that divided the day into smaller parts, due to documented evidence of their use of sundials. The earliest sundials divided the period between sunrise and sunset into 12 parts. Since sundials could not be used after sunset, measuring the passage of night was more difficult. Egyptian astronomers noticed patterns in a set of stars however, and used 12 of those stars to create 12 divisions of night. Having these two 12 part divisions of day and night is one theory behind where the concept of a 24-hour day originated. The divisions created by the Egyptians however, varied based on the time of the year, with summer hours being much longer than those of winter. It was not until later, around 147 to 127 BC that a Greek astronomer Hipparchus proposed dividing the day into 12 hours of daylight and 12 hours of darkness based on the days of the equinox. This constituted the 24 hours that would later be known as equinoctial hours and would result in days with hours of equal length. Despite this, fixed-length hours only became commonplace during the 14th century along with the advent of mechanical clocks.    </p>
        <p style={{textAlign: "justify"}}>Hipparchus also developed a system of longitude lines encompassing 360 degrees, which was later subdivided into 360 degrees of latitude and longitude by Claudius Ptolemy. Each degree was divided into 60 parts, each of which was again divided into 60 smaller parts that became known as the minute and second respectively.While many different calendar systems were developed by various civilizations over long periods of time, the calendar most commonly used worldwide is the Gregorian calendar. It was introduced by Pope Gregory XIII in 1582 and is largely based on the Julian calendar, a Roman solar calendar proposed by Julius Caesar in 45 BC. The Julian calendar was inaccurate and allowed the astronomical equinoxes and solstices to advance against it by approximately 11 minutes per year. The Gregorian calendar significantly improved upon this discrepancy. Refer to the date calculator for further details on the history of the Gregorian calendar.</p>

        <h3 className="concepts-subheading">Early timekeeping devices:</h3>
        <p style={{textAlign: "justify"}}>Early devices for measuring time were highly varied based on culture and location, and generally were intended to divide the day or night into different periods meant to regulate work or religious practices. Some of these include oil lamps and candle clocks which were used to mark the passage of time from one event to another, rather than actually tell the time of the day. The water clock, also known as a clepsydra, is arguably the most accurate clock of the ancient world. Clepsydras function based on the regulated flow of water from, or into a container where the water is then measured to determine the passage of time. In the 14th century, hourglasses, also known as sandglasses, first appeared and were originally similar in purpose to oil lamps and candle clocks. Eventually, as clocks became more accurate, they were used to calibrate hourglasses to measure specific periods of time. The first pendulum mechanical clock was created by Christiaan Huygens in 1656; it was the first clock regulated by a mechanism with a "natural" period of oscillation. Huygens managed to refine his pendulum clock to have errors of fewer than 10 seconds a day. Today however, atomic clocks are the most accurate devices for time measurement. Atomic clocks use an electronic oscillator to keep track of passing time based on cesium atomic resonance. While other types of atomic clocks exist, cesium atomic clocks are the most common and accurate. The second, the SI unit of time, is also calibrated based on measuring periods of the radiation of a cesium atom.</p>
      </div>
    </div>
  );
}
