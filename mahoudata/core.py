from sklearn.preprocessing import MinMaxScaler
import pandas as pd
from scipy.spatial.distance import squareform,pdist

# AUTOGENERATED! DO NOT EDIT! File to edit: 00_core.ipynb (unless otherwise specified).

__all__ = ['PreProcess', 'RecommenderStrategyFactory', 'NumericStrategy']

# Cell
class PreProcess:
    "Preprocess class to include all data preparation functions"
    def __init__(self, ctx):
        self.ctx = ctx

    def clean_duplicates(self):
        "Clean duplicates method"
        #TODO:
        #   CHECK FOR DUPLICATES BASED ON DESCRIPTION AND ATTRIBUTES
        # REMOVE THEM
        return 1

    def cols_munging(self, dataframe, fillna = True):
        "Columns preparation method"
        #Rename column
        df = dataframe.rename(columns={"Temperatura Servicio":"temperatura"})
        #Create ID for beers
        df['beerID'] = (range(1, len(df) + 1))
        df = df.set_index(df['beerID'].astype(str))
        #Move beerID to first col
        cols = df.columns.tolist()
        cols.insert(0, cols.pop(cols.index('beerID')))
        df = df.reindex(columns= cols)

        #fillna with 0
        #TODO: Augment to replace by median/mean
        if fillna:
            df = df.fillna(0)

        return df

    def scale_cols(self, dataframe):
        "Min Max scaler for numeric columns"
        scaler = MinMaxScaler()
        df_scaled = pd.DataFrame(
            scaler.fit_transform(dataframe[self.ctx['numeric_cols']]),
                                 columns=dataframe[self.ctx['numeric_cols']].columns
            )
        return df_scaled

# Cell
class RecommenderStrategyFactory:
    "Strategy factory"
    def __init__(self, ctx):
        self.context = ctx

    def createStrategy(self, strategy):
        recommender_strategy = strategy.lower()

        if recommender_strategy == 'numeric':
            instance = NumericStrategy(self.context)

        else:
            instance = DescriptionAndNumeric(self.context)

        return instance

# Cell
class NumericStrategy:
    "Numeric based recommender system"
    def __init__(self, ctx):
        self.ctx = ctx

    def model_builder(self, dataframe):
        preprocessor = PreProcess(self.ctx)
        df = preprocessor.cols_munging(dataframe, fillna = True)
        df = preprocessor.scale_cols(df)
        return df

    def exec_strategy(self, dataframe, distance = 'cosine'):
        if distance == 'euclidean':
             recommender_df = pd.DataFrame(
             squareform(pdist(dataframe[self.ctx['numeric_cols']])),
             columns = dataframe.index.astype(str),
             index = dataframe.index
             )

        else:
            recommender_df = pd.DataFrame(
            squareform(pdist(dataframe[self.ctx['numeric_cols']], metric = 'cosine')),
            columns = dataframe.index,
            index = dataframe.index
            )

        return recommender_df
