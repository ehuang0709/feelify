import React from 'react';
import './PlaylistButton.css';

function PlaylistButton({ showButton, onClick, color }) {
  if (!showButton) return null;

  const buttonStyle = {
    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
    color: getContrastColor(color.r, color.g, color.b),
  };

  return (
    <button 
      className="generate-playlist-button" 
      onClick={onClick}
      style={buttonStyle}
    >
      GENERATE PLAYLIST
    </button>
  );
}

// Helper function to determine text color based on background brightness
function getContrastColor(r, g, b) {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
}

export default PlaylistButton;