// Playlist.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Playlist.css';

function getQueryParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams.entries()) {
      params[key] = value;
  }
  return params;
}

function Playlist() {
  const location = useLocation();
  const navigate = useNavigate();
  const { energy, valence } = location.state || { energy: 0, valence: 0 };
  const [recommendations, setRecommendations] = useState([]);
  const [tracks, setTracks] = useState([]);

  const handleMakeAnotherClick = () => {
    navigate('/mood'); // Adjust the route to your mood selection screen
  };

  const handleOpenSpotifyClick = () => {
    window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank');
  };

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const response = await fetch(`https://the-repo.onrender.com/playlists/${playlistId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Tracks in playlist:', data);
      setTracks(data.items || []); // Assuming your backend returns tracks in data.items
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  // Usage
  const queryParams = getQueryParams();
  const playlistId = queryParams.playlist_id;

  useEffect(() => {
    if (playlistId) {
      console.log("playlist id: "+playlistId)
      fetchPlaylistTracks(playlistId);
    }
  }, [playlistId]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('https://the-repo.onrender.com/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            target_energy: energy,
            target_valence: valence,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.tracks || []);

        console.log("Recommendations:", data.tracks || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [energy, valence]);

  return (
    <div className="playlist-container">
      <h1 className="playlist-title">Your Custom Playlist</h1>

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

      <h2 className="featured-artists-title">Featured Artists in This Playlist</h2>

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

      {/* Buttons Section */}
      <div className="buttons-container">
        <button className="make-another-button" onClick={handleMakeAnotherClick}>
          Make Another
        </button>
        <button className="open-spotify-button" onClick={handleOpenSpotifyClick}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
            alt="Spotify Logo"
            className="spotify-logo"
          />
          Open Spotify
        </button>
      </div>
    </div>
  );
}

export default Playlist;
