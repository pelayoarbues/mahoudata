const _ = require('lodash')
const csv = require('csvtojson')

const csvDatasetPath = './data/dataset-datathon.csv'

async function process() {
  const dataset = await csv().fromFile(csvDatasetPath)
  const result = []
  const attributes = ['lupulo_afrutado_citrico', 'lupulo_floral_herbal',
    'amargor', 'color', 'maltoso', 'licoroso', 'afrutado', 'especias','acidez']
  
  attributes.forEach(attribute => {    
    // Get values for attribute, clean up `null` and empty
    const values = _.chain(dataset)
      .map(attribute)
      .remove((value) => !_.isEmpty(value) && !_.isNull(value))
      .map(parseFloat)
      .uniq()
      .value()

    // Get attribute distribution values, useful for UI controls
    result.push({
      name: attribute,
      max: _.max(values),
      min: _.min(values),
      mean: _.round(_.mean(values), 1)
    })

  })

  // Display: cc results into `brewing-spec.json`
  console.log(JSON.stringify(result))
}

process()
