import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:8080'],
  },
});

let users = [];

let lobbies = [];


const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWZ';
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  if (alphabet[randomIndex] === '') return generateRandomLetter();
  return alphabet[randomIndex];
};

const checkAnswer = async (label, category, letter) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  if (label === '' || label === ' ' || label.length <= 1) {
    const result = 'falsch';
    return result;
  } else {
    const prompt = `Ist ${label} ein ${category}, das mit der Buchstabe ${letter} anfängt, dann antworte mir nur mit 'Ja', ansonsten mit 'Nein'`;
    const result = await model.generateContent(prompt);
    const { response } = result;
    const text = response.text();
    return text;
  }
};

// the Client is connected to server!
io.on('connection', (socket) => {
  // user is created and added to users array
  const user = { id: socket.id, name: null, role: null };
  users.push(user);
  console.log(`Step 1: The user ${socket.id} is connected!`);

  // #region make the user an admin
  socket.on('connected as admin', (id, role, username) => {
    users.find((el) => el.id === id).role = role;
    users.find((el) => el.id === id).name = username;
    console.log(`Step 2: The user ${id}: ${username} is ${role}.`);

    // the lobby is created and added to lobbies array
    const lobby = {
      url: uuidv4(),
      admin: users.find((el) => el.id === id),
      players: [users.find((el) => el.id === id)],
      rounds: [],
      result: [{ id, name: username, points: 0 }],
    };
    lobbies.push(lobby);


    socket.join(lobby.url);
    io.to(lobby.url).emit('user receive your lobby', lobby);
  });
  // #endregion

  // #region make the user a player
  socket.on('connected as player', (id, role, username) => {
    users.find((el) => el.id === id).role = role;
    users.find((el) => el.id === id).name = username;

    console.log(`Step 2: The user ${id}: ${username} is ${role}.`);

    socket.on('send me the lobby', (url) => {
      const lobby = lobbies.find((el) => el.url === url);
      lobby.players.push(user);
      lobby.result.push({ id, name: username, points: 0 });

      socket.join(lobby.url);
      io.to(lobby.url).emit('user receive your lobby', lobby);
    });
  });
  // #endregion

  // #region Admin can kick a player out of lobby
  socket.on('kick the player', (paramUrl, playerId) => {
    const lobby = lobbies.find((el) => el.url === paramUrl);
    lobby.players = lobby.players.filter((el) => el.id !== playerId);
    lobby.result = lobby.result.filter((el) => el.id !== playerId);
    io.to(lobby.url).emit('user receive your lobby', lobby);
    io.to(playerId).emit('You habe been kicked from lobby', 'You have been removed by the admin!');

    console.log('The player has been kicked!');
  });
  // #endregion

  // #region the player leaving
  socket.on('Im leaving, overwrite the lobby', (paramUrl) => {
    const lobby = lobbies.find((el) => el.url === paramUrl);
    lobby.players = lobby.players.filter((el) => el.id !== socket.id);
    lobby.result = lobby.result.filter((el) => el.id !== socket.id);
    io.to(lobby.url).emit('user receive your lobby', lobby);
    console.log('The player left the lobby!');

    const leavingUser = users.find((el) => el.id === socket.id);
    leavingUser.role = null;
    console.log(`The user ${socket.id}: ${leavingUser.name} has no role!`);
    leavingUser.name = null;

    socket.leave(lobby.url);
  });
  // #endregion

  //#region the admin leaving
  socket.on('Im leaving, remove the lobby', (paramUrl) => {
    const lobby = lobbies.find((el) => el.url === paramUrl);
    lobby.players = lobby.players.filter((el) => el.id !== socket.id);
    io.to(lobby.url).emit('the lobby is removed', 'Sorry guys!');
    console.log('The player left the lobby!');

    const leavingUser = users.find((el) => el.id === socket.id);
    leavingUser.role = null;
    console.log(`The user ${socket.id}: ${leavingUser.name} has no role!`);
    leavingUser.name = null;

    socket.leave(lobby.url);
  });
  //#endregion

  // #region the game is running
  socket.on('start the game', async (url) => {
    if (socket.rooms.has(url)) {
      const lobby = lobbies.find((el) => el.url === url);

      // round is created and added to the list rounds of lobby
      const round = { letter: null, wordLists: [] };
      round.letter = generateRandomLetter();

      lobby.rounds.push(round);

      io.to(lobby.url).emit('navigate to letter', round.letter);
    } else {
      console.log('Step 3: The socket is not joined in room!');
    }
  });
  // checking the words
  socket.on('take my words for this round!', async (url, wordlist) => {
    let lobby = lobbies.find((el) => el.url === url);

    if (!lobby) {
      console.log('Lobby not found!');
      return;
    }

    socket.join(lobby.url);
    if (socket.rooms.has(lobby.url)) {
      lobby.rounds[0].wordLists.push(wordlist);
      //#region  Jedes eingegebene Wort überprüfen
      for (let el of lobby.rounds[0].wordLists) {
        for (let i = 0; i < el.labels.length; i++) {
          const answer = await checkAnswer(
            el.labels[i].label,
            el.labels[i].category,
            lobby.rounds[0].letter,
          );
          if (answer === 'Ja') {
            el.labels[i].points = 20;
          } else {
            el.labels[i].points = 0;
          }
        }
      }
      //#endregion
      //#region summing the points
      if (lobby.rounds[0].wordLists.length === lobby.result.length) {
        if (socket.id === lobby.admin.id) {
          lobby.rounds.forEach((round) => {
            round.wordLists.forEach((wordList) => {
              lobby.result.forEach((result) => {
                if (wordList.userid === result.id) {
                  result.points += wordList.labels.reduce((acc, cur) => acc + cur.points, 0);
                }
              });
            });
          });
        }
      }
      //#endregion
      lobby.result.sort((a, b) => b.points - a.points);
      io.to(lobby.url).emit('user receive your lobby', lobby);
    } else {
      console.log('Step 4: The socket is not joined in room!', socket.rooms);
    }
  });
  // #endregion
  // The user is disconnected
  socket.on('disconnect', () => {
    console.log(`Step 3: The user ${socket.id} disconnected!`);

    // If the disconnected user is an admin, the lobby is removed.
    lobbies = lobbies.filter((el) => el.admin.id !== socket.id);

    users = users.filter((el) => el.id !== socket.id);
  });
});

server.listen(3000, () => console.log('server running on Port 3000'));
