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
self = {}

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
    return render_template('index.html', brewing_steps = get_brewing_spec())


def __translate_obj_param__(obj):

    '''[{"graduacion":""},{"lupulo_afrutado_citrico":1.6},{"lupulo_floral_herbal":1.3},{"amargor":2.5},{"color":0.3},{"maltoso":0.2},{"licoroso":1.9},{"afrutado":1.7},{"especias":1.7},{"acidez":2}]'''
    cats = ['graduacion','lupulo_afrutado_citrico','lupulo_floral_herbal','amargor','color','maltoso','licoroso','afrutado','especias','acidez']

    vector = []

    for cat in cats:
        for subunit in obj:
            if cat in subunit:
                vector.append(subunit[cat])    

    #for cat in cats:
    #    vector.append(obj[cat])
    
    return vector


@app.route('/guess',methods=['POST'])
def guess():

    cats = ['graduacion','lupulo_afrutado_citrico','lupulo_floral_herbal','amargor','color','maltoso','licoroso','afrutado','especias','acidez']

    print(cats)

    ref_obj = request.get_json(force=True)
    ref_vector = __translate_obj_param__(ref_obj)
    print(ref_vector)

    min = 10000;
    selectedId = -1;

    for i,beer in enumerate(self.matrix):
        dif = 0;

        for j,value in enumerate(beer):
            #print("COMPARO %s - %s" % (value,ref_vector[j]))
            try:
                minidif = abs(float(value)-float(ref_vector[j]));
            except Exception as e:
                #print("EXCEPT %s" % e)
                minidif = NO_VALUE_DISTANCE
            dif += minidif;
            #print("QUEDA %s %s" % (minidif,dif))

        if(dif<min):
            #print("ES MENOR %s %s" % (dif,min))
            #print("REF %s %s" % (ref_vector,beer))
            min = dif;
            selectedId = i;
        

    return json.dumps(selectedId)

if __name__=='__main__':

    input_file = csv.DictReader(open(MATRIX_FILE,"r"))

    self.matrix = []

    for row in input_file:
        aux = []
        for cat in cats:
            aux.append(row[cat])

        self.matrix.append(aux)

    app.run(debug=True)
