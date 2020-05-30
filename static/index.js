// Stuff expected to be present in global context:
// - rangeSlider: https://github.com/Stryzhevskyi/rangeSlider
// - brewingSteps: custom JSON
// - Chart: https://www.chartjs.org/

const guess = (attributes) => {
  // Makeup payload body bc server expects an array of objects
  // TODO make server and client to agree on payload spec
  const body = []
  getAttributeIds().forEach(key => {
    body.push({
      [key]: attributes[key] || ''
    })
  })
  console.log('Request recommendation for', body)

  // TODO try async/await
  fetch('/guess', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(id => {
      // Get beer info (the selected one, via attribues)
      fetch(`/beers/${id}`)
        .then(response => response.json())
        .then(data => {     
          displayBeerInfo('selection', id, data)
          // display result: it may show a flash effect until recommendations
          // are filled...
          document.getElementById('result').classList.remove('is-hidden')
        })
      // Get recommendations and display data
      fetch(`/beers/${id}/recommendations`)
        .then(response => response.json())     
        .then(data => {
          // Get just 3 beers from the recommendation
          Object.values(data.beerID).slice(0, 3).forEach((id, index) => {
            getRecommendation(id, index)
          })          
        })
    })
}

const getRecommendation = (beerId, index) => {
  fetch(`/beers/${beerId}`)
  .then(response => response.json())
  .then(data => {
    displayBeerInfo(`recommendation-${index}`, beerId, data)
    drawRadar(`recommendation-${index}`, beerId, data)
  })
}

const drawRadar = (parentDomId, beerId, data) => {
  const parent = document.getElementById(parentDomId)
  const canvas = parent.querySelector('.radar')

  // Labels and radar data must be in sync      
  const labels = getAttributes().map(attr => attr.name)
  
  // Server response is a little bit weird, each attribute is an Object 
  // with the beer ID as key, that's why we need to pass it here as argument
  // and re-map the data before drawing the chart
  const radarData = getAttributeIds().map((key) => {
    return data[key][beerId] // beware id == beer, key == attribute
  })

  var myRadarChart = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: '#F79256',
        borderColor: '#FBD1A2',
        data: radarData
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        scaleLabel: {
          display: false
        },
        gridLines: {
          display: false
        }
      },
    }
  });
}

const displayBeerInfo = (parentDomId, beerId, data) => {
  const parent = document.getElementById(parentDomId)
  const title = parent.querySelector('.title')
  const description = parent.querySelector('.description')
  title.innerHTML = data.name
  description.innerHTML = data.descripcion[beerId]
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

const drawHistograms = () => {
  const canvas = document.querySelectorAll('.attribute__control canvas')
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
          intersect: false,
          custom: function(tooltip) {
            if (!tooltip) {
              return
            }
            // disable displaying the color box
            tooltip.displayColors = false
          },
          callbacks: {
            label: function(tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label || '';
              return `${tooltipItem.yLabel} cervezas con ${label}: ${tooltipItem.xLabel}`
            },
            title: () => {} // remove top title
          },          
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

  var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    cssMode: true,
    preventClicks: false,

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Custom pagination, TODO add brewing step names instead of indexes
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class="${className}">${index +1}</span>`
      }
    },

    on: {
      init: function() {
        setupRangeSliders()
        setupGuessHandler()
        drawHistograms()      
      }
    }
  })
});

// Utility method to work with brewing steps spec, it flattens 
// all attributes to an array
const getAttributes = () => {
  return [].concat.apply([], brewingSteps.map((step) => step.attributes))
}

// Utility method to get attribute keys as an array
const getAttributeIds = () => {
  return getAttributes().map(attr => attr.id)
}

