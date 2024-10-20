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
  const { energy, valence } = location.state || {};
  console.log("energy: " + energy + "valence: " + valence)
  const [recommendations, setRecommendations] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);

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
    const artistData = JSON.parse(decodeURIComponent(queryParams.artist_data));
    
    // Use a Set to store unique artists based on artist_uri
    const uniqueArtists = new Set();

    artistData.forEach(artist => {
      uniqueArtists.add(JSON.stringify(artist)); // Convert artist object to string
    });

    // Convert the Set back to an array
    const artistsArray = Array.from(uniqueArtists).map(artist => JSON.parse(artist));
    
    // Sort the unique artists by popularity
    const sortedArtists = artistsArray.sort((a, b) => b.popularity - a.popularity);

    setArtists(sortedArtists);
  }, [queryParams.artist_data]);

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
          src={`https://open.spotify.com/embed/playlist/${playlistId}`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="encrypted-media"
          title="Spotify Playlist"
        ></iframe>
      </div>

      <h2 className="featured-artists-title">Featured Artists in This Playlist</h2>

      <div className="boxes-container">
        {artists.slice(0, 3).map(artist => (
          <div className="box" key={artist.artist_uri}>
            <img src={artist.image_url} alt={artist.artist_name} className="box-image" />
            <h3 className="box-title">{artist.artist_name}</h3>
            <p>Popularity: {artist.popularity}</p>
          </div>
        ))}
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
