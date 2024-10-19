import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreAuthenticationScreen.css';
import { useLocation } from 'react-router-dom';

function PreAuthenticationScreen() {
  const location = useLocation();
  const authenticate = () => {
    window.location.href = 'https://the-repo.onrender.com/login';  // Navigate to the external URL
  };
  const { energy, valence } = location.state || { energy: 0, valence: 0 };

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('https://the-repo.onrender.com/login');
      if (response.ok) {
        // If the user is authenticated, navigate to the playlist component
        navigate('/playlist', { state: { energy, valence } });
      }
    };

    checkAuth();
  }, [navigate, energy, valence]);

  return (
    <div className="pre-auth-container">
      <div className="upper-content">
        <h1 className="logo">FEELIFY</h1>
        <h2 className="subtitle">PLAYLIST</h2>
        <div className="spotify-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify Logo" />
        </div>
      </div>
      
      <div className="lower-content">
        <p className="description">
          CONNECT YOUR SPOTIFY ACCOUNT SO FEELIFY PLAYLIST CAN DISCOVER YOUR MUSIC TASTE.
        </p>
        <p className="policy">
          By connecting you confirm that you have read and understood the <a href="https://www.spotify.com/us/legal/privacy-policy/">Privacy & Cookie Policy </a>  
          and agree to the processing of your data and the use of cookies in accordance with it.
        </p>
        <button className="connect-button" onClick={authenticate}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify Icon" />
          CONNECT WITH SPOTIFY
        </button>
      </div>
    </div>
  );
}

export default PreAuthenticationScreen;
