from mahoudata.core import *
import pandas

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
