import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';

const useDefaultStore = defineStore(
  'DefaultId',
  () => {
    const socket = io('http://localhost:3000');

    // #region private Änderung
    const lobby = ref(null);

    const url = ref(lobby.url);

    const letter = ref('');

    const wordlist = ref({
      userid: socket.id,
      labels: [
        {
          category: 'Land',
          label: '',
          points: 0,
        },
        {
          category: 'Tier',
          label: '',
          points: 0,
        },
        {
          category: 'Fluss',
          label: '',
          points: 0,
        },
        {
          category: 'Name',
          label: '',
          points: 0,
        },
        {
          category: 'Arbeit',
          label: '',
          points: 0,
        },
      ],
    });

    const updateLobby = () => {
      socket.on('user receive your lobby', (paramLobby) => {
        lobby.value = paramLobby;
      });
    };

    const getResult = () => {
      socket.on('give me the result', (paramLobby) => {
        console.log('My lobby: ', paramLobby);
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
      wordlist.value = {
        userid: socket.id,
        labels: [
          {
            category: 'Land',
            label: '',
            points: 0,
          },
          {
            category: 'Tier',
            label: '',
            points: 0,
          },
          {
            category: 'Fluss',
            label: '',
            points: 0,
          },
          {
            category: 'Name',
            label: '',
            points: 0,
          },
          {
            category: 'Arbeit',
            label: '',
            points: 0,
          },
        ],
      };
    };
    // #endregion

    return {
      socket,
      lobby,
      letter,
      wordlist,
      url,
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

export default useDefaultStore;
