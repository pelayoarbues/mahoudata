// Stuff expected to be present in global context:
// - rangeSlider: https://github.com/Stryzhevskyi/rangeSlider
// - brewingSpets: custom JSON
// - Chart: https://www.chartjs.org/

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

const setupRangeSliders = () => {
  document.querySelectorAll('input[type=range]').forEach(function(input) {
    rangeSlider.create(input, {
      step: 0.1,
      onSlide: function(value) {
        // Update tooltip: cumbersome DOM traversing and `input` closure
        input.rangeSlider.handle.childNodes[0].textContent = value
      }
    })
    // Weird errors when setting up value at initialization...
    input.rangeSlider.update({
      value: input.attributes.value.value
    })

    // Create tooltip for slider
    const handleEl = input.rangeSlider.handle
    const tooltip = document.createElement('div')
    tooltip.classList.add('tooltip')
    handleEl.appendChild(tooltip)
    tooltip.textContent = input.rangeSlider.value
  })
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

const drawCharts = () => {
  const canvas = document.querySelectorAll('canvas')
  const attributes = brewingSteps.map((item) => item.attributes).flat()

  canvas.forEach(item => {
    // Get the actual attribute id from canvas identifier
    const attributeId = item.id.replace('attribute-', '')
    const attribute = attributes.find(item => item.id === attributeId)
    const chart = new Chart(item.getContext('2d'), {
      type: 'line',
      data: {
        labels: eval(attribute.distribution.values), // :P @see BE
        datasets: [{
          label: attribute.name,
          backgroundColor: '#F79256',
          borderColor: '#FBD1A2',
          data: eval(attribute.distribution.count)
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: false,
        tooltips: {
          intersect: false
        },
        scales: {
          yAxes: [{
            gridLines: { display: false },
            ticks: { beginAtZero: true }
          }],
          xAxes: [{ 
            gridLines: { display: false },
            ticks: { display: false 
          }}]
        }
      }
    })
    
  })
}

document.addEventListener("DOMContentLoaded", () => {
  logging()
  setupRangeSliders()
  setupGuessHandler()
  drawCharts()
});