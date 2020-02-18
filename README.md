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




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>0</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
      <th>5</th>
      <th>6</th>
      <th>7</th>
      <th>8</th>
      <th>9</th>
      <th>...</th>
      <th>472</th>
      <th>473</th>
      <th>474</th>
      <th>475</th>
      <th>476</th>
      <th>477</th>
      <th>478</th>
      <th>479</th>
      <th>480</th>
      <th>481</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.000000</td>
      <td>0.047415</td>
      <td>0.003247</td>
      <td>0.018953</td>
      <td>0.003421</td>
      <td>0.091687</td>
      <td>0.074829</td>
      <td>0.022629</td>
      <td>0.022629</td>
      <td>0.111810</td>
      <td>...</td>
      <td>0.105950</td>
      <td>0.030003</td>
      <td>0.044675</td>
      <td>0.145143</td>
      <td>0.256348</td>
      <td>0.039177</td>
      <td>0.026858</td>
      <td>0.050713</td>
      <td>0.024794</td>
      <td>0.049222</td>
    </tr>
    <tr>
      <th>1</th>
      <td>0.047415</td>
      <td>0.000000</td>
      <td>0.028834</td>
      <td>0.012647</td>
      <td>0.050154</td>
      <td>0.063655</td>
      <td>0.053232</td>
      <td>0.010847</td>
      <td>0.010847</td>
      <td>0.095622</td>
      <td>...</td>
      <td>0.086773</td>
      <td>0.020033</td>
      <td>0.032089</td>
      <td>0.082647</td>
      <td>0.239943</td>
      <td>0.027402</td>
      <td>0.062483</td>
      <td>0.117934</td>
      <td>0.015956</td>
      <td>0.014698</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0.003247</td>
      <td>0.028834</td>
      <td>0.000000</td>
      <td>0.011132</td>
      <td>0.007807</td>
      <td>0.082056</td>
      <td>0.057230</td>
      <td>0.011863</td>
      <td>0.011863</td>
      <td>0.104905</td>
      <td>...</td>
      <td>0.093416</td>
      <td>0.016190</td>
      <td>0.033315</td>
      <td>0.123624</td>
      <td>0.250812</td>
      <td>0.025874</td>
      <td>0.028131</td>
      <td>0.058189</td>
      <td>0.012319</td>
      <td>0.028870</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0.018953</td>
      <td>0.012647</td>
      <td>0.011132</td>
      <td>0.000000</td>
      <td>0.015547</td>
      <td>0.063519</td>
      <td>0.058663</td>
      <td>0.010086</td>
      <td>0.010086</td>
      <td>0.080221</td>
      <td>...</td>
      <td>0.077451</td>
      <td>0.026505</td>
      <td>0.017011</td>
      <td>0.079057</td>
      <td>0.225650</td>
      <td>0.022433</td>
      <td>0.040835</td>
      <td>0.067101</td>
      <td>0.020558</td>
      <td>0.024629</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0.003421</td>
      <td>0.050154</td>
      <td>0.007807</td>
      <td>0.015547</td>
      <td>0.000000</td>
      <td>0.093026</td>
      <td>0.079839</td>
      <td>0.028052</td>
      <td>0.028052</td>
      <td>0.104384</td>
      <td>...</td>
      <td>0.097089</td>
      <td>0.041824</td>
      <td>0.036260</td>
      <td>0.128222</td>
      <td>0.249017</td>
      <td>0.040898</td>
      <td>0.033240</td>
      <td>0.039917</td>
      <td>0.036607</td>
      <td>0.052592</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>477</th>
      <td>0.039177</td>
      <td>0.027402</td>
      <td>0.025874</td>
      <td>0.022433</td>
      <td>0.040898</td>
      <td>0.040726</td>
      <td>0.029397</td>
      <td>0.010698</td>
      <td>0.010698</td>
      <td>0.044549</td>
      <td>...</td>
      <td>0.032916</td>
      <td>0.021580</td>
      <td>0.016716</td>
      <td>0.050831</td>
      <td>0.149350</td>
      <td>0.000000</td>
      <td>0.026939</td>
      <td>0.048856</td>
      <td>0.016969</td>
      <td>0.029919</td>
    </tr>
    <tr>
      <th>478</th>
      <td>0.026858</td>
      <td>0.062483</td>
      <td>0.028131</td>
      <td>0.040835</td>
      <td>0.033240</td>
      <td>0.049601</td>
      <td>0.086540</td>
      <td>0.025646</td>
      <td>0.025646</td>
      <td>0.051417</td>
      <td>...</td>
      <td>0.070806</td>
      <td>0.045837</td>
      <td>0.062186</td>
      <td>0.114410</td>
      <td>0.136284</td>
      <td>0.026939</td>
      <td>0.000000</td>
      <td>0.045937</td>
      <td>0.030399</td>
      <td>0.069017</td>
    </tr>
    <tr>
      <th>479</th>
      <td>0.050713</td>
      <td>0.117934</td>
      <td>0.058189</td>
      <td>0.067101</td>
      <td>0.039917</td>
      <td>0.102068</td>
      <td>0.084820</td>
      <td>0.072307</td>
      <td>0.072307</td>
      <td>0.069321</td>
      <td>...</td>
      <td>0.050673</td>
      <td>0.091401</td>
      <td>0.048418</td>
      <td>0.099959</td>
      <td>0.157469</td>
      <td>0.048856</td>
      <td>0.045937</td>
      <td>0.000000</td>
      <td>0.088857</td>
      <td>0.110005</td>
    </tr>
    <tr>
      <th>480</th>
      <td>0.024794</td>
      <td>0.015956</td>
      <td>0.012319</td>
      <td>0.020558</td>
      <td>0.036607</td>
      <td>0.060153</td>
      <td>0.040360</td>
      <td>0.004062</td>
      <td>0.004062</td>
      <td>0.092834</td>
      <td>...</td>
      <td>0.082440</td>
      <td>0.003796</td>
      <td>0.040091</td>
      <td>0.112092</td>
      <td>0.224286</td>
      <td>0.016969</td>
      <td>0.030399</td>
      <td>0.088857</td>
      <td>0.000000</td>
      <td>0.021496</td>
    </tr>
    <tr>
      <th>481</th>
      <td>0.049222</td>
      <td>0.014698</td>
      <td>0.028870</td>
      <td>0.024629</td>
      <td>0.052592</td>
      <td>0.107969</td>
      <td>0.059386</td>
      <td>0.024082</td>
      <td>0.024082</td>
      <td>0.125342</td>
      <td>...</td>
      <td>0.090604</td>
      <td>0.021840</td>
      <td>0.042406</td>
      <td>0.096877</td>
      <td>0.265432</td>
      <td>0.029919</td>
      <td>0.069017</td>
      <td>0.110005</td>
      <td>0.021496</td>
      <td>0.000000</td>
    </tr>
  </tbody>
</table>
<p>482 rows × 482 columns</p>
</div>



## TO DO

Parse recommender_df as a dictionary where:
    - Each index is key and values are:
        Columnnames values in row, except the one corresponding to the principal diagonal of matrix. 
        Ordered by (add option for descending/ascending)


```python
#For instance for index 1, we should obtain all values except column 1 ordered asc
recommendations_example = pd.DataFrame(recommender_df[1].sort_values(ascending=True))
recommendations_example #value 1 should not appear
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>0.000000e+00</td>
    </tr>
    <tr>
      <th>454</th>
      <td>1.110223e-16</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1.084706e-02</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1.084706e-02</td>
    </tr>
    <tr>
      <th>461</th>
      <td>1.154931e-02</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>430</th>
      <td>4.736606e-01</td>
    </tr>
    <tr>
      <th>256</th>
      <td>4.780530e-01</td>
    </tr>
    <tr>
      <th>178</th>
      <td>4.815789e-01</td>
    </tr>
    <tr>
      <th>205</th>
      <td>4.880580e-01</td>
    </tr>
    <tr>
      <th>187</th>
      <td>5.017451e-01</td>
    </tr>
  </tbody>
</table>
<p>482 rows × 1 columns</p>
</div>


