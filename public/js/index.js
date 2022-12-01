const socket = io();

renderCharts()

// when get sensor data
socket.on('sensor_data', (data) => {
  
  // console.log(data);

  const chartsData = data.slice(-20); // to show the last 20 elements in the charts

  updateLineCharts(chartsData);
  renderDataTable(data.reverse());
  if (parseFloat(data[data.length - 1].smoke_level) > 1000) {
    renderNotification('Humo Detectado',`Hay presencia de humo en el dispositivo ${data[data.length - 1].device}`);
  }
});

socket.on('sensor_camera_data', (data) => {
  console.log(data);
  renderCameraDataTable(data.reverse());
});

socket.on('sensor_transfer_data', (data) => {
  // console.log(data);
  const chartsData = data.slice(-20); // to show the last 20 elements in the charts

  updateTransferLineCharts(chartsData);
});

let cont = 0;

// when get sensor ultrasonic data
socket.on('sensor_ultrasonic_data', (data) => {

  // console.log(data);
  
  const chartData = data.at(-1); // to show the last element
  
  updateDoughnutChart(chartData);
  if (cont < 2) {
    cont++;
    renderNotification('Combustible en Reserva','Combustible del generador en reserva, por favor suministrar combustible lo antes posible');
  }

  if (parseFloat(data[data.length - 1].tank_value) > 1000) {
    renderNotification('Combustible en Reserva','Combustible del generador en reserva, por favor suministrar combustible lo antes posible');
  }

  if (data[data.length - 1].litros_out > 0.05 && planta.style.display === 'flex') {
    renderNotification('El Combustible esta siendo hurtado','Ha habido consumo de Combustible del generador estando apagado');
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

// set the bell element
const bellButton = document.getElementById('notifications-button');
const notification = document.getElementById('defaultNotification');

const toogleNotifCenter = function() {
  if (notification.style.display === "none") {
    notification.style.display = "block";
  } else {
    notification.style.display = "none";
  }
}

bellButton.onclick = toogleNotifCenter;

const btnCloseElement = document.getElementById('btnClose');
btnCloseElement.addEventListener('click', toogleNotifCenter(), false);


