const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const getConnection = require('./db.connection');

// get config vars env
dotenv.config({ path: './config1.env' });

// init server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// when user connect to web socket
io.on('connection',  async (socket) => {

  const db = await getConnection()
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