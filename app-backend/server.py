from flask import Flask, request, redirect, send_file, session, jsonify
from flask_cors import CORS
import requests
import urllib.parse
import base64
import os
import random
import string

app = Flask(__name__)
app.secret_key = '51e718937f025e5ea3af64b1c45ad9aa943a622ef85fd6afd75d72b7225e7b06'
CORS(app)

CLIENT_ID = '7ae92784d41c4407b0a41a7e6f16c352'
CLIENT_SECRET = '9ed3dac484904e33ace56746eafce27a'
REDIRECT_URI = 'http://localhost:3000/callback'

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

# LOGIN TO SPOTIFY ACCOUNT
@app.route('/login')
def login():
    state = generate_random_string(16)
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

    if not state:
        return redirect('/?' + urllib.parse.urlencode({'error': 'state_mismatch'}))

    auth_str = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    auth_options = {
        'url': 'https://accounts.spotify.com/api/token',
        'data': {
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'grant_type': 'authorization_code'
        },
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {b64_auth_str}'
        }
    }
    
    response = requests.post(auth_options['url'], data=auth_options['data'], headers=auth_options['headers'])
    token_data = response.json()
    session['access_token'] = token_data.get('access_token')

    return token_data

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
@app.route('/recommendations', methods=['POST'])
def generate_recommendations():
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

    if response.status_code != 200:
        return f"<pre>Error fetching recommendations: {response.status_code}, {response.text}</pre>"

    return response.json()

# # CREATE PLAYLIST
# @app.route('/create-playlist', methods=['POST'])
# def create_playlist():
#     access_token = session.get('access_token')
#     if not access_token:
#         return redirect('/login')

#     # Get recommended tracks
#     recommended_songs = request.json.get('recommended_songs', [])
#     track_uris = []

#     for song in recommended_songs:
#         song_name = song.get('name')
#         artist_name = song.get('artist')

#         search_url = 'https://api.spotify.com/v1/search'
#         query = f"track:{song_name} artist:{artist_name}"
#         params = {
#             'q': query,
#             'type': 'track',
#             'limit': 1
#         }

#         headers = {
#             'Authorization': f'Bearer {access_token}'
#         }

#         search_response = requests.get(search_url, headers=headers, params=params)

#         if search_response.status_code == 200:
#             search_results = search_response.json()
#             tracks = search_results.get('tracks', {}).get('items', [])
#             if tracks:
#                 track_uri = tracks[0]['uri']
#                 track_uris.append(track_uri)

#     # Create a new playlist
#     headers = {
#         'Authorization': f'Bearer {access_token}',
#         'Content-Type': 'application/json'
#     }

#     create_playlist_url = 'https://api.spotify.com/v1/me/playlists'
#     playlist_name = "feelify playlist"
#     save_playlist = request.json.get('save_playlist', False)
#     playlist_data = {
#         'name': playlist_name,
#         'public': save_playlist,
#         'description': 'Generated playlist from recommendations'
#     }

    
#     response = requests.post(create_playlist_url, headers=headers, json=playlist_data)

#     # Add tracks to the new playlist 
#     if response.status_code == 201:
#         playlist_id = response.json()['id']
#         if track_uris:
#             add_tracks_url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
#             add_tracks_data = {
#                 'uris': track_uris
#             }
#             requests.post(add_tracks_url, headers=headers, json=add_tracks_data)

#         return jsonify({'message': 'Playlist created successfully', 'playlist_id': playlist_id})
#     else:
#         return jsonify({'error': 'Error creating playlist', 'details': response.json()}), response.status_code

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