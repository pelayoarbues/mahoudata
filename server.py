import os
from mahoudata.core import *
from pandas_profiling import ProfileReport
import pandas as pd
from flask import Flask, request, render_template, url_for, json
from flask_cors import CORS
from recommender import *

app = Flask(__name__)
CORS(app)
# TODO just for dev
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/beers')
def beers():
    return get_beers()

# https://flask.palletsprojects.com/en/1.1.x/api/#url-route-registrations
@app.route('/beers/<int:beer_id>')
def beer(beer_id):
    return get_beers(beer_id)

@app.route('/beers/<int:beer_id>/recommendations')
def beer_recommendations(beer_id):
    return get_recommendations(beer_id)

@app.route('/simpleViz')
def simpleViz():
    return render_template('simpleViz.html')

@app.route('/')
def index():
    # Load brewing spec (steps and attributes) and pass it to the template
    # to build the UI 
    # TODO explore markdown formatting for `description fields`
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "data", "brewing-spec.json")
    data = json.load(open(json_url))

    return render_template('index.html', brewing_steps = data)

if __name__=='__main__':

    app.run(debug=True)
