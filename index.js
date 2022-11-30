const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const getConnection = require('./db.connection');
const { json } = require('body-parser');
const { Console } = require('console');

// get config vars env
dotenv.config({ path: './config1.env' });

// init server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));
let db = null;

const getDbConnect = async () => {
  if (!db) {
    db = await getConnection();
    console.log('new conection');
  }

  return db;
}

const formatTransferData = (data) => {
  if (data) {
    data.forEach(element => {
      splitedData = element.data.split('-')
      element.data = splitedData.reduce((acc, elem) => {
        item = elem.split(':');
        acc[item[0]] = item[1];
        return acc;
      }, {});
    });
  }
  return data;
}

// API endpoint for saving sensor data
app.get('/api/save', async (req, res) => {
  try {
    // query values of the url
    const {
      temp_c,
      temp_f,
      hum,
      mac,
      smoke,
      tank_value,
      sensor_tank_value,
      litros_in,
      litros_out,
      litros_totales,
      data_transfer
    } = req.query;
    const date = new Date();
    let data = {};
    

    // here should be saving the data
    // see docs on (https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)
    if (temp_c && temp_f && hum && smoke) {
      const sensor_data = db.collection('sensor_data');
      data = { 
        device: mac,
        humidity: hum, 
        temperature_c: temp_c, 
        temperature_f:temp_f,
        smoke_level: smoke,
        date: date
      };

      sensor_data.insertOne(data);
    }

    if (tank_value && sensor_tank_value && litros_in && litros_out && litros_totales) {
      const sensor_data = db.collection('sensor_ultrasonic');
      data = {
        device: mac,
        percent: tank_value,
        tank_value: sensor_tank_value,
        litros_in: litros_in,
        litros_out: litros_out,
        litros_total: litros_totales,
        date: date
      };
  
      sensor_data.insertOne(data);
    }

    if (data_transfer) {
      const sensor_data = db.collection('sensor_transfer');
      data = {
        device: mac,
        data: data_transfer,
        date: date
      };
  
      sensor_data.insertOne(data);
    }

    console.log(data);

    // response to the client
    res.send(`Data saved on db: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log('server on api/save', error);
  }
});

//API endpoint for get configuration 
app.get('/api/getconfig', async (req, res) => {
  
  const config = db.collection('sensor_configuration');
  const data = config || {};
  res.send('Config');
});

//API endpoint for get configuration 
app.get('/api/setconfig', async (req, res) => {
  
  try {
    // const {} = req.query;
    // const config = db.collection('sensor_configuration');

    // data = {

    // };

    // config.insertOne(data);
    res.send(`Config Saved`);
  } catch (error) {
    console.log(error);
  }
});

// when user connect to web socket
io.on('connection',  async (socket) => {

  await getDbConnect();
  const collectionsToSend = [
    {
      collectionName: 'sensor_data',
      socketEvent: 'sensor_data',
      limit: 20
    },
    {
      collectionName: 'sensor_ultrasonic',
      socketEvent: 'sensor_ultrasonic_data',
      limit: 1
    },
    {
      collectionName: 'sensor_transfer',
      socketEvent: 'sensor_transfer_data',
      limit: 20
    }
  ]

  const sendData = async (collectionName, socketEvent, limit) => {
    const collection = db.collection(collectionName);
    const data = await collection.find().sort({ _id: -1 }).limit(limit).toArray();
    if (collectionName === 'sensor_transfer' && data.length > 0) {
      formatTransferData(data);
    }
    socket.emit(socketEvent, data);
  }

  const sendAllData = () => {
    collectionsToSend.forEach(collection => {
      sendData(collection.collectionName, collection.socketEvent, collection.limit)
    })
  }

  // send data to client socket, then every two seconds send again
  sendAllData()

  setInterval(() => { 
    sendAllData()
  }, 2000);

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
