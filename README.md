# Welcome to mahoudata
> Library for recommending Mahou-San Miguel beers


This file provides a brief introduction to the usage of mahoudata library

## Install

`pip install -e .`

# How to use

```python
from mahoudata.core import *

from pandas_profiling import ProfileReport
from sklearn.preprocessing import MinMaxScaler
from scipy.spatial.distance import pdist, squareform
from pandas_profiling import ProfileReport

import pandas as pd
import nltk
```

## Read data

```python
df = pd.read_csv("./data/dataset-datathon.csv")
```

## Explore using data profiling

```python
profile = ProfileReport(df, title='Pandas Profiling Report', html={'style':{'full_width':True}})
profile.to_file(output_file="./reports/raw_data_profile.html") #Check reports folder

# Uncomment the following line for an interactive visualization
#profile.to_notebook_iframe() ## Explore using data profiling
```

## Run Recommender

First step is to create a context. At the moment it only defines the column names of numeric variables. Further options for the program might be added here.

```python
context = {'numeric_cols' : ['lupulo_afrutado_citrico', 
                             'lupulo_floral_herbal','amargor', 'color', 
                             'maltoso', 'licoroso', 'afrutado', 'especias','acidez']
}
```

Next step is to select the type of recommender we want to run. 

For the moment, only `numeric` type has been partially developed. The `numeric` strategy computes cosine distances among numeric vectors.

```python
f = RecommenderStrategyFactory(context)

strategy = f.createStrategy('numeric')

```

Then we can use the `model_builder` function to prepare data for the recommender algorithm:

```python
datamodel = strategy.model_builder(df)
```


    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    <ipython-input-14-8a70658680c0> in <module>
    ----> 1 datamodel = strategy.model_builder(df)
    

    /usr/local/github/mahoudata/mahoudata/core.py in model_builder(self, dataframe)
         70         preprocessor = PreProcess(self.ctx)
         71         df = preprocessor.cols_munging(dataframe, fillna = True)
    ---> 72         df = preprocessor.scale_cols(df)
         73         return df
         74 


    /usr/local/github/mahoudata/mahoudata/core.py in scale_cols(self, dataframe)
         37     def scale_cols(self, dataframe):
         38         "Min Max scaler for numeric columns"
    ---> 39         scaler = MinMaxScaler()
         40         df_scaled = pd.DataFrame(
         41             scaler.fit_transform(dataframe[self.ctx['numeric_cols']]),


    NameError: name 'MinMaxScaler' is not defined


For executing the recommender algorithm we can run:

```python
recommender_df = strategy.exec_strategy(datamodel)
```

If we explore recommender_df we can see that at this stage, it is a squared symmetric matrix.

```python
recommender_df
```
