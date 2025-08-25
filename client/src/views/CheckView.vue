<template>
  <main class="flex flex-col gap-[4rem]">
    <div class="text-left">
      <p class="text-[30pt]">A</p>
      <p>What is your opinion about the answers?</p>
      <p class="text-[13pt]">
        ! Click on <img src="icons/check_mark.svg" alt="check_mark" /> for agreement.
      </p>
    </div>
    <table>
      <tr>
        <th>Players</th>
        <th v-for="category in categories" :key="category">{{ category }}</th>
      </tr>
      <tr v-for="player in players" :key="player.name">
        <td>{{ player.name }}</td>
        <td v-for="word in player.progress[0].words" :key="word">
          {{ word.value }} <img src="icons/check_mark.svg" alt="check_mark" />
        </td>
      </tr>
    </table>
    <div class="flex justify-between">
      <button @click="leaving()">Cancel the game</button>
      <button @click="goToNextRound()">Next Round</button>
    </div>
  </main>
</template>

<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';

const myStore = mainStore();
const router = useRouter();

const categories = ['Name', 'Animal', 'Country', 'Food'];

const players = [
  {
    name: 'Maisam',
    progress: [
      {
        round: 'A',
        words: [
          {
            category: 'Name',
            value: 'Andy',
            wordsPoints: 0,
          },
          {
            category: 'Animal',
            value: '',
            wordsPoints: 0,
          },
          {
            category: 'Country',
            value: 'Argentina',
            wordsPoints: 0,
          },
          {
            category: 'Food',
            value: 'Almond Oil',
            wordsPoints: 0,
          },
        ],
        roundPoints: 0,
      },
    ],
  },
  {
    name: 'Rana',
    progress: [
      {
        round: 'A',
        words: [
          {
            category: 'Name',
            value: 'Armin',
            wordsPoints: 0,
          },
          {
            category: 'Animal',
            value: 'Alligator',
            wordsPoints: 0,
          },
          {
            category: 'Country',
            value: 'Angola',
            wordsPoints: 0,
          },
          {
            category: 'Food',
            value: 'Almond Oil',
            wordsPoints: 0,
          },
        ],
        roundPoints: 0,
      },
    ],
  },
  {
    name: 'Anar',
    progress: [
      {
        round: 'A',
        words: [
          {
            category: 'Name',
            value: 'Anar',
            wordsPoints: 0,
          },
          {
            category: 'Animal',
            value: '',
            wordsPoints: 0,
          },
          {
            category: 'Country',
            value: 'Albany',
            wordsPoints: 0,
          },
          {
            category: 'Food',
            value: '',
            wordsPoints: 0,
          },
        ],
        roundPoints: 0,
      },
    ],
  },
  {
    name: 'Oktalon',
    progress: [
      {
        round: 'A',
        words: [
          {
            category: 'Name',
            value: 'Ali',
            wordsPoints: 0,
          },
          {
            category: 'Animal',
            value: 'Aardwolf',
            wordsPoints: 0,
          },
          {
            category: 'Country',
            value: '',
            wordsPoints: 0,
          },
          {
            category: 'Food',
            value: '',
            wordsPoints: 0,
          },
        ],
        roundPoints: 0,
      },
    ],
  },
];

const leaving = () => {
  myStore.socket.emit('im leaving the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

myStore.socket.on('navigate to letter', (paramLetter) => {
  myStore.letter = paramLetter;
  router.replace('/letter');
});

myStore.socket.on('you have been kicked from lobby', () => {
  myStore.clearStore();
  console.log('You have been kicked from the lobby!');
  window.location = 'http://localhost:8080/';
});

myStore.socket.on('the lobby is removed', () => {
  myStore.clearStore();
  console.log('the lobby is removed!');
  window.location = 'http://localhost:8080/';
});

myStore.updateLobby();
</script>

<style scoped>
button {
  padding: 15px 30px;
}

table {
  width: auto;
  border-collapse: collapse;
}
tr {
  border-bottom: 3px solid #aeaeae;
}
th,
td {
  border-right: 3px solid #aeaeae;
  padding: 1rem 2rem;
}

p img {
  width: 1rem;
  display: inline;
  margin: 0px 2px;
}

td img {
  width: 1.25rem;
  float: right;
  display: inline;
  margin: 4px 0px;
  opacity: 0.5;
}
</style>
