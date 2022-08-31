const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const getConnection = require('./db.connection');
const { json } = require('body-parser');

// get config vars env
dotenv.config({ path: './config1.env' });

// init server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


// API endpoint for saving sensor data
app.get('/api/save', async (req, res) => {
  const db = await getConnection();

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
      litros_totales
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

    console.log(data);

    // response to the client
    res.send(`Data saved on db: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log('server on api/save', error);
  }
});

// when user connect to web socket
io.on('connection',  async (socket) => {

  const db = await getConnection();
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
    }
  ]

  const sendData = async (collectionName, socketEvent, limit) => {
    const collection = db.collection(collectionName);
    const data = await collection.find().sort({ _id: -1 }).limit(limit).toArray();
    socket.emit(socketEvent, data)
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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));