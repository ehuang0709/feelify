import React from 'react';
import './App.css';
import ArrowAnimation from '../ArrowAnimation';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="logo">FEELIFY</h1>
        <h2 className="subtitle">YOUR EMOTIONS, YOUR PLAYLIST</h2>
        <p className="description">
          INSTANTLY CREATE MUSIC THAT RESONATES
        </p>
        <ArrowAnimation />
      </header>
    </div>
  );
}

export default App;
