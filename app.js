const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000 || process.env.PORT
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const db = requre('./utils/database')
const formatMessage = require('./utils/utils')

app.use(express.static(path.join(__dirname, 'public')));

//establish socket connection
io.on('connection', (socket) => {
    console.log('a user connected');

    //distribute any user messages to all connected clients
    socket.on('chat message', (msg) => {
      io.emit('message', formatMessage(msg));
    });

    socket.on('disconnect', () => {
      console.log('a user has disconnected')
    })
  });
  
  
http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})