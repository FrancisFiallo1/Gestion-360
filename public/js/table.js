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

const getCameraRow = ({ address, mac, date }) => {
  return `
  <tr>
    <td class="border text-center px-8 py-4 text-green-500">${address}%</td>
    <td class="border text-center px-8 py-4 text-green-500">${mac}</td>
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