from mahoudata.core import *
from pandas_profiling import ProfileReport
import pandas as pd
from flask import Flask,request
from flask_cors import CORS
from flask import render_template
from recommender import *

app = Flask(__name__)
CORS(app)

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


if __name__=='__main__':


    app.run(debug=True)
