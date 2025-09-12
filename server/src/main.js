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
let categories = ['Name', 'Animal', 'Country', 'Food'];

// the Client is connected to server!
io.on('connection', (socket) => {
  console.log(socket.id, 'step 1: user attended the game.');
  io.emit('receive the available categories', categories);

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
      while (!letterAccepted) {
        if (lobby.rounds.find((round) => round == letter)) {
          letter = methods.generateRandomLetter();
        } else {
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
        });
      });
      // send the changes to all players
      io.to(lobby.url).emit('navigate to letter', lobby);
    } else {
      console.log(socket.id, ': this user is not admin of the lobby.');
      socket.emit('you are not the admin of this lobby');
    }
  });

  // every round the words are recieved from client.
  socket.on('take my words for this round', async (lobbyUrl, paramRound, paramWords) => {
    // To check whether this client belongs to the lobby.
    let lobby = lobbies.find((el) => el.url === lobbyUrl);
    if (!lobby) {
      console.log(socket.id, ': the lobby is not found.');
      socket.emit('the lobby is not found');
    } else {
      let player = lobby.players.find((player) => player.id == socket.id);
      // If client dosnt belong to the lobby, it will be leaded to the startpage.
      if (!player) {
        console.log(socket.id, ': the client dosnt belong to the lobby.');
        socket.emit('you are not a player of this lobby');
      }
      // the client is found in the lobby.
      else {
        // store his words in lobby.
        let words = player.progress.find((el) => el.round == paramRound).words;
        for (let index = 0; index < words.length; index++) {
          words[index].value = paramWords.find(
            (cate) => cate.category == words[index].category,
          ).label;
        }
        socket.emit('user receive your lobby', lobby);
      }
    }
  });

  // its been decided for checking the words, which client should see what?
  socket.on('decide my next view', (lobbyUrl) => {
    let lobby = lobbies.find((el) => el.url === lobbyUrl);
    if (!lobby) {
      console.log(socket.id, ': the lobby is not found.');
      socket.emit('the lobby is not found');
    } else {
      const admin = lobby.players.find((player) => player.id == socket.id);
      if (admin.isAdmin) {
        socket.emit('you go to check');
      } else {
        socket.emit('you go to review');
      }
    }
  });

  // the client (admin) accepts, the the given word in parameter is correct.
  socket.on('calculate Points', (lobbyUrl, wordsOwnerId, wordsCategory) => {
    let lobby = lobbies.find((el) => el.url === lobbyUrl);
    if (!lobby) {
      console.log(socket.id, ': the lobby is not found.');
      socket.emit('the lobby is not found');
    } else {
      const admin = lobby.players.find((player) => player.id == socket.id);
      if (admin.isAdmin) {
        const player = lobby.players.find((player) => player.id == wordsOwnerId);
        const progress = player.progress;
        const round = progress[lobby.rounds.length - 1];
        const word = round.words.find((word) => word.category == wordsCategory);
        if (word.wordPoints == 0) {
          word.wordPoints += 10;
          round.roundPoints += 10;
          player.playerPoints += 10;
        } else {
          word.wordPoints -= 10;
          round.roundPoints -= 10;
          player.playerPoints -= 10;
        }
        io.to(lobby.url).emit('user receive your lobby', lobby);
      } else {
        console.log(socket.id, ': this user is not admin of the lobby.');
        socket.emit('you are not the admin of this lobby');
      }
    }
  });

  // the client (admin) controlls, whether the players have to go to reuslt or the next round.
  socket.on('go to result or next round', (lobbyUrl) => {
    let lobby = lobbies.find((el) => el.url === lobbyUrl);
    if (!lobby) {
      console.log(socket.id, ': the lobby is not found.');
      socket.emit('the lobby is not found');
    } else {
      const admin = lobby.players.find((player) => player.id == socket.id);
      if (admin.isAdmin) {
        if (lobby.rounds.length == lobby.countOfRounds) {
          io.to(lobby.url).emit('the game is finished');
        } else {
          io.to(lobby.url).emit('go to the next round');
        }
      } else {
        console.log(socket.id, ': this user is not admin of the lobby.');
        socket.emit('you are not the admin of this lobby');
      }
    }
  });

  // for second and other rounds
  socket.on('letter for the next round', async (lobbyUrl) => {
    // to check whether this is the admin
    let lobby = lobbies.find((lobby) => lobby.url == lobbyUrl);
    const admin = lobby.players.find((player) => player.id == socket.id);
    if (admin.isAdmin) {
      // a letter is randomly chosen.
      let letterAccepted = false;
      let letter = methods.generateRandomLetter();
      while (!letterAccepted) {
        if (lobby.rounds.find((round) => round == letter)) {
          letter = methods.generateRandomLetter();
        } else {
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
        });
      });
      // send the changes to all players
      io.to(lobby.url).emit('navigate to letter', lobby);
    } else {
      console.log(socket.id, ': this user is not admin of the lobby.');
      socket.emit('you are not the admin of this lobby');
    }
  });

  // A client wants to restart the game with the same players. 
  socket.on('go back to lobbyroom', (lobbyUrl) => {
    // to see who the client is, a player or admin
    let lobby = lobbies.find((lobby) => lobby.url == lobbyUrl);
    methods.resetLobby(lobby);
    const admin = lobby.players.find((player) => player.id == socket.id);
    if (admin.isAdmin) {
      socket.emit('admin go to gameroomhost');
    } else {
      socket.emit('player go to gameroomplayer');
    }
    io.to(lobby.url).emit('user receive your lobby', lobby);
  });

  // the client is disconnected to server!
  socket.on('disconnect', () => methods.removePlayer(socket.id, lobbies));
});

server.listen(3000, () => console.log('server running on Port 3000'));
