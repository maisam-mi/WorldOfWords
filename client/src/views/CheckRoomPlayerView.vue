<template>
  <main class="flex flex-col gap-[4rem]">
    <div class="text-left">
      <p class="text-[30pt]">A</p>
      <p>Here you can see the answers of all players.</p>
      <p class="text-[13pt]">
        ! The admin chooses the right answers.
      </p>
    </div>
    <table>
      <tr>
        <th>Players</th>
        <th v-for="category in myStore.lobby.categories" :key="category">{{ category }}</th>
      </tr>
      <tr v-for="player in myStore.lobby.players" :key="player.name">
        <td>{{ player.name }}</td>
        <td v-for="word in player.progress[myStore.lobby.rounds.length - 1].words" :key="word">
          {{ word.value }} <img src="icons/check_mark.svg" alt="check_mark" :style="{ opacity: word.wordPoints == 10 ? '1' : '0.5' }" />
        </td>
      </tr>
    </table>
    <div class="flex justify-between">
      <button @click="leaving()">Cancel the game</button>
    </div>
  </main>
</template>

<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';

const myStore = mainStore();
const router = useRouter();

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

myStore.socket.on('you are not the admin of this lobby', () => {
  window.alert('you are not the admin of this lobby!');
});

myStore.socket.on('the game is finished', () => {
  router.push('/result');
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
tr:last-child{
  border-bottom: none;
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
