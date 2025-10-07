import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';

const mainStore = defineStore(
  'main Store',
  () => {
    const socket = io('http://localhost:3000');

    const categories = ref([]);

    // #region private Änderung
    const lobby = ref(null);

    const inputWords = ref([
      {
        category: 'Name',
        label: '',
      },
      {
        category: 'Animal',
        label: '',
      },
      {
        category: 'Country',
        label: '',
      },
      {
        category: 'Food',
        label: '',
      },
    ]);

    const ranks = ref(null);

    const getCategories = () => {
      socket.on('receive the available categories', (paramCategories) => {
        categories.value = paramCategories;
      });
    };

    const updateLobby = () => {
      socket.on('user receive your lobby', (paramLobby) => {
        lobby.value = paramLobby;
      });
    };

    const updateRanks = () => {
      ranks.value = lobby.value.players.sort((a, b) => {
        return a.playerPoints - b.playerPoints;
      });
      ranks.value = ranks.value.reverse();
    };

    const getResult = () => {
      socket.on('give me the result', (paramLobby) => {
        lobby.value = paramLobby;
      });
    };

    const playerleaving = () => {
      socket.emit('Im leaving, overwrite the lobby', lobby.value.url);
    };

    const updateInputs = () => {
      inputWords.value = lobby.value.categories.map((temCategory) => {
        return {category: temCategory, label: ''};
      });
    };

    const clearStore = () => {
      lobby.value = null;
      inputWords.value = [
        {
          category: 'Name',
          label: '',
        },
        {
          category: 'Animal',
          label: '',
        },
        {
          category: 'Country',
          label: '',
        },
        {
          category: 'Food',
          label: '',
        },
      ];
    };
    // #endregion

    return {
      socket,
      categories,
      lobby,
      inputWords,
      ranks,
      getCategories,
      updateLobby,
      updateRanks,
      getResult,
      playerleaving,
      updateInputs,
      clearStore,
    };
  },
  {
    persist: true,
  },
);

export default mainStore;
