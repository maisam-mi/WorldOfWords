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

let lobbies = [];
let categories = [];

// the Client is connected to server!
io.on('connection', (socket) => {
  console.log(socket.id, 'step 1: user attended the game.');

  // 1. a lobby is created and the client becomes its admin.
  socket.on('lobby and admin creation', async (playerName) => {
    const lobby = await methods.createLobby(socket.id, playerName, lobbies);

    // Should I send a lobby with different structure to every player?
    socket.join(lobby.url);
    io.to(lobby.url).emit('user receive your lobby', lobby); // Here the whole lobby is sent to admin.
  });

  // 2. the client is added to a lobby.
  socket.on('entering the lobby', async (playerName, lobbyUrl) => {
    const lobby = await methods.enterLobby(socket.id, playerName, lobbies, lobbyUrl);

    // Should I send a lobby with different structure to every player?
    socket.join(lobby.url);
    io.to(lobby.url).emit('user receive your lobby', lobby); // Here the whole lobby is sent to player.
  });

  // the client is removed from the lobby.
  socket.on('remove the player from lobby', async (lobbyUrl, playerId) => {
    // to check whether this is the admin
    let lobby = lobbies.find((lobby) => lobby.url == lobbyUrl);
    const admin = lobby.players.find((player) => player.id == socket.id);
    if (admin.isAdmin) {
      // remove the player from lobby
      lobby = await methods.removePlayerFromLobby(lobbyUrl, playerId, lobbies);
      // send the changes to all players
      io.to(playerId).emit('you have been kicked from lobby');
      io.to(lobby.url).emit('user receive your lobby', lobby); // Here the whole lobby is sent to player.
    } else {
      console.log(socket.id, ': this user is not admin of the lobby.');
      socket.emit('you are not the admin of this lobby');
    }
  });

  // the client left the lobby.
  socket.on('im leaving the lobby', async (lobbyUrl) => {
    // to check whether this is the admin or a player
    let lobby = lobbies.find((lobby) => lobby.url == lobbyUrl);
    const admin = lobby.players.find((player) => player.id == socket.id);
    if (admin.isAdmin) {
      // delete the lobby
      lobbies = lobbies.filter((lobby) => lobby.url != lobbyUrl);
      // make all players leave the lobby
      io.to(lobbyUrl).emit('the lobby is removed');
    } else {
      // remove the player from lobby
      lobby = await methods.removePlayerFromLobby(lobbyUrl, socket.id, lobbies);
      // send the changes to remained players
      io.to(lobby.url).emit('user receive your lobby', lobby); // Here the whole lobby is sent to player.
    }
  });

  // through admins request the game starts
  socket.on('start the game', async (lobbyUrl) => {
    // to check whether this is the admin
    let lobby = lobbies.find((lobby) => lobby.url == lobbyUrl);
    const admin = lobby.players.find((player) => player.id == socket.id);
    if (admin.isAdmin) {
      // a letter is randomly chosen.
      let letterAccepted = false;
      let letter = methods.generateRandomLetter();
      while (!letterAccepted){
        if(lobby.rounds.find((round) => round == letter))
        {
          letter = methods.generateRandomLetter();
        }
        else
        {
          letterAccepted = true;
          lobby.rounds.push(letter);
        }
      }
      // the letter is added to the lobby and the first round is initated. 
      lobby.players.map((player) => {
        player.progress.push({
          round: letter,
          words: methods.createWords(lobby.categories),
          roundPoints: 0,
        })
      });
      // send the changes to all players
      io.to(lobby.url).emit('navigate to letter', lobby);
    } else {
      console.log(socket.id, ': this user is not admin of the lobby.');
      socket.emit('you are not the admin of this lobby');
    }
  });

  // the client is disconnected to server!
  socket.on('disconnect', () => methods.removePlayer(socket.id, lobbies));
});

server.listen(3000, () => console.log('server running on Port 3000'));
