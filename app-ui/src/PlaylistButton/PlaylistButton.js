import React from 'react';
import './PlaylistButton.css';

function PlaylistButton({ showButton, onClick, valence, energy }) {
  if (!showButton) return null; 

  return (
    <button className="generate-playlist-button" onClick={onClick}>
      GENERATE PLAYLIST
    </button>
  );
}

export default PlaylistButton;
