import React, { useState, useEffect } from 'react';
import './TablePageDarkMode.css';

const TablePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [newEntry, setNewEntry] = useState(getInitialNewEntry());
  const [dateAdded, setDateAdded] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  function getInitialNewEntry() {
    return {
      Action: '',
      ID: '',
      StartDate: '',
      EndDate: '',
      DatesExcluded: '',
      NumberOfDays: '',
      LeadCount: '',
      DDR: '',
    };
  }
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  useEffect(() => {
    const numberOfDays = calculateNumberOfDays(newEntry.StartDate, newEntry.EndDate, newEntry.DatesExcluded);
    setNewEntry((prevNewEntry) => ({ ...prevNewEntry, NumberOfDays: numberOfDays }));
  }, [newEntry.StartDate, newEntry.EndDate, newEntry.DatesExcluded]);
  

  const calculateNumberOfDays = (startDate, endDate, datesExcluded) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const excludedDates = datesExcluded
      .split(', ')
      .map((date) => new Date(date));
  
    let totalDays = 0;
    let excludedDaysCount = 0;
  
    while (start <= end) {
      const currentDateString = start.toDateString();
      const isExcluded = excludedDates.some((date) => date.toDateString() === currentDateString);
  
      if (!isExcluded) {
        totalDays++;
      } else {
        excludedDaysCount++;
      }
  
      start.setDate(start.getDate() + 1);
    }
  
    return totalDays - excludedDaysCount;
  };

  const handleNewEntryChange = (field, value) => {
    setNewEntry({ ...newEntry, [field]: value });
  };

  const handleAddEntry = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    setDateAdded(formattedDate);

    const newEntryData = {
      ...newEntry,
      ID: tableData.length + 1,
      LastUpdated: formattedDate,
      DatesExcluded: selectedDates.map(date => new Date(date).toISOString().slice(0, 10)).join(', '),
    };

    setTableData([newEntryData, ...tableData]);
    setNewEntry(getInitialNewEntry());
    setIsAddingEntry(false);
  };

  const handleDateChange = (index, date) => {
    const updatedSelectedDates = [...selectedDates];
    updatedSelectedDates[index] = date;
    setSelectedDates(updatedSelectedDates);
  };

  const addDateInput = () => {
    setSelectedDates([...selectedDates, '']);
  };

  const removeDateInput = (index) => {
    const updatedSelectedDates = [...selectedDates];
    updatedSelectedDates.splice(index, 1);
    setSelectedDates(updatedSelectedDates);
  };

  return (
    <div className={`table-container ${darkMode ? 'dark' : ''}`} style={{ overflowX: 'auto' }}>
      <button onClick={toggleDarkMode} className="mode">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Dates Excluded</th>
            <th>Number of Days</th>
            <th>Lead Count</th>
            <th>DDR</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {isAddingEntry && (
            <tr>
              {Object.keys(newEntry).map((field, index) => (
                <td key={index}>
                  {field === 'StartDate' || field === 'EndDate' ? (
                    <input
                      type="date"
                      className="date-field"
                      value={newEntry[field]}
                      onChange={(e) => handleNewEntryChange(field, e.target.value)}
                    />
                  ) : field === 'DatesExcluded' ? (
                    <div>
                      {selectedDates.map((date, dateIndex) => (
                        <input
                          key={dateIndex}
                          type="date"
                          className="date-field"
                          value={date}
                          onChange={(e) => handleDateChange(dateIndex, e.target.value)}
                        />
                      ))}
                      <button onClick={addDateInput} className='add-date-button'>Add Date</button>
                      <button onClick={() => removeDateInput(selectedDates.length - 1)} className='remove-date-button'>Remove Date</button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Add Here"
                      className="input-field"
                      value={newEntry[field]}
                      onChange={(e) => handleNewEntryChange(field, e.target.value)}
                    />
                  )}
                </td>
              ))}
              <td>{dateAdded}</td>
            </tr>
          )}

          {tableData.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((field) => (
                <td key={field}>{row[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {!isAddingEntry ? (
          <button onClick={() => setIsAddingEntry(true)} className='add-entry-button'>Add Entry</button>
        ) : (
          <button onClick={handleAddEntry} className='save-entry-button'>Save Entry</button>
        )}
      </div>
    </div>
  );
};

export default TablePage;
