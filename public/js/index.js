const socket = io();

renderCharts()

const filterList = document.getElementById('filterList');

const setFilter = function (data) {
  const unique = [...new Set(data.map(item => item.device))];
  filterElements = '';
  unique.forEach(deviceId => {
    filterElements += getFilterItem(deviceId);
  });
  filterList.innerHTML = filterElements;
}

// when get sensor data
socket.on('sensor_data', (data) => {
  
  
  setFilter(data);
  const chartsData = data.slice(-20); // to show the last 20 elements in the charts

  updateLineCharts(chartsData);
  renderDataTable(data.reverse());
  if (parseFloat(data[data.length - 1].smoke_level) > 1500) {
    renderNotification('Humo Detectado',`Hay presencia de humo en el dispositivo ${data[data.length - 1].device}`);
  }
});

socket.on('sensor_camera_data', (data) => {
  renderCameraDataTable(data.reverse());
});

socket.on('sensor_transfer_data', (data) => {
  // console.log(data);
  const chartsData = data.slice(-20); // to show the last 20 elements in the charts

  updateTransferLineCharts(chartsData);
});

// let cont = 0;

// when get sensor ultrasonic data
socket.on('sensor_ultrasonic_data', (data) => {

  // console.log(data);
  
  const chartData = data.at(-1); // to show the last element
  
  updateDoughnutChart(chartData);

  if (parseFloat(data[data.length - 1].tank_value) > 1000) {
    renderNotification('Combustible en Reserva','Combustible del generador en reserva, por favor suministrar combustible lo antes posible');
  }

  const consumido = parseFloat(data[0].litros_out) - parseFloat(data[data.length - 1].litros_out);
  if (data[data.length - 1].litros_out !== data[0].litros_out && consumido > 0.05 && planta.style.display !== 'flex') {
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



const filterButton = document.getElementById('dropdownDefault');
const dropdownContainer = document.getElementById('dropdown');

const toogleDropdown= function() {
  if (dropdownContainer.style.display === "none") {
    dropdownContainer.style.display = "block";
  } else {
    dropdownContainer.style.display = "none";
  }
};

filterButton.onclick = toogleDropdown;
