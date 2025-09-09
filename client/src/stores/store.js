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

    const url = ref(lobby.url);

    const letter = ref('');

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

    const getCategories = () => {
      socket.on('receive the available categories', (paramCategories) => {
        categories.value = paramCategories;
      });
    }

    const updateLobby = () => {
      socket.on('user receive your lobby', (paramLobby) => {
        lobby.value = paramLobby;
      });
    };

    const getResult = () => {
      socket.on('give me the result', (paramLobby) => {
        lobby.value = paramLobby;
      });
    };

    const playerleaving = () => {
      socket.emit('Im leaving, overwrite the lobby', lobby.value.url);
    };

    const clearStore = () => {
      lobby.value = null;
      url.value = null;
      letter.value = '';
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
      lobby,
      letter,
      inputWords,
      url,
      getCategories,
      updateLobby,
      getResult,
      playerleaving,
      clearStore,
    };
  },
  {
    persist: true,
  },
);

export default mainStore;
