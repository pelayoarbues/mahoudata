from mahoudata.core import *
import os
import pandas
import json
import numpy as np

SITE_ROOT = os.path.realpath(os.path.dirname(__file__))

# Load dataset
# TODO not sure about python scope, but this works: it makes dataset available
# to all methods
dataset = pandas.read_csv('./data/dataset-datathon.csv')

# TODO explore classes stuff, `get_top_recommendations` should be private

def get_top_recommendations(rec_dataframe, beer_id, topk = 5, sort_asc = True):
  beerID = beer_id # preferred case style 
  recommendations = pandas.DataFrame(rec_dataframe[beerID].sort_values(ascending=sort_asc))
  recommendations = recommendations.drop([beerID], axis=0)
  recommendations.reset_index(level=0, inplace=True)
  recommendations.columns = ['beerID','cosine_dist']
  rec = recommendations[0:topk]

  return rec

def get_recommendations(beer_id):  
  # Setup context: not sure about this; guess: it somewhat defines the data
  # structure for the recommendation system
  context = {'numeric_cols' : ['lupulo_afrutado_citrico',
                              'lupulo_floral_herbal','amargor', 'color',
                              'maltoso', 'licoroso', 'afrutado', 'especias','acidez']
  }
  # Init recommendation system and create strategy (@see README)
  factory = RecommenderStrategyFactory(context)
  strategy = factory.createStrategy('numeric')
  datamodel = strategy.model_builder(dataset)
  dataframe = strategy.exec_strategy(datamodel)
  
  # Finally, get actual recommendations for beer_id
  return get_top_recommendations(dataframe, beer_id).to_json()

def get_beers(beer_id = None): 
  # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
  # Full dataset along with its schema
  result = dataset.to_json(orient='table')
  
  if beer_id:
    result = dataset.iloc[[beer_id]].to_json()
  
  return result

def get_brewing_spec():
  # Load brewing spec (steps and attributes)
  brewing_steps = json.load(open(os.path.join(SITE_ROOT, "data", "brewing-spec.json")))
  
  # test-code to get a sense of the dataset
  # print(dataset.describe())

  # Inspect dataset to add useful values to draw the interface  
  # Loop to get attributes [{step: { attributes: [] }}]
  for step in brewing_steps:
    for attr in step['attributes']:
      attribute_id = attr['id']

      # Selecting elements from a DataFrame as SQL
      # 1. Filter null values 
      # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.notna.html#pandas.Series.notna
      # TODO cumbersome, I'm sure there's a more straight forward way to do this
      filtered = dataset[dataset[attribute_id].notna()]

      # 2. Get max and min values and stash them to the json
      attr['max'] = filtered[attribute_id].max()      
      attr['min'] = filtered[attribute_id].min()
      attr['mean'] = round(filtered[attribute_id].mean(), 2)

      # 3. Get histogram for the current attribute
      # TODO I don't know what the fuck I'm doing but it works: 
      # pandas, numpy, ndarray to json... etc
      # https://stackoverflow.com/a/13130357
      series = pandas.Series(filtered[attribute_id])
      hist, bins = np.histogram(series)

      # Gotcha: histogram stuff to_json here, so the consumer will get it as
      # a string so it will have to "eval" it to use in JS..I couldn't find a 
      # way to do it better
      attr['distribution'] = {
        'count': pandas.Series(hist).to_json(orient='values'),
        'values': pandas.Series(bins).to_json(orient='values')
      }

  return brewing_steps