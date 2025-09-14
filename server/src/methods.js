import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * It creates a lobby and adds the admin in the players property. 
 * @param {string} adminId - The unique id of the admin
 * @param {string} adminName - The name of the admin
 * @returns {object} The created lobby
 */
export const createLobby = (adminId, adminName) => {
  console.log(adminId, 'step 2.1: lobby is created and the player is its admin.');

  // the lobby is created and added to lobbies array
  const lobby = {
    url: uuidv4(),
    timelimit: null, // I have to think about
    countOfRounds: 1,
    selfcheck: true,
    categories: ['Name', 'Animal', 'Country', 'Food'],
    players: [
      {
        id: adminId,
        name: adminName,
        isAdmin: true,
        playerPoints: 0,
        progress: [],
      },
    ],
    rounds: [],
  };

  return lobby;
};

/**
 * It creates an object for a player 
 * @param {string} playerId - The unique id of the player
 * @param {string} playerName - The name of the player
 * @returns {object} The created player
 */
export const createPlayer = (playerId, playerName) => {
  console.log(playerId, 'step 2.2.1: player object is created.');
  
  const player = {
    id: playerId,
    name: playerName,
    isAdmin: false,
    playerPoints: 0,
    progress: [],
  };

  return player;
};

export const resetLobby = async (lobby) => {
  console.log(lobby.url, 'step ?.1: lobby is reset.');

  lobby.rounds = [];
  for (let index = 0; index < lobby.players.length; index++) {
    const player = lobby.players[index];
    player.playerPoints = 0;
    player.progress = [];
  }
};

/**
 * It removes the player from the property players of a lobby. 
 * @param {*} playerId - The unique id of the player 
 * @param {*} lobby
 */
export const removePlayerFromLobby = async (playerId, lobby) => {
  console.log(playerId, 'step 2.3: player is removed from lobby.');

  // remove the player from lobby.
  lobby.players = lobby.players.filter((player) => player.id != playerId);
};

/**
 * It generates a random letter. 
 * @returns {string} The random letter
 */
export const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWZ';
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  if (alphabet[randomIndex] === '') return generateRandomLetter();
  return alphabet[randomIndex];
};

export const createWords = (categories) => {
  let words = [];

  categories.map((paramCategory) => {
    words.push({
      category: paramCategory,
      value: '',
      wordPoints: 0,
    });
  });

  return words;
};

export const storeInputWords = (words, paramWords) => {
  for (let index = 0; index < words.length; index++) {
    words[index].value = paramWords.find((cate) => cate.category == words[index].category).label;
  }
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
