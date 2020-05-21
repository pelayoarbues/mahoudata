import os
from mahoudata.core import *
from pandas_profiling import ProfileReport
import pandas as pd
from flask import Flask, request, render_template, url_for, json
from flask_cors import CORS
from recommender import *

import json
import csv


MATRIX_FILE = './data/dataset-datathon.csv'
NO_VALUE_DISTANCE = 5

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

@app.route('/guess',methods=['POST'])
def guess():

    cats = ['graduacion','lupulo_afrutado_citrico','lupulo_floral_herbal','amargor','color','maltoso','licoroso','afrutado','especias','acidez']

    matrix = []
    ref_vector = request.get_json(force=True)
    print(ref_vector)

    input_file = csv.DictReader(open(MATRIX_FILE,"r"))

    for row in input_file:
        aux = []
        for cat in cats:
            aux.append(row[cat])

        matrix.append(aux)


    min = 10000;
    selectedId = -1;

    for i,beer in enumerate(matrix):
        dif = 0;

        for j,value in enumerate(beer):
            try:
                minidif = abs(float(value)-ref_vector[j]);
            except:
                minidif = NO_VALUE_DISTANCE
            dif += minidif;

        if(dif<min):
            min = dif;
            selectedId = i;
        

    return json.dumps(matrix[selectedId])

if __name__=='__main__':

    app.run(debug=True)
