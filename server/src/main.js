import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import * as methods from './methods.js';

dotenv.config();

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:8080'],
  },
});

let users = [];
let lobbies = [];
let categories = [];

// the Client is connected to server!
io.on('connection', (socket) => {
  console.log(socket.id, 'step 1: user attended the game.');

  // a lobby is created and this client becomes its admin.
  socket.on('lobby and admin creation', (playerName) =>
    methods.createLobby(socket.id, playerName, lobbies),
  );

  // the client is disconnected to server!
  socket.on('disconnect', () => methods.removePlayer(socket.id, lobbies));
});

server.listen(3000, () => console.log('server running on Port 3000'));
