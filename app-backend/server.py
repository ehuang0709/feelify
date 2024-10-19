from flask import Flask, request, redirect, send_file, session
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

    item_type = request.args.get('type', 'artists')
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

    seed_artists = data.get('seed_artists', [])
    target_energy = data.get('target_energy')
    target_valence = data.get('target_valence')
    limit = 20

    params = {
        'seed_artists': ','.join(seed_artists),
        'limit': limit,
        'target_energy': target_energy,
        'target_valence': target_valence
    }

    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get('https://api.spotify.com/v1/recommendations', headers=headers, params=params)

    if response.status_code != 200:
        return f"<pre>Error fetching recommendations: {response.status_code}, {response.text}</pre>"

    return response.json()



if __name__ == '__main__':
    app.run(port=3000)