
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
  // Attributes is an object of key (name of the attribute) and value, but 
  // server only accepts an array of values in a particular order. Besides 
  // some attributes may be missing (i.e. "graduacion").
  const body = []
  server_spec.forEach(key => {
    const attributeValue = attributes[key] || ''
    body.push(attributeValue)
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
    inputs.forEach(input => attributes[input.name] = input.value)
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

document.addEventListener("DOMContentLoaded", () => {
  logging()
  setupGuessHandler()
});