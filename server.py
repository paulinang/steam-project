from flask import Flask, render_template, request
from flask_debugtoolbar import DebugToolbarExtension
import os
import requests

app = Flask(__name__)
steam_key = os.environ['STEAM_API_KEY']


@app.route('/')
def index():
    """ Homepage """

    return render_template('index.html')


@app.route('/get_user', methods=['POST'])
def get_user():
    """ Get steam user info """

    nickname = request.form.get('nickname')
    user = requests.get('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={}&vanityurl={}'.format(steam_key, nickname))

    return user.json()['response']['steamid']


if __name__ == "__main__":
    app.debug = False
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
