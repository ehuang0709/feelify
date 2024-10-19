
import React, { useRef, useState } from 'react';
import './App.css';
import ArrowAnimation from '../ArrowAnimation';
import Home from '../Home/Home';

function App() {
  const [showHome, setShowHome] = useState(false);
  const homeRef = useRef(null);

  const handleArrowClick = () => {
    setShowHome(true);
    setTimeout(() => {
      if (homeRef.current) {
        window.scrollTo({
          top: homeRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="logo">FEELIFY</h1>
        <h2 className="subtitle">YOUR EMOTIONS, YOUR PLAYLIST</h2>
        <p className="description">
          INSTANTLY CREATE MUSIC THAT RESONATES
        </p>
        <ArrowAnimation handleClick={handleArrowClick} />
      </header>
      {showHome && (
        <div ref={homeRef}>
          <Home />
        </div>
      )}
    </div>
  );
}

export default App;
