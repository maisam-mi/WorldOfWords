<template>
  <main class="flex flex-col gap-[4rem]">
    <div class="flex justify-evenly">
      <div>
        <p>Timelimit</p>
        <p>01:05</p>
      </div>
      <div>
        <p>Rounds</p>
        <p>5</p>
      </div>
      <div>
        <p>Who checks the words?</p>
        <div class="mt-2 flex justify-center">
          <img src="icons/players.svg" alt="players button" class="w-8" />
        </div>
      </div>
    </div>
    <div class="text-left">
      <p>Categories:</p>
      <div class="mt-2 flex gap-4">
        <span for="name">Name</span>
        <span for="city">City</span>
        <span for="food">Food</span>
        <span for="sport">Sport</span>
      </div>
    </div>
    <table>
      <tbody>
        <tr v-for="player in myStore.lobby.players" :key="player.id" class="flex items-center">
          <td><img v-show="player.isAdmin" src="icons/Admin.svg" alt="admin" class="w-8" /></td>
          <td class="name-data" colspan="2">{{ player.name }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-between">
      <button @click="leaving()">Leave the Lobby</button>
      <!-- <button @click="copyContent()">Invite Players</button> -->
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

myStore.socket.on('navigate to letter', () => {
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

</script>

<style scoped>
button {
  padding: 15px 30px;
}

table {
  border-collapse: collapse;
  width: 100%;
}
tr {
  border-bottom: 3px solid #eaeaea;
}
td {
  width: 20%;
  padding: 10px;
  padding-left: 2rem;
}

.name-data {
  width: 60%;
  text-align: left;
}
</style>
