import React, { useState } from 'react';
import './App.css';

function App() {
  const [mood, setMood] = useState('😀');
  const moods = ['😀', '😢', '😡', '😴', '😍'];

  const handleMoodChange = (newMood) => {
    setMood(newMood);
  };

  return (
    <div className="App">
      <h1>Select Your Mood</h1>
      <div className="mood-container">
        {moods.map((m, index) => (
          <button
            key={index}
            className={`mood-button ${m === mood ? 'active' : ''}`}
            onClick={() => handleMoodChange(m)}
          >
            {m}
          </button>
        ))}
      </div>
      <p>Your current mood is: {mood}</p>
    </div>
  );
}

export default App;