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
CORS(app, resources={r"/*": {"origins": "https://feelify.netlify.app"}})

CLIENT_ID = '7ae92784d41c4407b0a41a7e6f16c352'
CLIENT_SECRET = '9ed3dac484904e33ace56746eafce27a'
# REDIRECT_URI = 'http://localhost:3000/callback'
REDIRECT_URI = 'https://the-repo.onrender.com/callback'

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

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

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=3000)
    app.run(port=3000)

# @app.route('/', methods=['POST'])
# def generate_recommendations():
#     data = request.json
#     print(data)