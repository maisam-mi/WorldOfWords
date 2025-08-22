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
      <tr v-for="player in myStore.lobby.players" :key="player.id">
        <td>{{ player.name }}</td>
        <td>Name</td>
        <td>Animal</td>
        <td>Country</td>
        <td>Food</td>
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

console.log(myStore.lobby);

const categories = ['Name', 'Animal', 'Country', 'Food'];

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
  width: 100%;
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
</style>
