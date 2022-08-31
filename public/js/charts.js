const baseOptions = {
    plugins: {
        legend: {
            display: false
        }
    },
    layout: {
        padding: 10
    },
    animation: false,
}

const lineCharts = [
    // Humidity chart
    {
        elementID: 'humidity_chart',
        dataProp: 'humidity',
        instance: null,
        type: 'line',
        baseDataSet: {
            label: 'Humedad',
            backgroundColor: '#2563eb',
            borderColor: '#2563eb',
            data: [],
            tension: 0.1
        },
        options: baseOptions
    },
    // Temperature_c chart
    {
        elementID: 'temperature_c_chart',
        dataProp: 'temperature_c',
        type: 'line',
        instance: null,
        baseDataSet: {
            label: 'Temperatura °C',
            backgroundColor: '#4f46e5',
            borderColor: '#4f46e5',
            data: [],
            tension: 0.1
        },
        options: baseOptions
    },
    // Temperature_F chart
    {
        elementID: 'temperature_f_chart',
        dataProp: 'temperature_f',
        type: 'line',
        instance: null,
        baseDataSet: {
            label: 'Temperatura °F',
            backgroundColor: '#059669',
            borderColor: '#059669',
            data: [],
            tension: 0.1,
        },
        options: baseOptions
    },
    // Smoke chart
    {
        elementID: 'smoke_chart',
        dataProp: 'smoke_level',
        type: 'line',
        instance: null,
        baseDataSet: {
            label: 'Humo',
            backgroundColor: '#059669',
            borderColor: '#059669',
            data: [],
            tension: 0.1,
        },
        options: baseOptions
    },
]

const doughnutChart = {
    elementID: 'fuil_chart',
    instance: null,
    type: 'doughnut',
    data: {
        labels: [
          'Volumen restante',
          'Volumen combustible',
        ],
        datasets: [{
          label: 'Volumen Combustible',
          data: [0,0],
          backgroundColor: [
            '#c9c9c9',
            '#d49802',
          ],
          hoverOffset: 4
        }]
    },
    options: {
        animation: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }],
        },
    }
}
  
// render all charts
const renderCharts = () => {

    // render line charts
    lineCharts.forEach(chart => {
        const chartInit= new Chart(
            document.getElementById(chart.elementID), 
            { 
                type: chart.type, 
                data: { 
                    labels: [], 
                    datasets: [chart.baseDataSet]  
                },
                options: chart.options
            }
        );
        chart.instance = chartInit
    });
    
    // render doughnut chart
    doughnutChart.instance = new Chart(document.getElementById(doughnutChart.elementID), doughnutChart);
}
    
// update an individual chart
const updateChart = (chart, labels, data) => {
    chart.data.labels = labels;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}
  
// update every line chart
const updateLineCharts = (data) => {
    const dates = data.map(data => { return moment(data.date).format('HH:mm:ss') });
    lineCharts.forEach(chart => {
        const messure = data.map(data => { return data[chart.dataProp] });
        updateChart(chart.instance, dates, messure)
    })
}

// update doughnut chart 
const updateDoughnutChart = (data) => {
    let dataChart = [100 - data.percent, data.percent]
    if (data.percent > 100) {
        dataChart = [0, 100];
    }
    if (data.percent < 0) {
        dataChart = [100, 0];
    }
    updateChart(doughnutChart.instance, doughnutChart.data.labels, dataChart)
}