import React from 'react';
import './PlaylistButton.css';

function PlaylistButton({ showButton, onClick }) {
  if (!showButton) return null; // Render nothing if the button should not show

  return (
    <button className="generate-playlist-button" onClick={onClick}>
      Generate Playlist
    </button>
  );
}

export default PlaylistButton;
