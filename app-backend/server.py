from flask import Flask, request, redirect, session, jsonify, make_response
from flask_cors import CORS
import requests
import urllib.parse
import base64
import random
import string
import json

app = Flask(__name__)
app.secret_key = '51e718937f025e5ea3af64b1c45ad9aa943a622ef85fd6afd75d72b7225e7b06'
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://feelify.netlify.app", "methods": ["GET", "POST", "OPTIONS"]}})

CLIENT_ID = '7ae92784d41c4407b0a41a7e6f16c352'
CLIENT_SECRET = '9ed3dac484904e33ace56746eafce27a'
REDIRECT_URI = 'https://the-repo.onrender.com/callback'

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://feelify.netlify.app'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


# CHECK USER AUTHENTICATION
@app.route('/check-auth')
def check_auth():
    access_token = session.get('access_token')
    if access_token:
        return jsonify({'authenticated': True})
    else:
        return jsonify({'authenticated': False})

# LOGIN TO SPOTIFY ACCOUNT
@app.route('/login')
def login():
    state = generate_random_string(16)
    energy = request.args.get('energy')
    valence = request.args.get('valence')

    session['energy'] = energy
    session['valence'] = valence

    scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public user-follow-read user-top-read user-read-recently-played user-library-read'
    
    query_params = {
        'response_type': 'code',
        'client_id': CLIENT_ID,
        'scope': scope,
        'redirect_uri': REDIRECT_URI,
        'state': state
    }
    auth_url = 'https://accounts.spotify.com/authorize?' + urllib.parse.urlencode(query_params)
    return redirect(auth_url)

