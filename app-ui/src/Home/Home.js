import React, { useRef, useState } from 'react';
import '../App/App.css';
import ArrowAnimation from '../ArrowAnimation';
import { useNavigate } from 'react-router-dom';


function Home() {
const navigate = useNavigate();

const handleHomeArrowClick = () => {
        navigate('/mood');
      };

  return (
    <div className="App">
      
      <header className="App-header">
        <h1 className="logo">FEELIFY</h1>
        <h2 className="subtitle">YOUR EMOTIONS, YOUR PLAYLIST</h2>
        <p className="description">
          INSTANTLY CREATE MUSIC THAT RESONATES
        </p>
        <ArrowAnimation handleClick={handleHomeArrowClick} />
      </header>
    </div>
  );
}

export default Home;