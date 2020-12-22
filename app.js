const express = require('express')
const app = express()
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));


io.on('connection', (socket) => {
    console.log('a user connected');
  });
  
  
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})