# SPOTIFY API CALLBACK
@app.route('/callback')
def callback():
    code = request.args.get('code')
    state = request.args.get('state')

    # Exchange code for an access token
    auth_str = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        },
        headers={
            'Authorization': f'Basic {b64_auth_str}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )

    # Handle response and save token in the session
    token_data = response.json()
    access_token = token_data.get('access_token')

    if access_token:
        session['access_token'] = access_token

        target_energy = session.get('energy')
        target_valence = session.get('valence')
        
        # Fetch top artists
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        top_artists_response = requests.get('https://api.spotify.com/v1/me/top/artists', headers=headers, params={
            'time_range': 'medium_term',
            'limit': 5
        })

        if top_artists_response.status_code != 200:
            return redirect(f'https://feelify.netlify.app/?error=access_denied')

        top_artists_data = top_artists_response.json()
        seed_artists = [artist['id'] for artist in top_artists_data['items']]

        # Generate recommendations
        recommendations_response = requests.get('https://api.spotify.com/v1/recommendations', headers=headers, params={
            'seed_artists': ','.join(seed_artists),
            'limit': 20,
            'target_energy': target_energy,  
            'target_valence': target_valence
        })

        if recommendations_response.status_code != 200:
            return redirect(f'https://feelify.netlify.app/?error=recommendation_failed')

        recommendations_data = recommendations_response.json()
        track_uris = [track['uri'] for track in recommendations_data.get('tracks', [])]

        # Create a playlist with recommended songs
        create_playlist_url = 'https://api.spotify.com/v1/me/playlists'
        playlist_name = "feelify playlist"
        energy_percentage = int(float(target_energy) * 100)
        valence_percentage = int(float(target_valence) * 100)
        playlist_description = f'made by feelify with energy level {energy_percentage}% and valence level {valence_percentage}%'        
        playlist_data = {
            'name': playlist_name,
            'public': True,
            'description': playlist_description
        }

        create_response = requests.post(create_playlist_url, headers=headers, json=playlist_data)

        if create_response.status_code != 201:
            return redirect(f'https://feelify.netlify.app/?error=playlist_creation_failed')

        created_playlist = create_response.json()
        playlist_id = created_playlist['id']

        # Add tracks to the created playlist
        add_tracks_url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
        add_tracks_response = requests.post(add_tracks_url, headers=headers, json={'uris': track_uris})

        if add_tracks_response.status_code != 201:
            return redirect(f'https://feelify.netlify.app/?error=adding_tracks_failed')
        
        tracks_response = requests.get(f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks', headers=headers)
        
        if tracks_response.status_code != 200:
            return redirect(f'https://feelify.netlify.app/?error=fetching_tracks_failed')

        tracksData = tracks_response.json()
        artist_info = []

        # Collect detailed artist information using the Get Artist endpoint
        for track in tracksData['items']:
            for artist in track['track']['artists']:
                artist_id = artist['id']
                artist_response = requests.get(f'https://api.spotify.com/v1/artists/{artist_id}', headers=headers)
                
                if artist_response.status_code == 200:
                    artist_data = artist_response.json()
                    artist_info.append({
                        'artist_name': artist_data['name'],
                        'artist_uri': artist_data['uri'],
                        'popularity': artist_data['popularity'],
                        'image_url': artist_data['images'][0]['url'] if artist_data['images'] else '',
                        'spotify_url': artist_data['external_urls']['spotify']
                    })

        # URL encode the artist info data
        encoded_artist_data = urllib.parse.quote(json.dumps(artist_info))

        # Redirect to the frontend playlist page with playlist ID and artist information
        return redirect(f'https://feelify.netlify.app/playlist?playlist_id={playlist_id}&energy={target_energy}&valence={target_valence}&artist_data={encoded_artist_data}')
    
    else:
        return redirect(f'https://feelify.netlify.app/?error=access_denied')

# GET USER RECENTLY PLAYED
@app.route('/recently-played')
def recently_played():
    access_token = session.get('access_token')
    if not access_token:
        return redirect('/login')

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get('https://api.spotify.com/v1/me/player/recently-played', headers=headers)
    
    if response.status_code != 200:
        return f"<pre>Error fetching recently played tracks: {response.status_code}, {response.text}</pre>"

    data = response.json()
    artists_info = []

    for item in data['items']:
        track = item['track']
        artists = track['artists']  # List of artists for the track

        for artist in artists:
            artist_id = artist['id']
            artist_name = artist['name']

            # Fetch artist details
            artist_response = requests.get(
                f'https://api.spotify.com/v1/artists/{artist_id}',
                headers={'Authorization': f'Bearer {access_token}'}
            )

            if artist_response.status_code == 200:
                artist_details = artist_response.json()
                genres = artist_details.get('genres', [])
                followers = artist_details.get('followers', {}).get('total', 0)
                artists_info.append({
                    'artist_id': artist_id,
                    'artist_name': artist_name,
                    'genres': genres,
                    'followers': followers,
                    'image_url': artist_details.get('images', [{}])[0].get('url', '')  # First image URL, if available
                })
            else:
                artists_info.append({
                    'artist_id': artist_id,
                    'artist_name': artist_name,
                    'genres': [],
                    'followers': 0,
                    'error': 'Unable to fetch artist details'
                })

    return {"artists_info": artists_info}

# GET USER PLAYLISTS
@app.route('/playlists')
def playlists():
    access_token = session.get('access_token')
    if not access_token:
        return redirect('/login')

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get('https://api.spotify.com/v1/me/playlists', headers=headers)

    if response.status_code != 200:
        return f"<pre>Error fetching playlists: {response.status_code}, {response.text}</pre>"

    return response.json()

# GET ALL TRACKS IN THE PLAYLIST
@app.route('/playlists/<playlist_id>')
def playlist_tracks(playlist_id):
    access_token = session.get('access_token')
    if not access_token:
        return redirect('/login')

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get(f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks', headers=headers)

    if response.status_code != 200:
        return f"<pre>Error fetching tracks for playlist {playlist_id}: {response.status_code}, {response.text}</pre>"

    return response.json()

# GET USER TOP 5 ITEMS
@app.route('/user-top-items')
def user_top_items():
    access_token = session.get('access_token')
    if not access_token:
        return redirect('/login')

    item_type = request.args.get('type', 'tracks')
    time_range = request.args.get('time_range', 'medium_term')
    limit = request.args.get('limit', 5)

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get(f'https://api.spotify.com/v1/me/top/{item_type}', headers=headers, params={
        'time_range': time_range,
        'limit': limit
    })

    if response.status_code != 200:
        return f"<pre>Error fetching top {item_type}: {response.status_code}, {response.text}</pre>"

    data = response.json()
    items_info = []

    for artist in data['items']:
        items_info.append({
            'id': artist['id'],
            'artist_name': artist['name'],
            'genres': artist.get('genres', []),
            'followers': artist['followers']['total'],
            'popularity': artist['popularity'],
            'image_url': artist.get('images', [{}])[0].get('url', '')
        })

    return {"top_items": items_info} 

# GENERATE SONG RECOMMENDATIONS
@app.route('/recommendations', methods=['POST', 'OPTIONS'])
def generate_recommendations():
    if request.method == 'OPTIONS':
        # Handle the preflight request
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'https://feelify.netlify.app'
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    access_token = session.get('access_token')
    if not access_token:
        return redirect('/login')
    
    data = request.json

    # seed_artists = data.get('seed_artists', [])
    target_energy = data.get('target_energy')
    target_valence = data.get('target_valence')
    limit = 20

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    top_items_response = requests.get('https://api.spotify.com/v1/me/top/artists', headers=headers, params={
        'time_range': 'medium_term',
        'limit': 5
    })

    if top_items_response.status_code != 200:
        return f"<pre>Error fetching top artists: {top_items_response.status_code}, {top_items_response.text}</pre>"

    top_items_data = top_items_response.json()

    seed_artists = [artist['id'] for artist in top_items_data['items']]

    params = {
        'seed_artists': ','.join(seed_artists),
        'limit': limit,
        'target_energy': target_energy,
        'target_valence': target_valence
    }

    response = requests.get('https://api.spotify.com/v1/recommendations', headers=headers, params=params)

    response_headers = {
        'Access-Control-Allow-Origin': 'https://feelify.netlify.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }

    if response.status_code != 200:
        return f"<pre>Error fetching recommendations: {response.status_code}, {response.text}</pre>"

    response_data = response.json()
    return jsonify(response_data), 200, response_headers

# CREATE PLAYLIST
@app.route('/create-playlist')
def create_playlist():
    access_token = session.get('access_token')
    if not access_token:
        return redirect('/login')

    # Hardcoded recommended songs data for testing
    recommended_songs = [
        {'name': 'Shape of You', 'artist': 'Ed Sheeran'},
        {'name': 'Blinding Lights', 'artist': 'The Weeknd'},
        {'name': 'Levitating', 'artist': 'Dua Lipa'},
        {'name': 'Dance Monkey', 'artist': 'Tones and I'},
        {'name': 'Sunflower', 'artist': 'Post Malone'}
    ]
    
    track_uris = []

    for song in recommended_songs:
        song_name = song.get('name')
        artist_name = song.get('artist')

        search_url = 'https://api.spotify.com/v1/search'
        query = f"track:{song_name} artist:{artist_name}"
        params = {
            'q': query,
            'type': 'track',
            'limit': 1
        }

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        search_response = requests.get(search_url, headers=headers, params=params)

        if search_response.status_code == 200:
            search_results = search_response.json()
            tracks = search_results.get('tracks', {}).get('items', [])
            if tracks:
                track_uri = tracks[0]['uri']
                track_uris.append(track_uri)

    # Create a new playlist
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    create_playlist_url = 'https://api.spotify.com/v1/me/playlists'
    playlist_name = "feelify playlist"
    save_playlist = True  # Hardcoded to save the playlist publicly for testing
    playlist_data = {
        'name': playlist_name,
        'public': save_playlist,
        'description': 'Generated playlist from recommendations'
    }

    response = requests.post(create_playlist_url, headers=headers, json=playlist_data)

    # Add tracks to the new playlist
    if response.status_code == 201:
        playlist_id = response.json()['id']
        if track_uris:
            add_tracks_url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
            add_tracks_data = {
                'uris': track_uris
            }
            requests.post(add_tracks_url, headers=headers, json=add_tracks_data)

        return jsonify({'message': 'Playlist created successfully', 'playlist_id': playlist_id})
    else:
        return jsonify({'error': 'Error creating playlist', 'details': response.json()}), response.status_code

if __name__ == '__main__':
    app.run(port=3000)