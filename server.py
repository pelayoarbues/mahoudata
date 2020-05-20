from mahoudata.core import *
from pandas_profiling import ProfileReport
import pandas as pd
from flask import Flask,request
from flask_cors import CORS
from flask import render_template
from recommender import *

MATRIX_FILE = './data/dataset-datathon.csv'

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

@app.route('/guess')
def guess(ref_vector):

    matrix = [];

    with open(MATRIX_FILE,"r") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter='\t')
        line_count = 0

        head = 1

        for row in csv_reader:
            if head==0:
                 matrix.append(row)
            else:
                 head = 0


    min = 10000;
    selectedId = -1;

    for beer in matrix:
        dif = 0;

        for value in beer_list:
            minidif = Math.abs(val-refVector[j]);
            dif += minidif;

        if(dif<min):
            min = dif;
            selectedId = i;
        

    return matrix[selectedId]

if __name__=='__main__':

    app.run(debug=True)
