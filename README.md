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

## TO DO

Improve RecommenderHelper.get_top_recommendations by parsing the dataframe as a dictionarys

# UI

Prerequisites: Node.js and NPM

1. `npm i`
2. Check `package.json` tasks

## UI - Brewing spec

Use `npm run brewing-spec-metadata` to get useful values from the dataset to build the UI. For example: given an attribute, get its max and min values to use them as range values for the attribute control selector in the UI.

## API NOTES

/guess : 
    method -> POST
    params -> ref_vector(Vector obtained from user through form. Must keep cats order in roder to calculate distance properly)
    sample call -> curl -XPOST 'http://localhost:5000/guess' -d '[1,2,3,4,5,1,2,3,4,5]'
    sample response -> ["0.04", "2.2", "0.3", "3", "1.4", "1", "0.5", "0.3", "", ""]

Test minimum values request:

```
curl -XPOST 'http://localhost:5000/guess' -d '[{"graduacion":""},{"lupulo_afrutado_citrico":0.1},{"lupulo_floral_herbal":0.1},{"amargor":0.8},{"color":0.3},{"maltoso":0.2},{"licoroso":0.3},{"afrutado":0.1},{"especias":0.3},{"acidez":0.1}]'
```

Test max values request:

```
curl -XPOST 'http://localhost:5000/guess' -d '[{"graduacion":""},{"lupulo_afrutado_citrico":3.5},{"lupulo_floral_herbal":2.6},{"amargor":4.4},{"color":5},{"maltoso":3.9},{"licoroso":3.7},{"afrutado":3.4},{"especias":3.7},{"acidez":4.4}]'
```