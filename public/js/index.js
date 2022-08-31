const socket = io();

renderCharts()

// when get sensor data
socket.on('sensor_data', (data) => {
  
  console.log(data);

  const chartsData = data.slice(-20); // to show the last 20 elements in the charts

  updateLineCharts(chartsData);
  renderDataTable(data.reverse());
  if (data.smoke_level > 20) {
    alert(`Hay Fuedo en el dispositivo ${data.mac}`);
  }
});

// when get sensor ultrasonic data
socket.on('sensor_ultrasonic_data', (data) => {

  console.log(data);
  
  const chartData = data.at(-1); // to show the last element
  
  updateDoughnutChart(chartData);
  
});