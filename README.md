# Welcome to mahoudata
> Library for recommending Mahou-San Miguel beers


This file provides a brief introduction to the usage of mahoudata library. Development has been carried out by using [nbdev](https://nbdev.fast.ai/tutorial/)

## Install

Git clone: https://github.com/pelayoarbues/mahoudata.git

For using the library in other projects:

`pip install -e .`

# How to use

```python
from mahoudata.core import *

from pandas_profiling import ProfileReport
import pandas as pd
```

## Read data

```python
df = pd.read_csv("./data/dataset-datathon.csv")
```

## Explore using data profiling

The following cell generates a Exploratory Data Analysis report in the `reports` folder

```python
profile = ProfileReport(df, title='Pandas Profiling Report', html={'style':{'full_width':True}})
profile.to_file(output_file="./reports/raw_data_profile.html") #Check reports folder

# Uncomment the following line for an interactive visualization
#profile.to_notebook_iframe() ## Explore using data profiling
```

## Remove duplicates
According to profile there are 60% duplicates. Get rid of them.


```python
df_clean = df.drop_duplicates(
subset = df.columns.difference(['vajilla'])
)
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
datamodel = strategy.model_builder(df_clean)
```


    ---------------------------------------------------------------------------

    KeyError                                  Traceback (most recent call last)

    ~/anaconda3/envs/mahoudata/lib/python3.6/site-packages/pandas/core/indexes/base.py in get_loc(self, key, method, tolerance)
       2645             try:
    -> 2646                 return self._engine.get_loc(key)
       2647             except KeyError:


    pandas/_libs/index.pyx in pandas._libs.index.IndexEngine.get_loc()


    pandas/_libs/index.pyx in pandas._libs.index.IndexEngine.get_loc()


    pandas/_libs/hashtable_class_helper.pxi in pandas._libs.hashtable.PyObjectHashTable.get_item()


    pandas/_libs/hashtable_class_helper.pxi in pandas._libs.hashtable.PyObjectHashTable.get_item()


    KeyError: 'temperatura'

    
    During handling of the above exception, another exception occurred:


    KeyError                                  Traceback (most recent call last)

    <ipython-input-7-6d779bd24930> in <module>
    ----> 1 datamodel = strategy.model_builder(df_clean)
    

    /usr/local/github/mahoudata/mahoudata/core.py in model_builder(self, dataframe)
         98     def model_builder(self, dataframe):
         99         preprocessor = PreProcess(self.ctx)
    --> 100         df = preprocessor.cols_munging(dataframe)
        101         df = preprocessor.fill_na(df, 'median')
        102         df = preprocessor.scale_cols(df)


    /usr/local/github/mahoudata/mahoudata/core.py in cols_munging(self, dataframe, fillna)
         41 
         42         #Removes c from
    ---> 43         df['temperatura'] = df['temperatura'].replace('c', '')
         44 
         45         return df


    ~/anaconda3/envs/mahoudata/lib/python3.6/site-packages/pandas/core/frame.py in __getitem__(self, key)
       2798             if self.columns.nlevels > 1:
       2799                 return self._getitem_multilevel(key)
    -> 2800             indexer = self.columns.get_loc(key)
       2801             if is_integer(indexer):
       2802                 indexer = [indexer]


    ~/anaconda3/envs/mahoudata/lib/python3.6/site-packages/pandas/core/indexes/base.py in get_loc(self, key, method, tolerance)
       2646                 return self._engine.get_loc(key)
       2647             except KeyError:
    -> 2648                 return self._engine.get_loc(self._maybe_cast_indexer(key))
       2649         indexer = self.get_indexer([key], method=method, tolerance=tolerance)
       2650         if indexer.ndim > 1 or indexer.size > 1:


    pandas/_libs/index.pyx in pandas._libs.index.IndexEngine.get_loc()


    pandas/_libs/index.pyx in pandas._libs.index.IndexEngine.get_loc()


    pandas/_libs/hashtable_class_helper.pxi in pandas._libs.hashtable.PyObjectHashTable.get_item()


    pandas/_libs/hashtable_class_helper.pxi in pandas._libs.hashtable.PyObjectHashTable.get_item()


    KeyError: 'temperatura'


For executing the recommender algorithm we can run:

```python
recommender_df = strategy.exec_strategy(datamodel)
```

If we explore recommender_df we can see that at this stage, it is a squared symmetric matrix.

```python
recommender_df
```

## GET TOP RECOMMENDATIONS

```python
RecommenderHelper.get_top_recommendations(recommender_df, beerID=1, topk=6, sort_asc=True)
```


    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    <ipython-input-8-b48ba47e7fd7> in <module>
    ----> 1 RecommenderHelper.get_top_recommendations(recommender_df, beerID=1, topk=6, sort_asc=True)
    

    NameError: name 'recommender_df' is not defined


## TO DO

Improve RecommenderHelper.get_top_recommendations by parsing the dataframe as a dictionarys
