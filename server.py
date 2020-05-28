import os
from mahoudata.core import *
from pandas_profiling import ProfileReport
import pandas as pd
from flask import Flask, request, render_template, url_for, json
from flask_cors import CORS
from recommender import *

import json
import csv


self = {}
self['cats'] = ['graduacion','lupulo_afrutado_citrico','lupulo_floral_herbal','amargor','color','maltoso','licoroso','afrutado','especias','acidez']
self['MATRIX_FILE'] = './data/dataset-datathon.csv'
self['NAMES_FILE'] = './data/fakeNames.csv'
self['NO_VALUE_DISTANCE'] = 5

app = Flask(__name__)
CORS(app)
# TODO just for dev
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/beers')
def beers():
    m = json.loads(get_beers())
    for i,b in enumerate(m['data']):
        b['Name'] = self['names'][i]

    return m


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

    for cat in self['cats']:
        for subunit in obj:
            if cat in subunit:
                vector.append(subunit[cat])    

    return vector


@app.route('/guess',methods=['POST'])
def guess():


    ref_obj = request.get_json(force=True)
    ref_vector = __translate_obj_param__(ref_obj)
    print(ref_vector)

    min = 10000;
    selectedId = -1;

    for i,beer in enumerate(self['matrix']):
        dif = 0;

        for j,value in enumerate(beer):
            #print("COMPARO %s - %s" % (value,ref_vector[j]))
            if float(value)!=-1 and isinstance(ref_vector[j], float):
                minidif = abs(float(value)-float(ref_vector[j]));
            else:
                #print("EXCEPT %s" % e)
                minidif = self['NO_VALUE_DISTANCE']

            dif += minidif;
            #print("QUEDA %s %s" % (minidif,dif))

        if(dif<min):
            #print("ES MENOR %s %s" % (dif,min))
            #print("REF %s %s" % (ref_vector,beer))
            min = dif;
            selectedId = i;
        

    print("SELECTED %s" % selectedId)
    print("VALUES %s" % (self['matrix'][selectedId]))
    print("OTROS  %s" % (ref_vector))

    return json.dumps(selectedId)

if __name__=='__main__':

    input_file = csv.DictReader(open(self['MATRIX_FILE'],"r"))

    self['matrix'] = []

    for row in input_file:
        aux = []
        for cat in self['cats']:
            try:
                value = float(row[cat])
            except Exception as e:
                value = -1.0

            aux.append(value)
            #aux.append(row[cat])

        self['matrix'].append(aux)

    input_file_names = csv.DictReader(open(self['NAMES_FILE'],"r"))

    self['names'] = []

    for row in input_file_names:
        self['names'].append(row['Name'])

    app.run(debug=True)
