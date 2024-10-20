# feelify

A personalized playlist generator that creates custom Spotify playlists tailored to your mood and taste.

The inspiration for feelify came from the desire to make it easy for users to discover and enjoy music that aligns with how they’re feeling. With just a few simple inputs, the app analyzes your mood and favorite artists to generate a playlist that matches your vibe. The playlist is instantly saved to your Spotify account, ready for you to listen to.

## Key Features

🎧 Mood-Based Playlists: Set your mood using a unique play icon that lets you adjust two key metrics: energy and valence.

🔄 Customizable Energy & Valence: Move the play icon left or right to change the energy of your playlist (low to high), and up or down to adjust the valence (happy or sad).

🔗 Spotify Integration: Log in with your Spotify Premium account to seamlessly create playlists saved directly to your account.

## Built With
- Flask (Python): Backend
- React (JavaScript): Frontend
- Spotify Web API: For fetching user data and creating playlists
- Render and Netlify: For hosting the backend and frontend

## How It Works

feelify uses two main metrics to curate your playlist:
- Energy: Adjust the play icon horizontally. Move up for lower energy (calm, relaxed) or down for higher energy (energetic, upbeat).
- Valence: Adjust the play icon vertically. Move right for a more cheerful, positive vibe, or left for a more mellow, introspective sound.

It also takes into account your top artists and genres based on your user profile!

Note: You need a Spotify Premium account with a consistent listening history for the best results. Additionally, the application is in development mode so the users configured to authenticate with Spotify are limited to the developers.

## Authors

Cindy Dong, Edison Huang, Olivia Seto, Christina Wang
