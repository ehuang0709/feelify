// Playlist.js

import React from 'react';
import './Playlist.css';

function Playlist() {
  return (
    <div className="playlist-container">
      <h1>Your Custom Playlist</h1>

      {/* Embedded Playlist */}
      <div className="embedded-playlist">
        {/* Replace the src URL with your actual playlist embed link */}
        <iframe
          src="https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID"
          width="100%"
          height="380"
          frameBorder="0"
          allow="encrypted-media"
          title="Spotify Playlist"
        ></iframe>
      </div>

      {/* Boxes of Images and Test Titles */}
      <div className="boxes-container">
        <div className="box">
          <img src="https://via.placeholder.com/150" alt="Test Image 1" className="box-image" />
          <h3 className="box-title">Test Title 1</h3>
        </div>
        <div className="box">
          <img src="https://via.placeholder.com/150" alt="Test Image 2" className="box-image" />
          <h3 className="box-title">Test Title 2</h3>
        </div>
        <div className="box">
          <img src="https://via.placeholder.com/150" alt="Test Image 3" className="box-image" />
          <h3 className="box-title">Test Title 3</h3>
        </div>
        {/* Add more boxes as needed */}
      </div>
    </div>
  );
}

export default Playlist;
