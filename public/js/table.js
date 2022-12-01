const getRow = ({ humidity, temperature_c, temperature_f, date }) => {

    const humidity_is_good = humidity >= 40 && humidity <= 55
    const temperature_c_is_good = temperature_c >= 20 && temperature_c <= 25 
    const temperature_f_is_good = temperature_f >= 68 && temperature_f <= 77

    const humidity_text_color = humidity_is_good ? 'text-green-500' : 'text-red-500'
    const temperature_c_text_color = temperature_c_is_good ? 'text-green-500' : 'text-red-500'
    const temperature_f_text_color = temperature_f_is_good  ? 'text-green-500' : 'text-red-500'

    return `
    <tr>
      <td class="border text-center px-8 py-4 ${humidity_text_color}">${humidity}%</td>
      <td class="border text-center px-8 py-4 ${temperature_c_text_color}">${temperature_c}</td>
      <td class="border text-center px-8 py-4 ${temperature_f_text_color}">${temperature_f}</td>
      <td class="border text-center px-8 py-4 text-green-500">${date}</td>
    </tr>
    `
}
  
const getHeaders = () => {
    return `
    <tr>
      <th class="bg-neutral-700 border text-center px-8 py-4">Humedad</th>
      <th class="bg-neutral-700 border text-center px-8 py-4">Temp. °C</th>
      <th class="bg-neutral-700 border text-center px-8 py-4">Temp. °F</th>
      <th class="bg-neutral-700 border text-center px-8 py-4">Fecha</th>
    </tr>
    `
}

const getCameraRow = ({ name, device, date }) => {
  return `
  <tr>
    <td class="border text-center px-8 py-4 text-green-500">${name}</td>
    <td class="border text-center px-8 py-4 text-green-500">${device}</td>
    <td class="border text-center px-8 py-4 text-green-500">${date}</td>
  </tr>
  `
}


const getCameraHeaders = () => {
  return `
  <tr>
    <th class="bg-neutral-700 border text-center px-8 py-4">Nombre</th>
    <th class="bg-neutral-700 border text-center px-8 py-4">Dispositivo</th>
    <th class="bg-neutral-700 border text-center px-8 py-4">Fecha</th>
  </tr>
  `
}

const getNotificationMessage = (header, message) => {
  const now = moment();
  const todayDate = moment().format('MMMM Do YYYY, h:mm:ss a');

  return`
  <div id="${header}" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold">${header}</strong>
    <span class="block sm:inline">${todayDate}</span>
    <span class="block sm:inline">${message}</span>
    <span id="${now}" class="absolute top-0 bottom-0 right-0 px-4 py-3" onclick="removeNotification('${header}')">
      <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
    </span>
  </div>
  `
}

const getFilterItem = (id) => {
  return `
  <li id="${id}">
    <div class="flex items-center">
      <input checked id="checkbox-item-2" type="checkbox" value=""
        class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
      <label for="checkbox-item-2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">${id}</label>
    </div>
  </li>
`
}

const notificationContainer = document.getElementById('notif-contain');

const renderNotification = (header, message) => {
  if (notificationContainer.textContent.includes("No hay alertas")) {
    notificationContainer.innerHTML = getNotificationMessage(header, message);
  } else {
    const notificationToPush = document.getElementById(header);
    if (!notificationContainer.contains(notificationToPush)) {
      notificationContainer.innerHTML += getNotificationMessage(header, message);
    }
  }

  bellButton.style.backgroundColor = 'yellow';
  bellButton.style.borderRadius = '60%';
}

const removeNotification = (id) => {
  const element = document.getElementById(id)
  element.remove();

  if (notificationContainer.textContent.trim() === '') {
    notificationContainer.innerHTML = "No hay alertas";
    bellButton.style.backgroundColor = '';
    bellButton.style.borderRadius = '0%';
  }
}
  
const renderDataTable = (data) => {
    const table = document.querySelector("#data-table");
    table.innerHTML = getHeaders();
    data.forEach(values => {
        const row = getRow(values);
        table.innerHTML += row;
    });
}

const renderCameraDataTable = (data) => {
  const table = document.querySelector("#camera-data-table");
  table.innerHTML = getCameraHeaders();
  data.forEach(values => {
      const row = getCameraRow(values);
      table.innerHTML += row;
  });
}
