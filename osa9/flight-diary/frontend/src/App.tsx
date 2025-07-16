import { useEffect, useState } from 'react';
import type { Entry } from './types.tsx';
import { addEntry, getEntries } from './services/noteService.ts';
import axios from 'axios';

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newVisibility, setNewVisibility] = useState("");
  const [newWeather, setNewWeather] = useState("");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const visibilityOptions = ["great", "good", "ok", "poor"];
  const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];

  useEffect(() => {
    getEntries().then(data => {
      setEntries(data);
    });
  }, []);

  const entryCreation = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry({ date: newDate, visibility: newVisibility, weather: newWeather, comment: newComment })
      .then(newEntry => {
        setEntries(entries.concat(newEntry));
        setNewDate("");
        setNewVisibility("");
        setNewWeather("");
        setNewComment("");
      }).catch(error => {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data || "An error occurred while adding the entry.");
        } else {
          setError("An unexpected error occurred.");
        }
      });
  };
  


  return (
    <div>
      <h1>Flight Diary</h1>
      <h2>Add New Entry</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}
        onSubmit={entryCreation}
      >
        <div>
          <label>Date:</label>
          <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
          />
        </div>
        <div>
          <label>Visibility:</label>
          {visibilityOptions.map(option => (
        <label key={option} style={{ marginLeft: '0.5rem' }}>
          <input
            type="radio"
            name="visibility"
            value={option}
            checked={newVisibility === option}
            onChange={(e) => setNewVisibility(e.target.value)}
          />
          {option}
        </label>
          ))}
        </div>
        <div>
          <label>Weather:</label>
          {weatherOptions.map(option => (
        <label key={option} style={{ marginLeft: '0.5rem' }}>
          <input
            type="radio"
            name="weather"
            value={option}
            checked={newWeather === option}
            onChange={(e) => setNewWeather(e.target.value)}
          />
          {option}
        </label>
          ))}
        </div>
        <div>
          <label>Comment:</label>
          <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
        <button type="submit">Add Entry</button>
      </form>
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>
            <strong>{entry.date}</strong>
            <p>Visibility: {entry.visibility}</p>
            <p>Weather: {entry.weather}</p>
            {entry.comment && <p>{entry.comment}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;