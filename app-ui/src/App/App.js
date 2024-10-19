
import React, { useRef, useState } from 'react';
import './App.css';
import ArrowAnimation from '../ArrowAnimation';
import Mood from '../Mood/Mood';

function App() {
  const [showMood, setShowMood] = useState(false);
  const moodRef = useRef(null);

  const handleArrowClick = () => {
    setShowMood(true);
    setTimeout(() => {
      if (moodRef.current) {
        window.scrollTo({
          top: moodRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  //TODO: fix scroll animation
  return (
    <div className="App">
      {!showMood && ( 
      <header className="App-header">
        <h1 className="logo">FEELIFY</h1>
        <h2 className="subtitle">YOUR EMOTIONS, YOUR PLAYLIST</h2>
        <p className="description">
          INSTANTLY CREATE MUSIC THAT RESONATES
        </p>
        <ArrowAnimation handleClick={handleArrowClick} />
      </header>
      )}
      {showMood && (
        <div ref={moodRef}>
          <Mood />
        </div>
      )}
    </div>
  );
}

export default App;
