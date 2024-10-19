from flask import Flask, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# @app.route('/', methods=['GET'])
# def send():
#     print('send')
#     # extracted_name = 'test.jpeg'
#     # return send_file(extracted_name, mimetype="image/jpeg")

@app.route('/', methods=['POST'])
def generate_recommendations():
    data = request.json
    print(data)
