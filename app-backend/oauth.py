from flask import Flask, request, redirect
import requests
import urllib.parse
import base64
import os
import random
import string

app = Flask(__name__)

CLIENT_ID = os.env.SPOTIFY_CLIENT_ID
CLIENT_SECRET = os.env.SPOTIFY_CLIENT_SECRET
REDIRECT_URI = 'http://localhost:3000/callback'

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
    return response.json()

if __name__ == '__main__':
    app.run(port=8888)
