import React from 'react';
import './App.css';
import ArrowAnimation from '../ArrowAnimation';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="logo">FEELIFY</h1>
        <h2 className="subtitle">PLAYLIST</h2>
        <p className="description">
          INSTANTLY MAKE A SPOTIFY PLAYLIST TO SUIT YOUR MOOD AND TASTE
        </p>
        <ArrowAnimation />
      </header>
    </div>
  );
}

export default App;
