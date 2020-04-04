from mahoudata.core import *
from pandas_profiling import ProfileReport
import pandas as pd
from flask import Flask,request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

def get_top_recommendations(rec_dataframe, beerID , topk = 5, sort_asc = True):
    recommendations = pd.DataFrame(rec_dataframe[beerID].sort_values(ascending=sort_asc))
    recommendations = recommendations.drop([beerID], axis=0)
    recommendations.reset_index(level=0, inplace=True)
    recommendations.columns = ['beerID','cosine_dist']
    rec = recommendations[0:topk]

    return rec


@app.route('/')
def hello_world():
    beer_id = int(request.args.get('id'))
    print("LLEGA %s" % request.args.get('id'))
    df = pd.read_csv("./data/dataset-datathon.csv")

    context = {'numeric_cols' : ['lupulo_afrutado_citrico',
                                 'lupulo_floral_herbal','amargor', 'color',
                                 'maltoso', 'licoroso', 'afrutado', 'especias','acidez']
    }
    
    f = RecommenderStrategyFactory(context)
    
    strategy = f.createStrategy('numeric')
    
    datamodel = strategy.model_builder(df)
    
    recommender_df = strategy.exec_strategy(datamodel)
    
    aa = get_top_recommendations(recommender_df,beer_id)

    return aa.to_json()


if __name__=='__main__':


    app.run(debug=True)
