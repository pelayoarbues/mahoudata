
const server_spec = [
  'graduacion',
  'lupulo_afrutado_citrico',
  'lupulo_floral_herbal',
  'amargor',
  'color',
  'maltoso',
  'licoroso',
  'afrutado',
  'especias',
  'acidez'
]

const guess = (attributes) => {
  // Server needs all the attributes existing in the dataset, to be present 
  // in the request, but some of them  may be missing in user selection 
  // (i.e. "graduacion"), so we have to complete the payload before sending it
  const body = []
  server_spec.forEach(key => {
    body.push({
      [key]: attributes[key] || ''
    })
  })
  console.log('Request recommendation for', body)
  
  fetch('/guess', {
    method: 'POST',
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Got response', data)
    drawRadar(data)
  })
}

const drawRadar = (data) => {
  // Ok, now radar chart expects an array of objects... just the opposite,
  // so we have to rebuild the response
  const baseData = []
  server_spec.forEach((key, index) => {
    baseData.push({
      group: 'Base',
      area: key,
      value: data[index] // this won't work if server response values aren't sorted
    })
  })
  RadarChart.draw('#radar', [baseData], {})
}

const setupGuessHandler = () => {
  const button = document.querySelector('#guess')
  button.addEventListener('click', () => {
    const inputs = document.querySelectorAll('input')
    const attributes = {}
    inputs.forEach(input => attributes[input.name] = parseFloat(input.value))
    guess(attributes)
  })
}

const logging = () => {
  // Quick and dirty logging to check range selection is working
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (e) => {
      console.log(e.target.name, e.target.value)
    })
  })
}

const test = () => {
  const canvas = document.querySelectorAll('canvas')

  // Expect `brewingSteps` to be in global context
  const attributes = brewingSteps.map((item) => item.attributes).flat()

  canvas.forEach(item => {
    // Get the actual attribute id from canvas identifier
    const attributeId = item.id.replace('attribute-', '')
    const attribute = attributes.find(item => item.id === attributeId)
    console.log(attribute)

    // expect Chart to be in global context
    const chart = new Chart(item.getContext('2d'), {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
        labels: eval(attribute.distribution.values), // :P @see BE
        datasets: [{
          label: attribute.name, 
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: eval(attribute.distribution.count)
        }]
      },

      // Configuration options go here
      options: {}
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  logging()
  setupGuessHandler()

  test()
});