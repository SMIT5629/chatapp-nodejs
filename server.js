const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('setUsername', (username) => {
    users[socket.id] = username;
    io.emit('userJoined', `${username} joined the chat`);
  });

  socket.on('chatMessage', (msg) => {
    const username = users[socket.id] || "Unknown";
    io.emit('chatMessage', { username, message: msg });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      io.emit('userLeft', `${username} left the chat`);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`LAN Chat running at http://localhost:${PORT}`);
});
