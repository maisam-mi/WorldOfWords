import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const createLobby = async (playerId, playerName, lobbies) => {
  console.log(playerId, 'step 2: lobby is created and the player is its admin.');

  // the lobby is created and added to lobbies array
  const lobby = {
    url: uuidv4(),
    timelimit: null, // I have to think about
    countOfRounds: 1,
    selfcheck: true,
    categories: [],
    players: [
      {
        id: playerId,
        name: playerName,
        isAdmin: true,
        playerPoints: 0,
        progress: [],
      },
    ],
    rounds: [],
  };
  lobbies.push(lobby);

  return lobby;
};

export const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWZ';
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  if (alphabet[randomIndex] === '') return generateRandomLetter();
  return alphabet[randomIndex];
};

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export const checkAnswer = async (label, category, letter) => {
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

export const removePlayer = async (playerId, lobbies) => {
  console.log(playerId, 'step ?: user exited the game!');
  // If the disconnected user is an admin, the lobby is removed.
  // lobbies = lobbies.filter((el) => el.admin.id !== socket.id);

  // users = users.filter((el) => el.id !== socket.id);
};
