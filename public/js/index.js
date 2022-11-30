const socket = io();

renderCharts()

// when get sensor data
socket.on('sensor_data', (data) => {
  
  // console.log(data);

  const chartsData = data.slice(-20); // to show the last 20 elements in the charts

  updateLineCharts(chartsData);
  renderDataTable(data.reverse());
  if (parseFloat(data[data.length - 1].smoke_level) > 1000) {
    // alert(`Hay presencia de humo en el dispositivo ${data[data.length - 1].device}`);
  }
});

// when get sensor ultrasonic data
socket.on('sensor_ultrasonic_data', (data) => {

  // console.log(data);
  
  const chartData = data.at(-1); // to show the last element
  
  updateDoughnutChart(chartData);  
  if (parseFloat(data[data.length - 1].tank_value) > 1000) {
    // alert(`Combustible del generador en reserva, por favor suministrar combustible lo antes posible`);
  }
});

// set the modal menu element
const settingsButton = document.getElementById('settings-button');
const modal = document.getElementById('defaultModal');

const toogleModel = function() {
  if (modal.style.display === "none") {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
}

settingsButton.onclick = toogleModel;



