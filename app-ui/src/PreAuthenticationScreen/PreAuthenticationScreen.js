import React from 'react';
import './PreAuthenticationScreen.css';

function PreAuthenticationScreen() {
  return (
    <div className="pre-auth-container">
      <h1 className="logo">MOOD</h1>
      <h2 className="subtitle">PLAYLIST</h2>
      <div className="spotify-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify Logo" />
      </div>
      <p className="description">
        CONNECT YOUR SPOTIFY ACCOUNT SO MOOD PLAYLIST CAN DISCOVER YOUR MUSIC TASTE.
      </p>
      <p className="policy">
        By connecting you confirm that you have read and understood the <a href="#">Privacy & Cookie Policy</a> 
        and agree to the processing of your data and the use of cookies in accordance with it.
      </p>
      <button className="connect-button">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify Icon" />
        CONNECT WITH SPOTIFY
      </button>
    </div>
  );
}

export default PreAuthenticationScreen;
