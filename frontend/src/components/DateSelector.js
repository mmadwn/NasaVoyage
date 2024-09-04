import React, { useState } from 'react';

const DateSelector = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div className="date-input-container">
      <label htmlFor="date-select">Select Date:</label>
      <input
        id="date-select"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        max={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
};

export default DateSelector;