import requests
import json


c = '/**/ typeof _cdbi_layer_attributes_0_6 === \'function\' && _cdbi_layer_attributes_0_6({"distritos":"Usera - Villaverde","rat_10_000_2v":18.2,"casas_okupa":504});'

print("AAA -%s-" % c.split('(')[1].replace(');',''))

d = json.loads(c.split('(')[1].replace(');',''))

print(d)

base = 'https://cartocdn-gusc-d.global.ssl.fastly.net/abctest/api/v1/map/abctest@8ee82d2a@b44a4d6106682f59c55e2fe88303a29b:1535197027730/1/attributes/KK?callback=_cdbi_layer_attributes_0_6'

data = []

for i in range(1,22):

    print(i)
    url = base.replace('KK',str(i))
    print(url)
    res = requests.get(url)
    print(res.text)
    data.append(json.loads(res.text.split('(')[1].replace(');','')))


json.dump(data,open("pelayo.json","w"),indent=4)
